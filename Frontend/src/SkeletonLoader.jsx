      import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="font-sans antialiased bg-gray-100 min-h-screen flex flex-col w-full">
      {/* Navigation Bar */}
      <div className="w-full bg-white shadow-xl p-8">
        <div className="w-4/5 mx-auto flex justify-between items-center">
          <div className="h-14 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex space-x-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-5 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-4/5 mx-auto mt-16">
        {/* Left Body */}
        <div className="w-2/3 pr-8">
          <div className="h-14 bg-gray-200 rounded-xl w-2/3 mb-6 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-xl w-full mb-8 animate-pulse"></div>
          <div className="h-14 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
          <div className="space-y-4 mt-10">
            <div className="h-5 bg-gray-200 rounded-xl w-full animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded-xl w-full animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded-xl w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-1/3 flex justify-center items-center">
          <div className="h-64 w-full bg-gray-200 rounded-xl animate-pulse shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;