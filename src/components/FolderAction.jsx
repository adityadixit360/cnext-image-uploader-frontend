import React from "react";
import { PlusIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const FolderActions = ({
  viewType,
  setViewType,
  isAddingFolder,
  setIsAddingFolder,
  newFolderName,
  setNewFolderName,
  handleAddFolder,
  handleFileUpload,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {["all", "folders", "files"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded transition-colors ${
                viewType === type
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setViewType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <ActionButton
          icon={<PlusIcon className="h-6 w-6 text-gray-500 mr-2" />}
          text="Add Folder"
          onClick={() => setIsAddingFolder(!isAddingFolder)}
        />
        <ActionButton
          icon={<ArrowUpTrayIcon className="h-6 w-6 text-gray-500 mr-2" />}
          text="Upload File"
          onClick={() => document.getElementById("fileInput").click()}
        />
      </div>

      {isAddingFolder && (
        <div className="mb-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full mb-2"
            placeholder="Enter folder name"
          />
          <button
            onClick={handleAddFolder}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Folder
          </button>
        </div>
      )}

      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />
    </div>
  );
};

const ActionButton = ({ icon, text, onClick }) => (
  <div
    className="bg-gray-100 p-4 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 transition-colors shadow-sm shadow-blue-500"
    onClick={onClick}
  >
    {icon}
    <span className="text-gray-700">{text}</span>
  </div>
);

export default FolderActions;