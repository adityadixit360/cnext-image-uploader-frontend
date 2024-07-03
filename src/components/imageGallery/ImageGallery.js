import React, { useState, useEffect, useRef } from "react";
import { FiDownload, FiEdit2, FiArrowLeft } from "react-icons/fi";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { saveAs } from "file-saver";

const mockImages = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  url: `https://picsum.photos/200/300?random=${index + 1}`,
  name: `Image ${index + 1}`,
  downloads: Math.floor(Math.random() * 1000),
}));

const ImageGallery = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("none");
  const cropperRef = useRef(null);

  const imagesPerPage = 20;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = mockImages.slice(
    indexOfFirstImage,
    indexOfFirstImage + imagesPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

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

  const handleCropperReady = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      cropper.setData({
        x: 0,
        y: 0,
        width: cropper.getImageData().naturalWidth,
        height: cropper.getImageData().naturalHeight
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-800 hover:text-gray-600 transition duration-150"
        >
          <FiArrowLeft className="mr-2" />
          Back to Folders
        </button>
      </div>
      {selectedImage ? (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full ">
            <h2 className="text-2xl font-bold mb-4">Edit Image</h2>
            <Cropper
              ref={cropperRef}
              src={selectedImage.url}
              style={{ height: 400, width: '100%' }}
              guides={true}
              preview=".img-preview"
              viewMode={1}
              dragMode="move"
              ready={handleCropperReady}
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
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Preview:</h3>
              <div 
                className="img-preview" 
                style={{ 
                  width: '100%', 
                  height: 200, 
                  overflow: 'hidden',
                  filter: filter 
                }}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDownload(selectedImage)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ">
          {loading
            ? Array.from({ length: imagesPerPage }, (_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-300 h-48 w-full "
                ></div>
              ))
            : currentImages.map((image) => (
                <div
                  key={image.id}
                  className="relative bg-white shadow rounded overflow-hidden relative rounded-lg "
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-48 object-cover relative z-0 rounded-lg transition-all duration-300 hover:scale-110"
                  />
                  <div className="absolute top-0 right-0 p-2 flex items-center space-x-2 bg-gray-700 rounded-l">
                    <FiDownload
                      className="text-white cursor-pointer"
                      size={20}
                      onClick={() => handleDownload(image)}
                    />
                    <FiEdit2
                      className="text-white cursor-pointer"
                      size={20}
                      onClick={() => handleImageSelect(image)}
                    />
                    <span className="text-white text-sm">{image.downloads}</span>
                  </div>
                  <div className="p-2">
                    <p className="text-gray-800">{image.name}</p>
                  </div>
                </div>
              ))}
        </div>
      )}
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex space-x-2">
            {Array.from(
              { length: Math.ceil(mockImages.length / imagesPerPage) },
              (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-2 rounded ${
                      currentPage === index + 1
                        ? "bg-gray-800 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ImageGallery;