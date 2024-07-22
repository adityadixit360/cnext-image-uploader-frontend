import axios from "axios";

export const createFolder = async ({ parent_folder, folder_name }) => {
  const res = await axios.post(
    "http://127.0.0.1:8000/create-folder/",
    {
      parent_folder: parent_folder,
      folder_name: folder_name,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res;
};

export const uploadFile = async (formData) => {
  const res = await axios.post("http://127.0.0.1:8000/upload-file/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};
