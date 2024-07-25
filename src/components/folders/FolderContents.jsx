import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { createFolder, uploadFile } from "../../utils/apis";
import FolderActions from "../FolderAction";
import ItemList from "../ItemList";
import useFolder from "../../hooks/useFolder";

const FolderContents = () => {
  const params = useParams();
  const initialFolderId = params.folderName;
  const [path, setPath] = useState([{ id: initialFolderId, name: initialFolderId }]);
  const [viewType, setViewType] = useState("all");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const {
    folderId,
    setFolderId,
    folderItems,
    isLoading,
    fetchFolderItems,
    imagesLoading,
    loadedImageCount,
    totalImageCount,
  } = useFolder(initialFolderId);

  useEffect(() => {
    if (folderId) {
      fetchFolderItems(folderId);
    }
  }, [folderId, fetchFolderItems]);

  const handleNavigate = useCallback((id, index) => {
    setPath((prevPath) => prevPath.slice(0, index + 1));
    setFolderId(id);
  }, [setFolderId]);

  const handleFolderClick = useCallback((folder) => {
    setPath((prevPath) => [...prevPath, { id: folder.id, name: folder.name }]);
    setFolderId(folder.id);
  }, [setFolderId]);

  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder({
          parent_folder: folderId,
          folder_name: newFolderName,
        });
        fetchFolderItems(folderId);
        setNewFolderName("");
        setIsAddingFolder(false);
      } catch (error) {
        console.error("Error creating folder:", error);
        setError("Failed to create folder. Please try again.");
      }
    }
  };

  const handleFileUpload = async (file) => {
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder_id", folderId);

        await uploadFile(formData);
        fetchFolderItems(folderId);
      } catch (error) {
        console.error("Error uploading file:", error);
        setError("Failed to upload file. Please try again.");
      }
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Breadcrumb path={path} onNavigate={handleNavigate} />
        <FolderActions
          viewType={viewType}
          setViewType={setViewType}
          isAddingFolder={isAddingFolder}
          setIsAddingFolder={setIsAddingFolder}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleAddFolder={handleAddFolder}
          handleFileUpload={handleFileUpload}
        />
        {isUploading && (
          <div className="mb-4 text-blue-600">Uploading file...</div>
        )}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {imagesLoading && (
          <div className="mb-4 text-blue-600">
            Loading images... ({loadedImageCount}/{totalImageCount})
          </div>
        )}
        <ItemList
          items={folderItems}
          viewType={viewType}
          onFolderClick={handleFolderClick}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default FolderContents;