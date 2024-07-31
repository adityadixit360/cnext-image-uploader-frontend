import React, { useEffect, useRef, useState } from "react";

const AddFolderModal = ({
  isOpen,
  onClose,
  newFolderName,
  setNewFolderName,
  currentFolder,
  setCurrentFolder,
  handleAddFolder,
  folders,
  loadingState
}) => {
  const modalRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = () => {
    setDropdownOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
        setDropdownOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setNewFolderName('');
      setCurrentFolder('/');
    }
  }, [isOpen, setNewFolderName, setCurrentFolder]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-lg shadow-xl w-96 relative"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Folder</h2>
        <input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          onClick={handleClick}
        />
        <div className="relative mb-6">
          <button
            className="px-4 py-3 border border-gray-300 rounded-lg w-full text-left flex justify-between items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{currentFolder === "/" ? "Select Folder" : currentFolder}</span>
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 max-h-60 overflow-auto">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setCurrentFolder(folder.name);
                    setDropdownOpen(false);
                  }}
                >
                  {folder.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFolder}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {
              loadingState?"Creating Folder":"Create Folder"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;

