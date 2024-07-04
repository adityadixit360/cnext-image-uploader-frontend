import React, { useState, useEffect } from "react";
import { FaFolder, FaTh, FaBars } from "react-icons/fa";

const mockFolders = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Folder ${index + 1}`,
}));

const FolderView = ({ onFolderClick }) => {
  const [viewType, setViewType] = useState("grid");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleView = () => {
    setViewType((prevType) => (prevType === "grid" ? "list" : "grid"));
  };

  const handleFolderClick = (folderId) => {
    if (isMobile) {
      onFolderClick(folderId);
    }
  };

  return (
    <div className="p-4">
      <div
        className={
          viewType === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "flex flex-col items-start space-y-4"
        }
      >
        {mockFolders.map((folder) => (
          <div
            key={folder.id}
            className={`bg-white shadow-lg rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-100 ${
              viewType === "list" ? "w-full max-w-xs shadow-none" : ""
            }`}
            onClick={() => handleFolderClick(folder.id)}
            onDoubleClick={() => !isMobile && onFolderClick(folder.id)}
          >
            <div className="flex items-center justify-center mb-2">
              <FaFolder className="text-yellow-500 w-12 h-12" />
            </div>
            <p className="text-gray-800 font-semibold text-center">
              {folder.name}
            </p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 right-4">
        <button
          className="flex items-center px-3 py-2 bg-gray-800 text-white rounded shadow-lg"
          onClick={toggleView}
        >
          {viewType === "grid" ? <FaTh /> : <FaBars />}
        </button>
      </div>
    </div>
  );
};

export default FolderView;
