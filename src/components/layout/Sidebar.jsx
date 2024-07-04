import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaSearch,
  FaBars,
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
    setActivePage("ImageGallery");
    closeSidebar();
  };

  const handleBack = () => {
    setCurrentFolder(null);
    setActivePage("Dashboard");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (windowWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logging out");
    closeSidebar();
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

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 text-white flex flex-col fixed h-full transition-transform duration-300 ease-in-out ${
          isSidebarOpen || windowWidth >= 768 ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-2xl font-semibold text-orange-400">
            Career360
          </span>
        </div>

        <div className="px-4 mt-6">
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

        <nav className="mt-6 flex-grow">
          <ul>
            <li>
              <button
                className={`flex items-center py-2 px-8 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 ${
                  activePage === "Dashboard" ? "bg-gray-700 text-white" : ""
                }`}
                onClick={() => {
                  setActivePage("Dashboard");
                  closeSidebar();
                }}
              >
                <FaHome className="w-5 h-5 mr-3" />
                Dashboard
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto mb-4 px-4">
          <button 
            className="flex items-center py-2 px-4 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 rounded"
            onClick={() => {
              // Handle user profile click
              closeSidebar();
            }}
          >
            <FaUser className="w-5 h-5 mr-3" />
            User Profile
          </button>
          <button 
            className="flex items-center py-2 px-4 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 rounded mt-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${windowWidth >= 768 ? 'md:ml-64' : ''}`}>
        {/* Header with search and menu button */}
        <header className="bg-white shadow-md p-4 fixed w-full z-30 flex items-center">
          <button
            className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
            onClick={toggleSidebar}
          >
            <FaBars className="w-6 h-6" />
          </button>
          <form onSubmit={handleSearch} className="flex-grow max-w-3xl mx-auto">
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search any images"
                className="w-full px-6 py-3 text-gray-700 focus:outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-orange-400 text-white p-3 rounded-full hover:bg-orange-500 transition duration-300 ease-in-out"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </form>
        </header>

        {/* render pages */}
        <main className="flex-1 p-8 mt-24">{renderPage()}</main>
      </div>
    </div>
  );
};

export default Sidebar;
