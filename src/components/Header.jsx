import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Header = () => {
  return (
    <header className="bg-gray-50 text-white p-4 fixed w-full z-10 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-500">
          {/* <Link to="/">ImageUploader</Link> */}
        </h1>
        <nav className="hidden lg:flex space-x-4 items-center">
          <Link to="/" className="hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>
          <UserProfileDropdown />
        </nav>
      </div>
    </header>
  );
};

export default Header;

export const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 p-2 rounded transition-colors"
        onClick={toggleDropdown}
      >
        <UserCircleIcon className="h-6 w-6 text-gray-800" />
        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <button
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              // Add logout logic here
              console.log("Logged out");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};