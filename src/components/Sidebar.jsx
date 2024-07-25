import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  FolderIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { FiLogIn, FiLogOut, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/userSlice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { folderName } = useParams();
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.user);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const navItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    ...(folderName
      ? [
          {
            name: folderName,
            path: `/folder/${folderName}`,
            icon: FolderIcon,
          },
        ]
      : []),
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6 bg-white text-blue-600 font-semibold text-3xl" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`
        bg-gray-800 text-white w-64 min-h-screen p-4
        fixed left-0 top-0 z-20 transition-transform duration-300 ease-in-out
        lg:translate-x-0 h-full flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }
      `}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-4">
            <FiUploadCloud />
            <span>Uploader</span>
          </h2>
          <button className="lg:hidden" onClick={toggleSidebar}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-grow">
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
        <div className="mt-auto">
          <Link
            to="/"
            className="flex items-center gap-2 p-2 rounded bg-gray-950 hover:bg-gray-700 transition-colors mb-2"
          >
            <img src={user?.picture} className="w-8 h-8 rounded-full" />
            <h1 className="text-white font-[500]">{user?.name}</h1>
          </Link>
          {token && (
            <button
              onClick={handleLogout}
              className="flex items-center p-2 bg-red-500 hover:bg-red-600 font-semibold w-full"
            >
              <FiLogOut className="h-5 w-5 mr-3 font-semibold" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
