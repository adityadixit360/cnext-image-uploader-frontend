import React, { useState } from "react";
import { FaTh, FaBars, FaUpload, FaEdit } from "react-icons/fa";

const UserProfile = () => {
  const user = {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    username: "John Doe",
    email: "johndoe@example.com",
    totalUploads: 10,
    uploads: Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      imageUrl: `https://picsum.photos/seed/${index + 1}/200`,
      imageName: `Image ${index + 1}`,
    })),
  };

  const [viewType, setViewType] = useState("grid");

  const toggleView = () => {
    setViewType((prevType) => (prevType === "grid" ? "list" : "grid"));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="h-24 w-24 rounded-full border-4 border-white shadow-md"
              />
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                My Uploads
              </h2>
              <div className="flex space-x-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center">
                  <FaUpload className="mr-2" /> Upload New
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center">
                  <FaEdit className="mr-2" /> Edit Profile
                </button>
              </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Total Uploads: {user.totalUploads}
              </p>
              <div className="flex space-x-2">
                <button
                  className={`flex items-center px-3 py-2 rounded transition duration-300 ease-in-out ${
                    viewType === "grid"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={toggleView}
                >
                  <FaTh className="w-5 h-5 mr-2" /> Grid
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded transition duration-300 ease-in-out ${
                    viewType === "list"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={toggleView}
                >
                  <FaBars className="w-5 h-5 mr-2" /> List
                </button>
              </div>
            </div>

            <div
              className={
                viewType === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {user.uploads.map((upload) => (
                <div
                  key={upload.id}
                  className={`bg-white shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:shadow-xl hover:-translate-y-1 ${
                    viewType === "list" ? "flex items-center" : ""
                  }`}
                >
                  <img
                    src={upload.imageUrl}
                    alt={upload.imageName}
                    className={`object-cover ${
                      viewType === "list" ? "w-24 h-24" : "w-full h-48"
                    }`}
                  />
                  <div className="p-4">
                    <p className="text-gray-800 font-medium">
                      {upload.imageName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
