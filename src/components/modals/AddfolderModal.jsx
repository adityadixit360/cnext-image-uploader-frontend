import React from "react";

const AddfolderModal = ({
  isOpen,
  onClose,
  newFolderName,
  setNewFolderName,
  currentFolder,
  setCurrentFolder,
  handleAddFolder,
  folders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Create New Folder</h2>
        <input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <select
          value={currentFolder}
          onChange={(e) => setCurrentFolder(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="/">Select Folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.name}>
              {folder.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFolder}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Create Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddfolderModal;
