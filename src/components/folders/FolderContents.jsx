import React, { useState, useEffect } from "react";
import apiClient from "../../redux/apiClient";
import { FolderIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { FaFile } from "react-icons/fa6";
import Loader from "../../utils/Loader";
import ToggleViewModeButton from "../../utils/ToggleViewModeButton";
import Breadcrumb from "../breadcrumb/Breadcrumb";

const FolderContents = ({ initialFolderId }) => {
  const [folderId, setFolderId] = useState(initialFolderId);
  const [folderItems, setFolderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [path, setPath] = useState([
    { id: initialFolderId, name: initialFolderId },
  ]);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    const fetchFolderItems = async (folderId) => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(`/list-files/${folderId}/`);
        console.log(res?.data);
        const { files, folders } = res?.data;

        const formattedFiles = files.map((file) => ({
          id: file.Key,
          name: file.Key.split("/").pop(),
          lastModified: new Date(file.LastModified).toLocaleDateString(),
          type: "file",
        }));

        const formattedFolders = folders.map((folder) => ({
          id: folder.folderName,
          name: folder.folderName.split("/").filter(Boolean).pop(),
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
      fetchFolderItems(folderId);
    }
  }, [folderId]);

  const handleNavigate = (id, index) => {
    setPath((prevPath) => prevPath.slice(0, index + 1));
    setFolderId(id);
  };

  const handleFolderClick = (folder) => {
    setPath((prevPath) => [...prevPath, { id: folder.id, name: folder.name }]);
    setFolderId(folder.id);
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "grid" ? "list" : "grid"));
  };

  const renderItem = (item) => {
    const itemClasses =
      viewMode === "grid"
        ? "bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex flex-col items-center mb-2"
        : "bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center mb-2";

    return (
      <div
        key={item.id}
        className={viewMode === "grid" ? "w-1/4 p-2" : "w-full"}
      >
        <div
          className={itemClasses}
          onClick={() => {
            if (item.type === "folder") {
              handleFolderClick(item);
            }
          }}
        >
          {item.type === "folder" ? (
            <>
              <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-500 mr-2" />
              <FolderIcon className="h-6 w-6 flex-shrink-0 text-yellow-500 mr-2" />
            </>
          ) : (
            <FaFile className="h-5 w-5 flex-shrink-0 text-gray-500 mr-2" />
          )}
          <span
            className="text-sm font-medium text-gray-900 truncate flex-grow"
            title={item.name}
          >
            {item.name}
          </span>
          {viewMode === "list" && (
            <>
              <span className="text-sm text-gray-500 mr-4">
                {item.type === "folder" ? `${item.totalItems} items` : "File"}
              </span>
              <span className="text-sm text-gray-500">{item.lastModified}</span>
            </>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="relative">
      <Breadcrumb path={path} onNavigate={handleNavigate} />
      {folderItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-4 h-32 w-full bg-gray-100 rounded-lg border border-gray-300">
          <svg
            className="h-12 w-12 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17v-2a4 4 0 018 0v2m0 0v2a4 4 0 01-8 0v-2m8 0H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2h8V7a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-6z"
            ></path>
          </svg>
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm text-gray-400">This folder is empty.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "flex flex-wrap -mx-2" : ""}>
          {folderItems.map(renderItem)}
        </div>
      )}
      <ToggleViewModeButton
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
      />
    </div>
  );
};

export default FolderContents;
