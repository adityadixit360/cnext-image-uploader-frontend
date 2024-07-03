// import React, { useState } from "react";
// import {
//   FaHome,
//   FaUser,
//   FaBriefcase,
//   FaCog,
//   FaSearch,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import ImageGallery from "../imageGallery/ImageGallery";
// import FolderView from "../folderview/FolderView";

// const Sidebar = () => {
//   const [activePage, setActivePage] = useState("Dashboard");
//   const [currentFolder, setCurrentFolder] = useState(null);

//   const handleFolderClick = (folderId) => {
//     setCurrentFolder(folderId);
//     setActivePage("ImageGallery");
//   };

//   const handleBack = () => {
//     setCurrentFolder(null);
//     setActivePage("Dashboard");
//   };

//   const renderPage = () => {
//     switch (activePage) {
//       case "Dashboard":
//         return <FolderView onFolderClick={handleFolderClick} />;
//       case "ImageGallery":
//         return <ImageGallery onBack={handleBack} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 text-white flex flex-col fixed h-full">
//         <div className="flex items-center justify-center h-16 bg-gray-900">
//           <span className="text-2xl font-semibold text-orange-400 ">
//             Career360
//           </span>
//         </div>

//         <nav className="mt-10">
//           <ul>
//             <li>
//               <button
//                 className={`flex items-center py-2 px-8 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 ${
//                   activePage === "Dashboard" ? "bg-gray-700 text-white" : ""
//                 }`}
//                 onClick={() => setActivePage("Dashboard")}
//               >
//                 <FaHome className="w-5 h-5 mr-3" />
//                 Dashboard
//               </button>
//             </li>
//           </ul>
//         </nav>
//         <div className="mt-4 px-4">
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Search by folder name"
//               className="w-full p-2 rounded-lg text-gray-800"
//             />
//           </div>
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Search by tag"
//               className="w-full p-2 rounded-lg text-gray-800"
//             />
//           </div>
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Search by date"
//               className="w-full p-2 rounded-lg text-gray-800"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col ml-64">
//         {/* Header */}
//         <header className="flex items-center justify-center p-4 fixed w-full z-50 ml-[-10rem]">
//           <div className="flex items-center bg-white rounded-full border border-orange-300 shadow-lg overflow-hidden w-96">
//             <FaSearch className="w-5 h-5 text-gray-500 mx-3" />
//             <input
//               className="w-full px-4 py-3 text-gray-700 focus:outline-none"
//               type="text"
//               placeholder="Search any images"
//             />
//           </div>
//           {/* <div className="flex items-center space-x-4">
//             <button className="flex items-center p-2 bg-white rounded-full shadow-md">
//               <FaCog className="w-5 h-5 text-gray-700" />
//             </button>
//             <button className="flex items-center p-2 bg-white rounded-full shadow-md">
//               <FaUser className="w-5 h-5 text-gray-700" />
//             </button>
//             <button className="flex items-center p-2 bg-white rounded-full shadow-md">
//               <FaSignOutAlt className="w-5 h-5 text-gray-700" />
//             </button>
//           </div> */}
//         </header>

//         {/* render pages */}
//         <main className="flex-1 p-8 mt-16">{renderPage()}</main>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState } from "react";
import {
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaElementor,
  FaBriefcase,
} from "react-icons/fa";
import ImageGallery from "../imageGallery/ImageGallery";
import FolderView from "../folderview/FolderView";

const Sidebar = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
    setActivePage("ImageGallery");
    if (window.innerWidth < 768) { // Close sidebar on mobile after clicking on a folder
      setIsSidebarOpen(false);
    }
  };

  const handleBack = () => {
    setCurrentFolder(null);
    setActivePage("Dashboard");
  };

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <FolderView onFolderClick={handleFolderClick}/>;
      case "ImageGallery":
        return <ImageGallery onBack={handleBack} />;
      default:
        return null;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 text-white flex flex-col fixed h-full transition-all duration-300 ${isSidebarOpen ? "z-50" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900 text-2xl font-semibold text-orange-400 bg-white">
          {/* <div className="text-2xl font-semibold text-orange-400"> */}
            {/* CAREERS<span className="font-extralight">360</span> */}
            <img src="https://cnextassets.careers360.com/frontend-common/_react_common/assets/logo-blue.svg" alt="logo" className="h-6 w-25"></img>
          {/* </div> */}
        </div>

        <nav className="mt-10">
          <ul>
            <li>
              <button
                className={`flex items-center py-2 px-8 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 ${activePage === "Dashboard" ? "bg-gray-700 text-white" : ""
                  }`}
                onClick={() => {
                  setActivePage("Dashboard");
                  if (window.innerWidth < 768) { // Close sidebar on mobile after navigation
                    setIsSidebarOpen(false);
                  }
                }}
              >
                <FaHome className="w-5 h-5 mr-3" />
                Dashboard
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-4 px-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by folder name"
              className="w-full p-2 rounded-lg text-gray-800"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by tag"
              className="w-full p-2 rounded-lg text-gray-800"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by date"
              className="w-full p-2 rounded-lg text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-4 fixed w-full bg-white z-50">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="ml-4 mr-4 md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isSidebarOpen ? <FaElementor className="h-9 w-9"/> : <FaElementor className="h-9 w-9"/> }
            </button>
            <div className="flex items-center bg-white rounded-full border border-purple-400 shadow-lg overflow-hidden w-50">
              <FaSearch className="w-5 h-5 text-gray-500 mx-3" />
              <input
                className="w-full px-4 py-3 text-gray-700 focus:outline-none"
                type="text"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center p-2 bg-white rounded-full shadow-md">
              <FaCog className="w-5 h-5 text-gray-700" />
            </button>
            <button className="flex items-center p-2 bg-white rounded-full shadow-md">
              <FaUser className="w-5 h-5 text-gray-700" />
            </button>
            <button className="flex items-center p-2 bg-white rounded-full shadow-md">
              <FaSignOutAlt className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </header>

        {/* render pages */}
        <main className="flex-1 p-8 mt-16">{renderPage()}</main>
      </div>
    </div>
  );
};

export default Sidebar;



