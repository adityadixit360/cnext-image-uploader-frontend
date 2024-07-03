import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaImage, FaTimesCircle, FaCrop, FaAdjust, FaUndo, FaFilter } from "react-icons/fa";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const filters = {
  none: "None",
  sepia: "Sepia",
  grayscale: "Grayscale",
  invert: "Invert",
  blur: "Blur",
  saturate: "Saturate",
  
};

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activeFilter, setActiveFilter] = useState("none");

  const cropperRef = useRef(null);
console.log(cropperRef)
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setCroppedImage(null);
      setIsCropping(false);
      setBrightness(100);
      setRotation(0);
      setActiveFilter("none");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Uploading:", { file: croppedImage || file, title, description, filter: activeFilter });
    setFile(null);
    setCroppedImage(null);
    setTitle("");
    setDescription("");
    setBrightness(100);
    setRotation(0);
    setActiveFilter("none");
  };

  const removeFile = () => {
    setFile(null);
    setCroppedImage(null);
    setIsCropping(false);
    setBrightness(100);
    setRotation(0);
    setActiveFilter("none");
  };

  const startCropping = () => setIsCropping(true);

  const cropImage = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        setCroppedImage(blob);
        setIsCropping(false);
      });
    }
  };

  const cancelCropping = () => setIsCropping(false);

  const handleBrightnessChange = (e) => setBrightness(e.target.value);

  const handleRotationChange = (e) => setRotation(e.target.value);

  const handleFilterChange = (e) => setActiveFilter(e.target.value);

  const getFilterStyle = () => {
    let filterString = `brightness(${brightness}%)`;
    
    switch (activeFilter) {
      case "sepia":
        filterString += " sepia(100%)";
        break;
      case "grayscale":
        filterString += " grayscale(100%)";
        break;
      case "invert":
        filterString += " invert(100%)";
        break;
      case "blur":
        filterString += " blur(5px)";
        break;
      case "saturate":
        filterString += " saturate(200%)";
        break;
      default:
        break;
    }

    return {
      filter: filterString,
      transform: `rotate(${rotation}deg)`,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Upload Your File
        </h1>
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="p-8">
            {!file && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 transition-all duration-300 ease-in-out ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <FaCloudUploadAlt className="mx-auto text-6xl text-indigo-500 mb-4" />
                  <p className="text-xl font-medium text-gray-700 mb-2">
                    {isDragActive
                      ? "Drop it like it's hot!"
                      : "Drag & drop your image here"}
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to select a file
                  </p>
                </div>
              </div>
            )}

            {file && !isCropping && (
              <div className="relative">
                <img
                  src={croppedImage ? URL.createObjectURL(croppedImage) : URL.createObjectURL(file)}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
                  style={getFilterStyle()}
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                >
                  <FaTimesCircle size={24} />
                </button>
              </div>
            )}

            {file && isCropping && (
              <div className="mb-4">
                <Cropper
                  ref={cropperRef}
                  src={URL.createObjectURL(file)}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={1}
                  guides={true}
                />
                <div className="mt-4 flex justify-center space-x-4">
                  <button onClick={cropImage} className="px-4 py-2 bg-green-500 text-white rounded">
                    Crop
                  </button>
                  <button onClick={cancelCropping} className="px-4 py-2 bg-red-500 text-white rounded">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {file && !isCropping && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brightness
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={handleBrightnessChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rotation
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={handleRotationChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter
                  </label>
                  <select
                    value={activeFilter}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.entries(filters).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center space-x-4">
                  <button onClick={startCropping} className="px-4 py-2 bg-blue-500 text-white rounded">
                    <FaCrop className="inline-block mr-2" /> Crop
                  </button>
                  <button onClick={() => setBrightness(100)} className="px-4 py-2 bg-yellow-500 text-white rounded">
                    <FaAdjust className="inline-block mr-2" /> Reset Brightness
                  </button>
                  <button onClick={() => setRotation(0)} className="px-4 py-2 bg-purple-500 text-white rounded">
                    <FaUndo className="inline-block mr-2" /> Reset Rotation
                  </button>
                  <button onClick={() => setActiveFilter("none")} className="px-4 py-2 bg-green-500 text-white rounded">
                    <FaFilter className="inline-block mr-2" /> Reset Filter
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Give your image a catchy title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows="4"
                  placeholder="Tell us more about your image"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ease-in-out"
                  disabled={!file}
                >
                  <FaImage className="mr-2 h-5 w-5" />
                  Upload Masterpiece
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;