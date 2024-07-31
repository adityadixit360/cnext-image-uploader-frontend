import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderIcon } from "@heroicons/react/24/outline";
import Loader from "../../utils/Loader";
import ToggleViewModeButton from "../../utils/ToggleViewModeButton";
import { createFolder, getAllFolders } from "../../utils/apis";
import moment from "moment";
import AddfolderModal from "../modals/AddfolderModal";
import toast from "react-hot-toast";
import CommonHeader from "../../utils/CommonHeader";
import { useDispatch, useSelector } from "react-redux";
import { allFoldersData } from "../../redux/slices/contentSlice";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";

const AllFolders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("/");
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.content);
  const {loading}=useSelector((state)=>state.loading)

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const res = await getAllFolders();
      if (res.status === 304) {
        // if status is not changed then dont make any api call
        setIsLoading(false);
        return;
      }
      dispatch(allFoldersData(res?.data?.folders));
      const formattedFolders = res?.data?.folders?.map((folder) => ({
        id: folder.id || Math.random().toString(36).substr(2, 9),
        name: folder.folderName,
        lastModified: moment(folder.LastModified).format(
          "MMMM Do YYYY, h:mm A"
        ),
        totalItems: folder.FileCount + folder.FolderCount,
      }));
      setData(formattedFolders);
      setFilteredFolders(formattedFolders);
    } catch (error) {
      toast.error(error.message);
      navigate("/");
    }
    setIsLoading(false);
  };

  const openFolder = (folder) => {
    setCurrentFolder(folder.name);
    navigate(`/folders/${folder.name}`);
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "grid" ? "list" : "grid"));
  };

  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      dispatch(showLoading());
      try {
        await createFolder({
          parent_folder:
            currentFolder === "root" || currentFolder === "/"
              ? ""
              : currentFolder,
          folder_name: newFolderName,
          token: localStorage.getItem("token"),
        });
        fetchFolders();
        setNewFolderName("");
        setIsAddingFolder(false);
        dispatch(hideLoading())
      } catch (error) {
        toast.error(error?.response?.data?.error||"Error in uploading file");
      }
      finally{
        dispatch(hideLoading());
      }
    }
  };

  useEffect(() => {
    setFilteredFolders(
      data?.filter((folder) =>
        folder?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    );
  }, [searchTerm, data]);

  const renderFolder = (folder) => {
    if (viewMode === "grid") {
      return (
        <div
          key={folder.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          onClick={() => openFolder(folder)}
        >
          <div className="flex items-center">
            <FolderIcon className="h-8 w-8 flex-shrink-0 text-yellow-500 mr-3" />
            <div className="flex-grow min-w-0">
              <div className="flex items-center">
                <span
                  className="text-sm font-medium text-gray-900 truncate"
                  title={folder.name}
                >
                  {folder.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {folder.totalItems} items • Last modified: {folder.lastModified}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={folder.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center"
          onClick={() => openFolder(folder)}
        >
          <FolderIcon className="h-6 w-6 flex-shrink-0 text-yellow-500 mr-4" />
          <span
            className="text-sm font-medium text-gray-900 truncate flex-grow"
            title={folder.name}
          >
            {folder.name}
          </span>
          <span className="text-sm text-gray-500 mr-4">
            {folder.totalItems} items
          </span>
          <span className="text-sm text-gray-500">{folder.lastModified}</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <CommonHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showSearch={true}
        showAddFolder={true}
        setIsAddingFolder={setIsAddingFolder}
      />

      {isLoading ? <Loader /> : <div className="flex-grow mt-4">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredFolders.map(renderFolder)}
            </div>
          </div>
        </div>
      </div>}

      <AddfolderModal
        isOpen={isAddingFolder}
        onClose={() => setIsAddingFolder(false)}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
        handleAddFolder={handleAddFolder}
        // folders={folders}
        folders={data}
        loadingState={loading}
      />

      <ToggleViewModeButton
        toggleViewMode={toggleViewMode}
        viewMode={viewMode}
      />
    </div>
  );
};

export default AllFolders;