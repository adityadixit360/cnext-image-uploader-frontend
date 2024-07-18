import React from "react";
import { FaListUl } from "react-icons/fa";
import { IoGridOutline } from "react-icons/io5";

const ToggleViewModeButton = ({ viewMode, toggleViewMode }) => {
  return (
    <div className="fixed bottom-4 right-4 flex items-center bg-white rounded-lg shadow-md p-2">
      <button
        onClick={toggleViewMode}
        className="p-2 rounded-md hover:bg-gray-200"
      >
        {viewMode === "grid" ? (
          <FaListUl className="h-6 w-6 text-gray-600" />
        ) : (
          <IoGridOutline className="h-6 w-6 text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default ToggleViewModeButton;
