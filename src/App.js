import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import FolderContents from "./components/folders/FolderContents";
import Login from "./components/auth/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./config";

const App = () => {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/folder-content/:folderName' element={<FolderContents/>}/>
        <Route path="/login" element={
           <GoogleOAuthProvider clientId={`${config.GOOGLE_CLIENT_ID}`}>
           <Login />
         </GoogleOAuthProvider>
        }>
        </Route>
      </Routes>
    </Router>
   
  );
};

export default App;
