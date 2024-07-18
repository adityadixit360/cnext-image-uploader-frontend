// import React, { useState, useEffect } from "react";
// import {
//   FolderIcon,
//   ArrowLeftIcon,
//   MagnifyingGlassCircleIcon,
// } from "@heroicons/react/24/outline";
// import { FaListUl } from "react-icons/fa6";
// import { IoGridOutline } from "react-icons/io5";
// import apiClient from "../../redux/apiClient";
// import FolderContents from "./FolderContents";
// import Loader from "../../utils/Loader";
// import ToggleViewModeButton from "../../utils/ToggleViewModeButton";

// const FileExplorer = () => {
//   const [folders, setFolders] = useState([]);
//   const [currentFolder, setCurrentFolder] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [viewMode, setViewMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredFolders, setFilteredFolders] = useState([]);

//   useEffect(() => {
//     fetchFolders();
//   }, []);

//   const fetchFolders = async () => {
//     setIsLoading(true);
//     try {
//       const res = await apiClient.get("/list-folders/");
//       const formattedFolders = res?.data?.folders.map((folder) => ({
//         id: folder.id || Math.random().toString(36).substr(2, 9),
//         name: folder.folderName,
//         lastModified: new Date(folder.FileModified).toLocaleDateString(),
//         totalItems: folder.FileCount + folder.FolderCount,
//       }));
//       setFolders(formattedFolders);
//       setFilteredFolders(formattedFolders);
//     } catch (error) {
//       console.error("Error fetching folders:", error);
//       setError("Failed to load folders. Please try again.");
//     }
//     setIsLoading(false);
//   };

//   const openFolder = (folder) => {
//     setCurrentFolder(folder);
//     console.log(`Opening folder: ${folder.name}`);
//   };

//   const goBack = () => {
//     setCurrentFolder(null);
//   };

//   const toggleViewMode = () => {
//     setViewMode((prevMode) => (prevMode === "grid" ? "list" : "grid"));
//   };

//   useEffect(() => {
//     setFilteredFolders(
//       folders.filter((folder) =>
//         folder.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [searchTerm, folders]);

//   const renderFolder = (folder) => {
//     if (viewMode === "grid") {
//       return (
//         <div
//           key={folder.id}
//           className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
//           onClick={() => openFolder(folder)}
//         >
//           <div className="flex items-center">
//             <FolderIcon className="h-8 w-8 flex-shrink-0 text-yellow-500 mr-3" />
//             <div className="flex-grow min-w-0">
//               <div className="flex items-center">
//                 <span
//                   className="text-sm font-medium text-gray-900 truncate"
//                   title={folder.name}
//                 >
//                   {folder.name}
//                 </span>
//               </div>
//               <p className="text-xs text-gray-500 mt-1 truncate">
//                 {folder.totalItems} items • Last modified: {folder.lastModified}
//               </p>
//             </div>
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div
//           key={folder.id}
//           className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center"
//           onClick={() => openFolder(folder)}
//         >
//           <FolderIcon className="h-6 w-6 flex-shrink-0 text-yellow-500 mr-4" />
//           <span
//             className="text-sm font-medium text-gray-900 truncate flex-grow"
//             title={folder.name}
//           >
//             {folder.name}
//             {console.log(folder.name)}
//           </span>
//           <span className="text-sm text-gray-500 mr-4">
//             {folder.totalItems} items
//           </span>
//           <span className="text-sm text-gray-500">{folder.lastModified}</span>
//         </div>
//       );
//     }
//   };

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <div className="text-center text-red-500 p-4">{error}</div>;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen relative">
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               {currentFolder && (
//                 <button onClick={goBack} className="mr-4">
//                   <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
//                 </button>
//               )}
//               <h1 className="text-3xl font-bold text-gray-900 truncate">
//                 {currentFolder ? currentFolder.name : "My Folders"}
//               </h1>
//             </div>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search folders"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//             </div>
//           </div>

//           {currentFolder ? (
//             <FolderContents initialFolderId={currentFolder.name} />
//           ) : (
//             <div
//               className={
//                 viewMode === "grid"
//                   ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//                   : "space-y-4"
//               }
//             >
//               {filteredFolders.map(renderFolder)}
//             </div>
//           )}
//         </div>
//       </div>

//       <ToggleViewModeButton
//         toggleViewMode={toggleViewMode}
//         viewMode={viewMode}
//       />
//     </div>
//   );
// };

// export default FileExplorer;

import React, { useState, useEffect } from "react";
import {
  FolderIcon,
  ArrowLeftIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";
import apiClient from "../../redux/apiClient";
import FolderContents from "./FolderContents";
import Loader from "../../utils/Loader";
import ToggleViewModeButton from "../../utils/ToggleViewModeButton";

const FileExplorer = () => {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFolders, setFilteredFolders] = useState([]);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get("/list-folders/");
      const formattedFolders = res?.data?.folders.map((folder) => ({
        id: folder.id || Math.random().toString(36).substr(2, 9),
        name: folder.folderName,
        lastModified: new Date(folder.FileModified).toLocaleDateString(),
        totalItems: folder.FileCount + folder.FolderCount,
      }));
      setFolders(formattedFolders);
      setFilteredFolders(formattedFolders);
    } catch (error) {
      console.error("Error fetching folders:", error);
      setError("Failed to load folders. Please try again.");
    }
    setIsLoading(false);
  };

  const openFolder = (folder) => {
    setCurrentFolder(folder);
    console.log(`Opening folder: ${folder.name}`);
  };

  const goBack = () => {
    setCurrentFolder(null);
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "grid" ? "list" : "grid"));
  };

  useEffect(() => {
    if (!currentFolder) {
      setFilteredFolders(
        folders.filter((folder) =>
          folder.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, folders, currentFolder]);

  const renderFolder = (folder) => {
    if (viewMode === "grid") {
      return (
        <div
          key={folder.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          onClick={() => openFolder(folder)}
        >
          <div className="flex items-center">
            <FolderIcon className="h-8 w-8 flex-shrink-0 text-yellow-500 mr-3" />
            <div className="flex-grow min-w-0">
              <div className="flex items-center">
                <span
                  className="text-sm font-medium text-gray-900 truncate"
                  title={folder.name}
                >
                  {folder.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {folder.totalItems} items • Last modified: {folder.lastModified}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={folder.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center"
          onClick={() => openFolder(folder)}
        >
          <FolderIcon className="h-6 w-6 flex-shrink-0 text-yellow-500 mr-4" />
          <span
            className="text-sm font-medium text-gray-900 truncate flex-grow"
            title={folder.name}
          >
            {folder.name}
          </span>
          <span className="text-sm text-gray-500 mr-4">
            {folder.totalItems} items
          </span>
          <span className="text-sm text-gray-500">{folder.lastModified}</span>
        </div>
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {currentFolder && (
                <button onClick={goBack} className="mr-4">
                  <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
              )}
              <h1 className="text-3xl font-bold text-gray-900 truncate">
                {currentFolder ? currentFolder.name : "My Folders"}
              </h1>
            </div>
            {!currentFolder && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search folders"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            )}
          </div>

          {currentFolder ? (
            <FolderContents initialFolderId={currentFolder.name} />
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredFolders.map(renderFolder)}
            </div>
          )}
        </div>
      </div>

      {!currentFolder && (
        <ToggleViewModeButton
          toggleViewMode={toggleViewMode}
          viewMode={viewMode}
        />
      )}
    </div>
  );
};

export default FileExplorer;
