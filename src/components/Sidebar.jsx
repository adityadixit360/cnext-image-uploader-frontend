import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { folderName } = useParams();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const navItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    ...(folderName
      ? [
          {
            name: folderName,
            path: `/folder-content/${folderName}`,
            icon: FolderIcon,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-800 text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
        bg-gray-800 text-white w-64 min-h-screen p-4
        fixed left-0 top-0 z-20 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">ImageUploader</h2>
          <button className="lg:hidden" onClick={toggleSidebar}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Link
                  to={item.path}
                  className={`
                    flex items-center p-2 rounded hover:bg-gray-700 transition-colors
                    ${location.pathname === item.path ? "bg-gray-700" : ""}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
