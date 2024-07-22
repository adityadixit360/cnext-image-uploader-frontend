import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import apiClient from "../../redux/apiClient";
import {
  FolderIcon,
  PlusIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { FaFile, FaDownload } from "react-icons/fa6";
import Loader from "../../utils/Loader";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import { createFolder, uploadFile } from "../../utils/apis";

import { FolderOpenIcon, DocumentIcon, InboxIcon } from '@heroicons/react/24/outline';


const FolderContents = () => {
  const params = useParams();
  const initialFolderId = params.folderName;

  const [folderId, setFolderId] = useState(initialFolderId);
  const [folderItems, setFolderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [path, setPath] = useState([
    { id: initialFolderId, name: initialFolderId },
  ]);
  const [cache, setCache] = useState({});
  const [viewType, setViewType] = useState("all");
  const [imagesLoading, setImagesLoading] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);
  const [totalImageCount, setTotalImageCount] = useState(0);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const fetchFolderItems = useCallback(
    async (folderId) => {
      setIsLoading(true);
      setImagesLoading(false);
      setLoadedImageCount(0);
      setTotalImageCount(0);
      try {
        if (cache[folderId]) {
          setFolderItems(cache[folderId]);
        } else {
          const res = await apiClient.get(`/list-files/${folderId}/`);
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

          const imageCount = formattedFiles.filter((file) =>
            ["jpg", "jpeg", "png", "gif", "bmp", "webp"].some((ext) =>
              file.name.toLowerCase().endsWith(ext)
            )
          ).length;

          setTotalImageCount(imageCount);
          setImagesLoading(imageCount > 0);
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

  const handleImageLoad = useCallback(() => {
    setLoadedImageCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === totalImageCount) {
        setImagesLoading(false);
      }
      return newCount;
    });
  }, [totalImageCount]);

  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder({
          parent_folder: folderId,
          folder_name: newFolderName,
        });
        fetchFolderItems(folderId); // Refresh the folder list
        setNewFolderName("");
        setIsAddingFolder(false);
      } catch (error) {
        console.error("Error creating folder:", error);
        setError("Failed to create folder. Please try again.");
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder_id", folderId);

        await uploadFile(formData);
        fetchFolderItems(folderId);
      } catch (error) {
        console.error("Error uploading file:", error);
        setError("Failed to upload file. Please try again.");
      }
      setIsUploading(false);
    }
  };

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

  const renderFileGrid = useCallback(
    (item) => {
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
            onLoad={handleImageLoad}
            onError={handleImageLoad}
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
    },
    [handleImageLoad]
  );

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

  return (
    <Layout>
      <div className="container mx-auto py-4 px-4 mt-8">
        <div className="flex justify-between items-center mb-4"> 
          <Breadcrumb path={path} onNavigate={handleNavigate} />
        
          {/* <h1 className="text-2xl font-semibold text-gray-800">
            Folder: {folderId}
          </h1> */}
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                viewType === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setViewType("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded ${
                viewType === "folders"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setViewType("folders")}
            >
              Folders
            </button>
            <button
              className={`px-4 py-2 rounded ${
                viewType === "files"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setViewType("files")}
            >
              Files
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <div
            className="bg-gray-100 p-4 rounded-lg flex items-center cursor-pointer"
            onClick={() => setIsAddingFolder(!isAddingFolder)}
          >
            <PlusIcon className="h-6 w-6 text-gray-500 mr-2" />
            <span className="text-gray-700">Add Folder</span>
          </div>
          <div
            className="bg-gray-100 p-4 rounded-lg flex items-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <ArrowUpTrayIcon className="h-6 w-6 text-gray-500 mr-2" />
            <span className="text-gray-700">Upload File</span>
          </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add Folder
            </button>
          </div>
        )}

        {isUploading && (
          <div className="mb-4 text-blue-600">Uploading file...</div>
        )}

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {imagesLoading && (
          <div className="mb-4 text-blue-600">
            Loading images... ({loadedImageCount}/{totalImageCount})
          </div>
        )}

        {folderItems.length === 0 ? (
          // <div className="text-gray-500 text-center mt-4 ">
          //   {viewType === "all"
          //     ? "No items in this folder."
          //     : viewType === "folders"
          //     ? "No folders in this folder."
          //     : "No files in this folder."}
          // </div>          
          <div className="text-gray-500 text-center mt-8 flex flex-col items-center space-y-6 animate-fadeIn">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg">
              {viewType === "all" ? (
                <InboxIcon className="h-16 w-16 text-white" />
              ) : viewType === "folders" ? (
                <FolderOpenIcon className="h-16 w-16 text-white" />
              ) : (
                <DocumentIcon className="h-16 w-16 text-white" />
              )}
            </div>
            <p className="text-lg font-semibold">
              {viewType === "all"
                ? "No items in this folder."
                : viewType === "folders"
                ? "No folders in this folder."
                : "No files in this folder."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) =>
              viewType === "files" ? renderFileGrid(item) : renderAllItem(item)
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </Layout>
  );
};

export default FolderContents;
