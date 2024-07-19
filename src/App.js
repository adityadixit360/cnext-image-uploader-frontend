import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import FolderContents from "./components/folders/FolderContents";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/folder-content/:folderName"
          element={<FolderContents />}
        />
      </Routes>
    </Router>
  );
};

export default App;
