import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FiFolder, FiUpload } from "react-icons/fi";

const CommonHeader = ({
  searchTerm,
  setSearchTerm,
  setIsUploadingFile,
  setIsAddingFolder,
  showSearch = false,
  showAddFolder = false,
  showUploadFile = false,
}) => {
  return (
    <div className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {showSearch && (
            <div className="relative mr-4 flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Search folders"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          )}
          <div className="flex items-center w-full sm:w-auto">
            {showAddFolder && (
              <button
                onClick={() => setIsAddingFolder(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap mr-2 flex items-center"
              >
                <FiFolder className="mr-2" />
                Add Folder
              </button>
            )}
            {showUploadFile && (
              <button
                onClick={() => setIsUploadingFile(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors whitespace-nowrap cursor-pointer flex items-center"
              >
                <FiUpload className="mr-2" />
                Upload File
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;