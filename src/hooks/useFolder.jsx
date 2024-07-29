import { useState, useCallback } from "react";
import apiClient from "../redux/apiClient";

const useFolder = (initialFolderId) => {
  const [folderId, setFolderId] = useState(initialFolderId);
  const [folderItems, setFolderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cache, setCache] = useState({});
  const [imagesLoading, setImagesLoading] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);
  const [totalImageCount, setTotalImageCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchFolderItems = useCallback(
    async (folderId) => {
      setIsLoading(true);
      setImagesLoading(false);
      setLoadedImageCount(0);
      setTotalImageCount(0);
      try {
        if (cache[folderId]) {
          setFolderItems(cache[folderId]);
        } else {
          const res = await apiClient.get(`/list-files/${folderId}/`, {
            headers: {
              Authorization: token,
            },
          });
          const { files, folders } = res?.data;

          const formattedFiles = files.map((file) => ({
            id: file.Key,
            name: file.Key.split("/").pop(),
            lastModified: new Date(file.LastModified).toLocaleDateString(),
            url: file.URL,
            type: "file",
          }));

          const formattedFolders = folders.map((folder) => ({
            id: folder.folderName,
            name: folder.folderName.split("/").filter(Boolean).pop(),
            lastModified: new Date(folder.LastModified).toLocaleDateString(),
            totalItems: folder.FileCount + folder.FolderCount,
            type: "folder",
          }));

          const items = [...formattedFolders, ...formattedFiles];
          setFolderItems(items);
          // setCache((prevCache) => ({ ...prevCache, [folderId]: items }));

          const imageCount = formattedFiles.filter((file) =>
            ["jpg", "jpeg", "png", "gif", "bmp", "webp"].some((ext) =>
              file.name.toLowerCase().endsWith(ext)
            )
          ).length;

          setTotalImageCount(imageCount);
          setImagesLoading(imageCount > 0);
        }
      } catch (error) {
        console.error("Error fetching folder contents:", error);
      }
      setIsLoading(false);
    },
    [cache]
  );

  return {
    folderId,
    setFolderId,
    folderItems,
    isLoading,
    fetchFolderItems,
    imagesLoading,
    loadedImageCount,
    totalImageCount,
    setLoadedImageCount,
  };
};

export default useFolder;
