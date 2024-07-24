import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import FolderContents from "./components/folders/FolderContents";
import Sidebar from "./components/Sidebar";
import Login from "./components/auth/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <Router>
      {/* <Sidebar /> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route
          path="/folder-content/:folderName"
          element={<FolderContents />}
        /> */}
        <Route
          path="/login"
          element={
            <GoogleOAuthProvider clientId="214146765583-br28c5tcj6u1gmfbvc64in588l8b54qs.apps.googleusercontent.com">
              <Login />
            </GoogleOAuthProvider>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;