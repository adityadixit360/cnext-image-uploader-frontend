import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from 'react-modal';

const mockImages = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  url: `https://picsum.photos/200/300?random=${index + 1}`,
  name: `Image ${index + 1}`,
  downloads: Math.floor(Math.random() * 1000)
}));

const ImageGallery = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const imagesPerPage = 20;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = mockImages.slice(indexOfFirstImage, indexOfFirstImage + imagesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setFilter('none');
    setBrightness(100);
    setCompletedCrop(null);
    setCrop({ unit: '%', width: 30, aspect: 1 });
  };

  const downloadImage = () => {
    if (!completedCrop || !previewCanvasRef.current) {
      return;
    }

    const canvas = previewCanvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = 'customized-image.jpg';
    link.click();
  };

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.filter = `${filter} brightness(${brightness}%)`;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop, filter, brightness]);

  const filters = {
    none: 'None',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    invert: 'invert(100%)',
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: imagesPerPage }, (_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-300 h-48 w-full"
              ></div>
            ))
          : currentImages.map((image) => (
              <div
                key={image.id}
                className="relative bg-white shadow rounded overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 p-2 flex items-center space-x-2 bg-gray-700 rounded-l">
                  <FiDownload
                    className="text-white cursor-pointer"
                    size={20}
                    onClick={() => openModal(image)}
                  />
                  <span className="text-white text-sm">{image.downloads}</span>
                </div>
                <div className="p-2">
                  <p className="text-gray-800">{image.name}</p>
                </div>
              </div>
            ))}
      </div>
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Customize Image"
        className="bg-white p-6 rounded shadow-lg max-w-3xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div>
          <h2 className="text-2xl font-bold mb-4">Customize Image</h2>
          {selectedImage && (
            <>
              <ReactCrop
                src={selectedImage.url}
                onImageLoaded={onImageLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              />
              <div className="mt-4">
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: Math.round(completedCrop?.width ?? 0),
                    height: Math.round(completedCrop?.height ?? 0),
                  }}
                  className="mx-auto"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {Object.entries(filters).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`py-2 px-4 border rounded-md text-sm font-medium ${
                      filter === key
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Brightness
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={downloadImage}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Download
                </button>
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ImageGallery;
