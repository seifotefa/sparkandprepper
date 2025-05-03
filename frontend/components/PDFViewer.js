import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ url }) => {
  return (
    <div className="pdf-download">
      <a href={url} target="_blank" rel="noopener noreferrer" className="download-button">
        Download PDF
      </a>

      <style jsx>{`
        .pdf-download {
          text-align: center;
          padding: 20px;
        }

        .download-button {
          display: inline-block;
          padding: 12px 24px;
          background: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .download-button:hover {
          background: #0051cc;
        }
      `}</style>
    </div>
  );
};

export default PDFViewer; 