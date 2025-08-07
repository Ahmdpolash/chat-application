import React from "react";

const SidebarSkeleton = () => {
  return (
    <div className="flex flex-col space-y-2 ">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="flex flex-col animate-pulse">
          <div className="flex items-center justify-between dark:hover:bg-gray-300 hover:bg-gray-300 px-3 py-3 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="w-10px h-10px rounded-full bg-gray-400 absolute bottom-0 right-0"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="flex justify-center items-center flex-col space-y-1">
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
              <div className="rounded-full bg-gray-200 dark:bg-gray-500 text-white w-5 h-5 text-xs flex items-center justify-center mx-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarSkeleton;
