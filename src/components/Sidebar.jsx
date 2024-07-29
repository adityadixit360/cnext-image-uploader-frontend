import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { FiLogOut, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, userDetails } from "../redux/slices/userSlice";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { folderName } = useParams();
  const token = localStorage.getItem("token");
  const toggleSidebar = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState(null);
  const {user}=useSelector((state)=>state.user);
  
  // persisting the state by retrieving the information from local storage
  useEffect(() => {
    const UserInfo = localStorage.getItem("userInfo");
    if (UserInfo) {
      dispatch(userDetails(JSON.parse(UserInfo)))
    }
  }, []);

  
  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    toast.success("Logged out successfully");
    navigate("/login");
    setIsModalOpen(false);
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    // ...(folderName
    //   ? [
    //       {
    //         name: folderName,
    //         path: `/folder/${folderName}`,
    //         icon: FolderIcon,
    //       },
    //     ]
    //   : []),
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 p-2 rounded-md text-white z-100"
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
        fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelLogout}
        contentLabel="Confirm Logout"
        className="flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="bg-white p-4 rounded shadow-lg max-w-md mx-auto">
          <h2 className="text-xl mb-4">Confirm Logout</h2>
          <p className="mb-4">Are you sure you want to log out?</p>
          <div className="flex justify-end">
            <button
              onClick={cancelLogout}
              className="mr-2 px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
