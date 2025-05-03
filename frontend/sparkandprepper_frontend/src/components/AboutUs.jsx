import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white py-16 px-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 text-center">
          About <span className="text-yellow-500">Spark</span><span className="text-black">&nbsp;and&nbsp;</span><span className="text-blue-600">Prep</span><span className="text-black">per</span>
        </h1>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>
            Welcome to Spark and Prepper, your ultimate companion in the journey of learning and preparation. We're dedicated to helping students and professionals master their subjects through innovative study techniques and comprehensive resources.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to transform the way people learn and prepare for their academic and professional challenges. We believe in making quality education accessible, engaging, and effective for everyone.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Personalized study plans tailored to your needs</li>
            <li>Interactive learning materials and resources</li>
            <li>Progress tracking and performance analytics</li>
            <li>Community support and collaborative learning</li>
            <li>Expert guidance and mentorship</li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Join Us Today</h2>
          <p>
            Start your journey with Spark and Prepper and experience the difference in your learning journey. Whether you're preparing for exams, professional certifications, or personal growth, we're here to help you succeed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 