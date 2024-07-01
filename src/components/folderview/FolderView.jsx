// import React from "react";
// import { FaFolder } from "react-icons/fa";

// const mockFolders = Array.from({ length: 10 }, (_, index) => ({
//   id: index + 1,
//   name: `Folder ${index + 1}`,
// }));

// const FolderView = ({ onFolderClick }) => {
//   return (
//     <div className="p-4">
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//         {mockFolders.map((folder) => (
//           <div
//             key={folder.id}
//             className="bg-white shadow-lg rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-100"
//             onClick={() => onFolderClick(folder.id)}
//           >
//             <div className="flex items-center justify-center mb-2">
//               <FaFolder className="text-yellow-500 w-12 h-12" />
//             </div>
//             <p className="text-gray-800 font-semibold text-center">{folder.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FolderView;



import React, { useState } from "react";
import { FaFolder, FaTh, FaBars } from "react-icons/fa";

const mockFolders = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Folder ${index + 1}`,
}));

const FolderView = ({ onFolderClick }) => {
  const [viewType, setViewType] = useState("grid");

  const toggleView = () => {
    setViewType((prevType) => (prevType === "grid" ? "list" : "grid"));
  };

  return (
    <div className="p-4">
      <div className={viewType === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" : ""}>
        {mockFolders.map((folder) => (
          <div
            key={folder.id}
            className={`bg-white shadow-lg rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-100 ${viewType === "list" ? "mb-4" : ""}`}
            onClick={() => onFolderClick(folder.id)}
          >
            <div className="flex items-center justify-center mb-2">
              <FaFolder className="text-yellow-500 w-12 h-12" />
            </div>
            <p className="text-gray-800 font-semibold text-center">{folder.name}</p>
          </div>
        ))}
      </div>

      {/* Toggle view buttons */}
      <div className="flex justify-end mt-4">
        <button
          className={`flex items-center px-3 py-2 rounded ${
            viewType === "grid"
              ? "bg-gray-800 text-white"
              : "bg-gray-300 text-gray-800"
          }`}
          onClick={toggleView}
        >
          <FaTh className="w-5 h-5 mr-2" /> Grid View
        </button>
        <button
          className={`flex items-center ml-2 px-3 py-2 rounded ${
            viewType === "list"
              ? "bg-gray-800 text-white"
              : "bg-gray-300 text-gray-800"
          }`}
          onClick={toggleView}
        >
          <FaBars className="w-5 h-5 mr-2" /> List View
        </button>
      </div>
    </div>
  );
};

export default FolderView;

