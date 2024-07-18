import React, { useState, useEffect } from "react";
import apiClient from "../../redux/apiClient";
import { FolderIcon } from "@heroicons/react/24/outline";

const FolderContents = ({ folderId }) => {
  const [folderItems, setFolderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolderItems = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(`/list-files/${folderId}/`);
        console.log(res?.data);
        const { files, folders } = res?.data;

        // Format files
        const formattedFiles = files.map((file) => ({
          id: file.Key,
          name: file.Key.split("/").pop(),
          lastModified: new Date(file.LastModified).toLocaleDateString(),
          type: "file",
        }));

        // Format folders
        const formattedFolders = folders.map((folder) => ({
          id: folder.folderName,
          name: folder.folderName.split("/").filter(Boolean).pop(), // Get folder name
          lastModified: new Date(folder.LastModified).toLocaleDateString(),
          totalItems: folder.FileCount + folder.FolderCount,
          type: "folder",
        }));

        const items = [...formattedFolders, ...formattedFiles];
        setFolderItems(items);
      } catch (error) {
        console.error("Error fetching folder contents:", error);
        setError("Failed to load folder contents. Please try again.");
      }
      setIsLoading(false);
    };

    if (folderId) {
      fetchFolderItems();
    }
  }, [folderId]);

  const handleFolderClick = (folder) => {
    // Handle navigation into subfolders here if needed
    console.log(`Clicked folder: ${folder.name}`);
    // Optionally, you can implement navigation logic to enter into subfolders
    // For simplicity, this example doesn't implement nested folder navigation
  };

  const renderFolder = (folder) => {
    return (
      <div
        key={folder.id}
        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center mb-2"
        onClick={() => handleFolderClick(folder)}
      >
        <FolderIcon className="h-6 w-6 flex-shrink-0 text-yellow-500 mr-4" />
        <span
          className="text-sm font-medium text-gray-900 truncate flex-grow"
          title={folder.name}
        >
          {folder.name}
        </span>
        <span className="text-sm text-gray-500 mr-4">
          {folder.type === "folder" ? `${folder.totalItems} items` : "File"}
        </span>
        <span className="text-sm text-gray-500">{folder.lastModified}</span>
      </div>
    );
  };

  const renderNestedFolders = () => {
    return folderItems.map((item) => {
      if (item.type === "folder") {
        return (
          <div key={item.id}>
            {renderFolder(item)}
            {/* Recursively render nested folders */}
            <div className="ml-4">
              {/* Adjust margin as needed */}
              <FolderContents folderId={item.id} />
            </div>
          </div>
        );
      } else {
        return renderFolder(item);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return <div>{renderNestedFolders()}</div>;
};

export default FolderContents;
