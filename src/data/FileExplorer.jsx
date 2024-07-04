import React, { useState, useEffect } from "react";
import { FaFolder, FaFile, FaTh, FaList, FaSearch, FaChevronDown, FaChevronRight } from "react-icons/fa";
const FileExplorer = ({ fileSystem }) => {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const renderFileSystem = (items) => {
    return items.map((item) => (
      <div key={item.id} className="ml-4">
        {item.type === "folder" ? (
          <div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleFolder(item.id)}
            >
              {expandedFolders[item.id] ? (
                <FaChevronDown className="mr-2" />
              ) : (
                <FaChevronRight className="mr-2" />
              )}
              <FaFolder className="text-yellow-500 w-5 h-5 mr-2" />
              <span>{item.name}</span>
            </div>
            {expandedFolders[item.id] && item.children && (
              <div className="ml-4">{renderFileSystem(item.children)}</div>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <FaFile className="text-blue-500 w-5 h-5 mr-2" />
            <span>{item.name}</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div>{renderFileSystem(fileSystem)}</div>
    </div>
  );
};

export default FileExplorer;
