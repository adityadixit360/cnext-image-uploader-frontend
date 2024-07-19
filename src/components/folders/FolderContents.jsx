import React, { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "../../redux/apiClient";
import { FolderIcon } from "@heroicons/react/24/outline";
import { FaFile, FaDownload } from "react-icons/fa6";
import Loader from "../../utils/Loader";
import Breadcrumb from "../breadcrumb/Breadcrumb";

const FolderContents = ({ initialFolderId }) => {
  const [folderId, setFolderId] = useState(initialFolderId);
  const [folderItems, setFolderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [path, setPath] = useState([
    { id: initialFolderId, name: initialFolderId },
  ]);
  const [cache, setCache] = useState({});
  const [viewType, setViewType] = useState("all");

  const fetchFolderItems = useCallback(
    async (folderId) => {
      setIsLoading(true);
      try {
        if (cache[folderId]) {
          setFolderItems(cache[folderId]);
        } else {
          const res = await apiClient.get(`/list-files/${folderId}/`);
          console.log(res?.data);
          const { files, folders } = res?.data;

          const formattedFiles = files.map((file) => ({
            id: file.Key,
            name: file.Key.split("/").pop(),
            lastModified: new Date(file.LastModified).toLocaleDateString(),
            url: file.URL,
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
          setCache((prevCache) => ({ ...prevCache, [folderId]: items }));
        }
      } catch (error) {
        console.error("Error fetching folder contents:", error);
        setError("Failed to load folder contents. Please try again.");
      }
      setIsLoading(false);
    },
    [cache]
  );

  useEffect(() => {
    if (folderId) {
      fetchFolderItems(folderId);
    }
  }, [folderId, fetchFolderItems]);

  const handleNavigate = useCallback((id, index) => {
    setPath((prevPath) => prevPath.slice(0, index + 1));
    setFolderId(id);
  }, []);

  const handleFolderClick = useCallback((folder) => {
    setPath((prevPath) => [...prevPath, { id: folder.id, name: folder.name }]);
    setFolderId(folder.id);
  }, []);

  const renderAllItem = useCallback(
    (item) => (
      <div
        key={item.id}
        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center mb-2"
        onClick={() => item.type === "folder" && handleFolderClick(item)}
      >
        {item.type === "folder" ? (
          <FolderIcon className="h-6 w-6 flex-shrink-0 text-yellow-500 mr-2" />
        ) : (
          <FaFile className="h-5 w-5 flex-shrink-0 text-gray-500 mr-2" />
        )}
        <span
          className="text-sm font-medium text-gray-900 truncate flex-grow"
          title={item.name}
        >
          {item.name}
        </span>
        {item.type === "folder" && (
          <span className="text-sm text-gray-500 mr-4">
            {item.totalItems} items
          </span>
        )}
        <span className="text-sm text-gray-500">{item.lastModified}</span>
      </div>
    ),
    [handleFolderClick]
  );

  const renderFileGrid = useCallback((item) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const isImage = imageExtensions.some((ext) =>
      item.name.toLowerCase().endsWith(ext)
    );

    if (!isImage) {
      return (
        <div
          key={item.id}
          className="relative group flex items-center justify-center bg-gray-200 rounded-lg shadow-md h-48"
        >
          <FaFile className="text-gray-400 h-12 w-12" />
          <span className="absolute bottom-2 left-2 text-sm text-gray-600">
            {item.name}
          </span>
          <a
            href={item.url}
            download
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaDownload className="text-gray-600" />
          </a>
        </div>
      );
    }

    return (
      <div key={item.id} className="relative group">
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-48 object-cover rounded-lg shadow-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-medium">{item.name}</span>
        </div>
        <a
          href={item.url}
          download
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaDownload className="text-gray-600" />
        </a>
      </div>
    );
  }, []);

  const sortedItems = useMemo(() => {
    return [...folderItems].sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "folder" ? -1 : 1;
    });
  }, [folderItems]);

  const filteredItems = useMemo(() => {
    switch (viewType) {
      case "folders":
        return sortedItems.filter((item) => item.type === "folder");
      case "files":
        return sortedItems.filter((item) => item.type === "file");
      default:
        return sortedItems;
    }
  }, [sortedItems, viewType]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="relative">
      <Breadcrumb path={path} onNavigate={handleNavigate} />

      <div className="flex mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded-lg ${
            viewType === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setViewType("all")}
        >
          All Files and Folders
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded-lg ${
            viewType === "folders" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setViewType("folders")}
        >
          Folders
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            viewType === "files" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setViewType("files")}
        >
          Files
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-4 h-32 w-full bg-gray-100 rounded-lg border border-gray-300">
          <img
            src="./images/paper.png"
            alt="no-item-found"
            className="h-8 w-8"
          />
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm text-gray-400">This folder is empty.</p>
        </div>
      ) : (
        <div
          className={
            viewType === "files"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "space-y-2"
          }
        >
          {viewType === "files" ? (
            filteredItems.some((item) =>
              ["jpg", "jpeg", "png", "gif", "bmp", "webp"].some((ext) =>
                item.name.toLowerCase().endsWith(ext)
              )
            ) ? (
              filteredItems.map(renderFileGrid)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center text-gray-500 mt-4 h-32 w-full bg-gray-100 rounded-lg border border-gray-300">
                <FaFile className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-lg font-medium">No image files found</p>
                <p className="text-sm text-gray-400">
                  This folder doesn't contain any image files.
                </p>
              </div>
            )
          ) : (
            filteredItems.map(renderAllItem)
          )}
        </div>
      )}
    </div>
  );
};

export default FolderContents;
