import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { createFolder, uploadFile } from "../../utils/apis";
import ItemList from "../ItemList";
import useFolder from "../../hooks/useFolder";
import { FiX, FiUploadCloud } from "react-icons/fi";
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


  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const closeModal = () => {
    setSelectedFile(null); 
    setIsUploadingFile(false);
  };

  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsAddingFolder(false);
    }
  };

  useEffect(() => {
    if (isAddingFolder) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddingFolder]);

  const modalRef2 = useRef(null);

  const handleClickOutside2 = (event) => {
    if (modalRef2.current && !modalRef2.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isUploadingFile) {
      document.addEventListener('mousedown', handleClickOutside2);
    } else {
      document.removeEventListener('mousedown', handleClickOutside2);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside2);
    };
  }, [isUploadingFile]);


  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: '20px',
      borderRadius: "8px",
      maxWidth: "400px",
      width: "100%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  };

  const modalStyle2 = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
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
              All
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
        <div ref={modalRef} className="p-6 bg-white rounded shadow-lg">
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
            {loading ? 'Creating folder' : 'Create Folder'}
          </button>
        </div>
      </Modal>
      

      {/* Upload File Modal */}
      <Modal
        isOpen={isUploadingFile}
        onRequestClose={closeModal}
        style={modalStyle2}
        contentLabel="Upload File Modal"
      >
        <div ref={modalRef2} className="flex flex-col bg-white rounded-lg shadow-lg m-0">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold"></h2>
            <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          <div
            className="flex flex-col items-center justify-center p-4 bg-white border-dotted border-4 border-purple-300 rounded-2xl mx-4 mt-0"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <FiUploadCloud size={48} className="text-gray-400 mb-2" />
            <p className="text-gray-600 mb-1 text-sm text-center">Drag and drop your file here</p>
            <p className="text-gray-400 mb-2 text-xs text-center">or</p>
            <label className="cursor-pointer text-orange-600 hover:underline text-xs mb-2 text-center">
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
              />
              Browse files
            </label>
            <div className="text-center mt-2">
              {selectedFile ? (
                <p className="text-gray-700 text-xs">Selected file: {selectedFile.name}</p>
              ) : (
                <p className="text-gray-500 text-xs">No file selected</p>
              )}
            </div>
          </div>
          <div className="p-3 bg-white flex justify-center">
            <button
              onClick={handleFileUpload}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFile ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}
              disabled={!selectedFile}
            >
              {loading ? 'Uploading File' : 'Upload File'}
            </button>
          </div>
        </div>
      </Modal>

    </Layout>
  );
};

export default FolderContents;
