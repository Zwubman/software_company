import React from 'react';

const TeamSkeleton = () => {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="relative bg-white border border-gray-100 rounded-3xl p-6 pt-10 shadow-md animate-pulse"
        >
          <div className="w-24 h-24 mx-auto -mt-16 rounded-full overflow-hidden bg-gray-200"></div>
          <div className="mt-4 h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default TeamSkeleton;