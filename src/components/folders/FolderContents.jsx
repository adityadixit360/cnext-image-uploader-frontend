import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { createFolder, uploadFile } from "../../utils/apis";
import ItemList from "../ItemList";
import useFolder from "../../hooks/useFolder";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Modal from "react-modal";
import CommonHeader from "../../utils/CommonHeader";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/slices/loadingSlice";

Modal.setAppElement("#root");

const FolderContents = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [path, setPath] = useState([]);
  const [viewType, setViewType] = useState("all");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");
  const dispatch=useDispatch();
  const {loading}=useSelector(state=>state.loading)

  const { folderId, setFolderId, folderItems, isLoading, fetchFolderItems } =
    useFolder();
  //split the path on the the basis of / and store it into array
  useEffect(() => {
    const folderPath = params["*"]
      ? params["*"].split("/").filter(Boolean)
      : [];
    setPath(
      folderPath.map((name, index) => ({
        id: folderPath.slice(0, index + 1).join("/"),
        name,
      }))
    );
    setFolderId(folderPath.join("/") || "root");
  }, [params, setFolderId]);

  useEffect(() => {
    if (folderId) {
      fetchFolderItems(folderId);
    }
  }, [folderId, fetchFolderItems]);

  // recreated when navigate or path changes
  const handleNavigate = useCallback(
    (id, index) => {
      const newPath = path.slice(0, index + 1);
      setPath(newPath);
      navigate(`/folders/${newPath.map((p) => p.name).join("/")}`);
    },
    [navigate, path]
  );

  const handleFolderClick = useCallback(
    (folder) => {
      const newPath = [...path, { id: folder.id, name: folder.name }];
      setPath(newPath);
      navigate(`/folders/${newPath.map((p) => p.name).join("/")}`);
    },
    [navigate, path]
  );

  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      dispatch(showLoading())
      try {
        await createFolder({
          parent_folder: folderId,
          folder_name: newFolderName,
          token: localStorage.getItem("token"),
        });
        fetchFolderItems(folderId);
        setNewFolderName("");
        setIsAddingFolder(false);
        toast.success("Folder created successfully");
        dispatch(hideLoading(false));
      } catch (error) {
        toast.error(error.response.data.error);
      }finally{
        dispatch(hideLoading())
      }
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      dispatch(showLoading())
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder_id", folderId);
        await uploadFile(formData, token);
        fetchFolderItems(folderId);
        setIsUploadingFile(false);
        setSelectedFile(null);
        toast.success("File uploaded successfully");
        dispatch(hideLoading())
      } catch (error) {
        toast.error(error.response.data.error);
        setSelectedFile(null)
      }
      finally{
        dispatch(hideLoading())
      }
    }
  };

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "400px",
      width: "100%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  };

  return (
    <Layout>
      <CommonHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showAddFolder={true}
        showSearch={true}
        showUploadFile={true}
        setIsAddingFolder={setIsAddingFolder}
        setIsUploadingFile={setIsUploadingFile}
      />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-5 mt-12 lg:mt-0 md:mt-0">
          <Breadcrumb path={path} onNavigate={handleNavigate} />
          <div className="flex space-x-4">
            <button
              onClick={() => setViewType("all")}
              className={`px-4 py-2 rounded-md ${
                viewType === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All Folders
            </button>
            <button
              onClick={() => setViewType("files")}
              className={`px-4 py-2 rounded-md ${
                viewType === "files"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All Files
            </button>
          </div>
        </div>
        <ItemList
          items={folderItems}
          viewType={viewType}
          onFolderClick={handleFolderClick}
          isLoading={isLoading}
          isUploadingFile={isUploadingFile}
          isUploadingFolder={isAddingFolder}
        />
      </div>

      {/* Add Folder Modal */}
      <Modal
        isOpen={isAddingFolder}
        onRequestClose={() => setIsAddingFolder(false)}
        style={modalStyle}
        contentLabel="Add Folder Modal"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Folder</h2>
          <button
            onClick={() => setIsAddingFolder(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter folder name"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleAddFolder}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {
            loading?"Creating folder":"Create Folder"
          }
        </button>
      </Modal>

      {/* Upload File Modal */}
      <Modal
        isOpen={isUploadingFile}
        onRequestClose={() => setIsUploadingFile(false)}
        style={modalStyle}
        contentLabel="Upload File Modal"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Upload File</h2>
          <button
            onClick={() => setIsUploadingFile(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleFileUpload}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          {
            loading?"Uploading File":"Upload File"
          }
        </button>
      </Modal>
    </Layout>
  );
};

export default FolderContents;
