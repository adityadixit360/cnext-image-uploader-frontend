import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/auth/Login';
import UserProfile from './components/profile/UserProfile';
import UploadImage from './components/profile/UploadImage';
import ImageGallery from './components/imageGallery/ImageGallery';
import Register from './pages/auth/Register';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    //  if user is authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    // save  token and set authentication state
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Sidebar />} />
        {/* <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Sidebar onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        /> */}
        <Route exact path="/uploadimage" element={<UploadImage />} />
        <Route exact path="/gallery" element={<ImageGallery />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;