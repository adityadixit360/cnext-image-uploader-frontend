import React, { useState, useCallback, useEffect, useRef } from "react";
import { FiDownload, FiEdit2, FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { saveAs } from "file-saver";

const mockImages = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  url: `https://picsum.photos/200/300?random=${index + 1}`,
  name: `Image ${index + 1}`,
  downloads: Math.floor(Math.random() * 1000),
}));

const ImageItem = React.memo(({ image, onSelect, onDownload }) => (
  <div className="relative bg-white shadow rounded overflow-hidden transition-transform duration-200 hover:scale-105">
    <div className="overflow-hidden">
      <img
        src={image.url}
        alt={image.name}
        className="w-full h-48 object-cover transform transition-transform duration-200 hover:scale-110"
        loading="lazy"
      />
    </div>
    <div className="absolute top-0 right-0 p-2 flex items-center space-x-2 bg-gray-700 bg-opacity-75 rounded-bl">
      <FiDownload
        className="text-white cursor-pointer hover:text-blue-300"
        size={20}
        onClick={(e) => { e.stopPropagation(); onDownload(image); }}
      />
      <FiEdit2
        className="text-white cursor-pointer hover:text-green-300"
        size={20}
        onClick={(e) => { e.stopPropagation(); onSelect(image); }}
      />
      <span className="text-white text-sm">{image.downloads}</span>
    </div>
    <div className="p-2">
      <p className="text-gray-800 truncate">{image.name}</p>
    </div>
  </div>
));

const ImageGallery = ({ onBack }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const imagesPerPage = 24;
  const cropperRef = useRef(null);

  const loadImages = useCallback(() => {
    setLoading(true);
    // Simulating API call with mockImages
    setTimeout(() => {
      const indexOfLastImage = currentPage * imagesPerPage;
      const indexOfFirstImage = indexOfLastImage - imagesPerPage;
      const newImages = mockImages.slice(indexOfFirstImage, indexOfLastImage);
      setImages(newImages);
      setLoading(false);
    }, 500);
  }, [currentPage]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleImageSelect = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  // const handleDownload = useCallback((image) => {
  //   saveAs(image.url, image.name);
  // }, []);
  const handleDownload = (image) => {
    if (selectedImage) {
      // If editing, apply crop and filter
      if (cropperRef.current) {
        const cropper = cropperRef.current.cropper;
        const canvas = cropper.getCroppedCanvas();
        
        // Apply filter
        const filteredCanvas = document.createElement('canvas');
        const ctx = filteredCanvas.getContext('2d');
        filteredCanvas.width = canvas.width;
        filteredCanvas.height = canvas.height;
        ctx.filter = filter;
        ctx.drawImage(canvas, 0, 0);

        filteredCanvas.toBlob((blob) => {
          saveAs(blob, selectedImage.name);
        });
      }
    } else {
      // If not editing, download the original image
      fetch(image.url)
        .then(response => response.blob())
        .then(blob => saveAs(blob, image.name))
        .catch(error => console.error("Error downloading image:", error));
    }
  };


  const totalPages = Math.ceil(mockImages.length / imagesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-gray-800 hover:text-gray-600 transition duration-150 mb-4"
      >
        <FiArrowLeft className="mr-2" />
        Back to Folders
      </button>

      {selectedImage ? (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Image</h2>
            <Cropper
              src={selectedImage.url}
              style={{ height: 400, width: "100%" }}
              guides={true}
              viewMode={1}
            />
            <div className="mt-4">
              <label className="block mb-2">
                Filter:
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="ml-2 border rounded p-1"
                >
                  <option value="none">None</option>
                  <option value="grayscale(100%)">Grayscale</option>
                  <option value="sepia(100%)">Sepia</option>
                  <option value="invert(100%)">Invert</option>
                  <option value="blur(5px)">Blur</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDownload(selectedImage)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: imagesPerPage }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 h-48 rounded animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {images.map((image) => (
                <ImageItem
                  key={image.id}
                  image={image}
                  onSelect={handleImageSelect}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition duration-150`}
            >
              <FiChevronLeft size={20} />
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition duration-150`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(ImageGallery);
