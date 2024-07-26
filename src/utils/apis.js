import axios from "axios";

export const createFolder = async ({ parent_folder, folder_name, token }) => {
  const res = await axios.post(
    "http://127.0.0.1:8000/create-folder/",
    {
      parent_folder: parent_folder,
      folder_name: folder_name,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": token,
      },
    }
  );
  return res;
};

export const uploadFile = async (formData,token) => {
  const res = await axios.post("http://127.0.0.1:8000/upload-file/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": token,
    },
  });
  return res;
};
