
// import React, { useState, useEffect } from "react";
// import { FaFolder, FaTh, FaList, FaSearch } from "react-icons/fa";

// import apiClient from "../../../src/api";

// // const mockFolders = Array.from({ length: 20 }, (_, index) => ({
// //   id: index + 1,
// //   name: `Folder ${index + 1}`,
// //   itemCount: Math.floor(Math.random() * 50) + 1,
// //   lastModified: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
// // }));

// const FolderView = ({ onFolderClick }) => {
//   const [viewType, setViewType] = useState("grid");
//   const [isMobile, setIsMobile] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredFolders, setFilteredFolders] = useState([]);

//   const [folders, setFolders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await apiClient.get('/list-folders/');
//         const foldersData = response.data.folders.map((folder, index) => ({
//           id: index + 1,
//           name: folder,
//           itemCount: Math.floor(Math.random() * 50) + 1,  // Placeholder for item count
//           lastModified: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),  // Placeholder for last modified date
//         }));
//         setFolders(foldersData);
//         setFilteredFolders(foldersData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Error fetching data');
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);


//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     setFilteredFolders(
//       folders.filter(folder => 
//         folder.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [searchTerm, folders]);

//   const toggleView = () => {
//     setViewType((prevType) => (prevType === "grid" ? "list" : "grid"));
//   };

//   const handleFolderClick = (folderId) => {
//     if (isMobile) {
//       onFolderClick(folderId);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="mb-6">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search folders..."
//             className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>

//       <div className={
//         viewType === "grid"
//           ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
//           : "flex flex-col space-y-4"
//       }>
//         {filteredFolders.map((folder) => (
//           <div
//             key={folder.id}
//             className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg ${
//               viewType === "grid" ? "hover:scale-105" : "hover:bg-gray-50"
//             }`}
//             onClick={() => handleFolderClick(folder.id)}
//             onDoubleClick={() => !isMobile && onFolderClick(folder.id)}
//           >
//             <div className={`p-4 ${viewType === "list" ? "flex items-center" : ""}`}>
//               <div className={`flex items-center justify-center ${viewType === "list" ? "mr-4" : "mb-3"}`}>
//                 <FaFolder className="text-yellow-500 w-12 h-12" />
//               </div>
//               <div className={`${viewType === "list" ? "flex-grow" : ""}`}>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-1">{folder.name}</h3>
//                 <p className="text-sm text-gray-600">
//                   {folder.itemCount} item{folder.itemCount !== 1 ? 's' : ''}
//                 </p>
//                 <p className="text-xs text-gray-500">Last modified: {folder.lastModified}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="fixed bottom-6 right-6">
//         <button
//           className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           onClick={toggleView}
//           aria-label={viewType === "grid" ? "Switch to list view" : "Switch to grid view"}
//         >
//           {viewType === "grid" ? <FaList size={20} /> : <FaTh size={20} />}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FolderView;



import React, { useState, useEffect } from "react";
import { FaFolder, FaFile, FaTh, FaList, FaSearch } from "react-icons/fa";
import apiClient from "../../../src/api";

const FolderView = ({ onFolderClick }) => {
  const [viewType, setViewType] = useState("grid");
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/list-folders/');
        console.log('API Response:', response.data);
        const foldersData = response.data.folders.map((folder, index) => ({
          id: `folder-${index + 1}`,
          name: folder.folderName,
          itemCount: folder.FileCount+folder.FolderCount,
          lastModified: new Date(folder.LastModified).toLocaleDateString(),
          type: 'folder',
        }));
        
        const filesData = response.data.files.map((file, index) => ({
          id: `file-${index + 1}`,
          name: file.fileName,
          lastModified: new Date(file.LastModified).toLocaleDateString(),
          type: 'file',
        }));

        setFolders(foldersData);
        setFiles(filesData);
        setFilteredItems([...foldersData, ...filesData]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setFilteredItems(
      [...folders, ...files].filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, folders, files]);

  const toggleView = () => {
    setViewType((prevType) => (prevType === "grid" ? "list" : "grid"));
  };

  const handleItemClick = (itemId) => {
    if (isMobile) {
      onFolderClick(itemId);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search folders and files..."
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className={
        viewType === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          : "flex flex-col space-y-4"
      }>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg ${
              viewType === "grid" ? "hover:scale-105" : "hover:bg-gray-50"
            }`}
            onClick={() => handleItemClick(item.id)}
            onDoubleClick={() => !isMobile && onFolderClick(item.id)}
          >
            <div className={`p-4 ${viewType === "list" ? "flex items-center" : ""}`}>
              <div className={`flex items-center justify-center ${viewType === "list" ? "mr-4" : "mb-3"}`}>
                {item.type === 'folder' ? (
                  <FaFolder className="text-yellow-500 w-12 h-12" />
                ) : (
                  <FaFile className="text-blue-500 w-12 h-12" />
                )}
              </div>
              <div className={`${viewType === "list" ? "flex-grow" : ""}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                {item.type === 'folder' && (
                  <p className="text-sm text-gray-600">
                    {item.itemCount} item{item.itemCount !== 1 ? 's' : ''}
                  </p>
                )}
                <p className="text-xs text-gray-500">Last modified: {item.lastModified}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6">
        <button
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={toggleView}
          aria-label={viewType === "grid" ? "Switch to list view" : "Switch to grid view"}
        >
          {viewType === "grid" ? <FaList size={20} /> : <FaTh size={20} />}
        </button>
      </div>
    </div>
  );
};

export default FolderView;

