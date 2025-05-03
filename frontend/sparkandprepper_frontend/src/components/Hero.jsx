import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative w-full min-h-[80vh] flex items-stretch overflow-hidden" style={{height: 'calc(100vh - 5rem)'}}>
      {/* Left: Content */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 py-16 lg:py-32 z-10 bg-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Master Your Studies<br />with
          <span className="block mt-2">
            <span className="text-yellow-500">Spark</span>
            <span className="text-black">&nbsp;and&nbsp;</span>
            <span className="text-blue-600">Prep</span>
            <span className="text-black">per</span>
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl">
          Transform your learning experience with personalized study plans, interactive resources, and expert guidance. Join thousands of students who are achieving their academic goals with our innovative platform.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-semibold rounded-full shadow transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-semibold rounded-full shadow transition-colors duration-200 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            Learn More
          </Link>
        </div>
      </div>
      {/* Right: Gradient */}
      <div className="hidden lg:block absolute top-0 right-0 h-full w-1/2" style={{minHeight: '100%', height: '100%', zIndex: 1}}>
        <div className="h-full w-full" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 60%, #facc15 100%)'}}></div>
      </div>
    </div>
  );
};

export default Hero;
