import React from "react";
import { FolderIcon } from "@heroicons/react/24/outline";
import { FaFile, FaDownload } from "react-icons/fa6";
import Loader from "../utils/Loader";
import { InboxIcon, FolderOpenIcon, DocumentIcon } from '@heroicons/react/24/outline';


const ItemList = ({ items, viewType, onFolderClick, isLoading }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      // <div className="text-gray-500 text-center mt-4">
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
    );
  }

  const sortedItems = [...items].sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === "folder" ? -1 : 1;
  });

  const filteredItems = sortedItems.filter((item) =>
    viewType === "all" ? true : item.type === viewType.slice(0, -1)
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredItems.map((item) =>
        viewType === "files" ? (
          <FileItem key={item.id} item={item} />
        ) : (
          <FolderItem key={item.id} item={item} onClick={onFolderClick} />
        )
      )}
    </div>
  );
};

const FolderItem = ({ item, onClick }) => (
  <div
    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center mb-2"
    onClick={() => onClick(item)}
  >
    <FolderIcon className="h-6 w-6 flex-shrink-0 text-yellow-500 mr-2" />
    <span
      className="text-sm font-medium text-gray-900 truncate flex-grow"
      title={item.name}
    >
      {item.name}
    </span>
    <span className="text-sm text-gray-500 mr-4">{item.totalItems} items</span>
    <span className="text-sm text-gray-500">{item.lastModified}</span>
  </div>
);

const FileItem = ({ item }) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const isImage = imageExtensions.some((ext) =>
    item.name.toLowerCase().endsWith(ext)
  );

  return (
    <div className="relative group">
      {isImage ? (
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-48 object-cover rounded-lg shadow-md"
        />
      ) : (
        <div className="flex items-center justify-center bg-gray-200 rounded-lg shadow-md h-48">
          <FaFile className="text-gray-400 h-12 w-12" />
        </div>
      )}
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
};

export default ItemList;