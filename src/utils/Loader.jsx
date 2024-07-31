import React from "react";

const Loader = ({ message = "Loading...", load }) => {
  return (
    <div className="flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 z-50 sm:ml-0 md:ml-0 lg:ml-60">
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-opacity-75"></div>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
