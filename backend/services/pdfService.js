class PDFService {
  constructor() {
    this.CACHE_DURATION = 60 * 60; // 1 hour in seconds
    this.THUMBNAIL_SIZE = 300; // width in pixels
  }

  async getSignedUrl(filename) {
    try {
      // Check cache first
      const cachedUrl = await redis.get(`pdf_url:${filename}`);
      if (cachedUrl) {
        return cachedUrl;
      }

      // Generate new signed URL
      const file = bucket.file(filename);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60, // 1 hour
        responseDisposition: 'inline',
        responseType: 'application/pdf'
      });

      // Cache the URL
      await redis.setex(`pdf_url:${filename}`, this.CACHE_DURATION, url);

      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  async optimizePDF(buffer) {
    try {
      const pdfDoc = await PDFDocument.load(buffer);
      
      // Compress PDF
      const compressedPdf = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        useCompression: true
      });

      return Buffer.from(compressedPdf);
    } catch (error) {
      console.error('Error optimizing PDF:', error);
      throw error;
    }
  }

  async generateThumbnail(pdfBuffer, filename) {
    try {
      // Convert first page to PNG
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pages = pdfDoc.getPages();
      if (pages.length === 0) return null;

      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      // Create a new document with just the first page
      const thumbnailDoc = await PDFDocument.create();
      const [copiedPage] = await thumbnailDoc.copyPages(pdfDoc, [0]);
      thumbnailDoc.addPage(copiedPage);
      
      const thumbnailPdf = await thumbnailDoc.save();
      
      // Convert to image and resize
      const image = await sharp(Buffer.from(thumbnailPdf))
        .resize(this.THUMBNAIL_SIZE, null, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toBuffer();

      // Upload thumbnail to Firebase
      const thumbnailPath = `thumbnails/${path.basename(filename, '.pdf')}.png`;
      await bucket.file(thumbnailPath).save(image, {
        metadata: {
          contentType: 'image/png',
          cacheControl: 'public, max-age=31536000'
        }
      });

      // Make thumbnail public
      await bucket.file(thumbnailPath).makePublic();

      return thumbnailPath;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  }

  async uploadPDF(buffer, filename) {
    try {
      // Optimize PDF
      const optimizedBuffer = await this.optimizePDF(buffer);
      
      // Upload to Firebase
      const file = bucket.file(filename);
      await file.save(optimizedBuffer, {
        metadata: {
          contentType: 'application/pdf',
          cacheControl: 'public, max-age=31536000'
        }
      });

      // Generate and upload thumbnail
      const thumbnailPath = await this.generateThumbnail(optimizedBuffer, filename);

      // Generate signed URL
      const url = await this.getSignedUrl(filename);

      return {
        url,
        thumbnailPath,
        size: optimizedBuffer.length
      };
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }

  async getPDFMetadata(filename) {
    try {
      // Check cache first
      const cachedMetadata = await redis.get(`pdf_metadata:${filename}`);
      if (cachedMetadata) {
        return JSON.parse(cachedMetadata);
      }

      const file = bucket.file(filename);
      const [metadata] = await file.getMetadata();
      const url = await this.getSignedUrl(filename);
      
      const thumbnailPath = `thumbnails/${path.basename(filename, '.pdf')}.png`;
      const thumbnailExists = await bucket.file(thumbnailPath).exists();

      const result = {
        filename,
        contentType: metadata.contentType,
        size: metadata.size,
        timeCreated: metadata.timeCreated,
        url,
        thumbnailUrl: thumbnailExists[0] ? 
          `https://storage.googleapis.com/${bucket.name}/${thumbnailPath}` : 
          null
      };

      // Cache metadata
      await redis.setex(
        `pdf_metadata:${filename}`, 
        this.CACHE_DURATION,
        JSON.stringify(result)
      );

      return result;
    } catch (error) {
      console.error('Error getting PDF metadata:', error);
      throw error;
    }
  }
}

module.exports = new PDFService(); 
