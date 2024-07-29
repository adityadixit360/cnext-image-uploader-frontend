import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import FolderContents from "./components/folders/FolderContents";
import Login from "./components/auth/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./config";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

const NotFound = () => {
  return <Navigate to={"/"} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/folders"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/folders/*"
          element={
            <PrivateRoute>
              <FolderContents />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
                <Login />
              </GoogleOAuthProvider>
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
