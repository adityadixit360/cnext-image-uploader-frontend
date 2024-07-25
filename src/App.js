// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
// import FolderContents from "./components/folders/FolderContents";
// import Login from "./components/auth/Login";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { config } from "./config";

// const App = () => {

//   return (
//     <Router>
//       <Routes>
//         <Route path='/folders' element={<Dashboard/>}/>
//         <Route path='/' element={<Dashboard/>}/>
//         <Route path='/folders/:folderName' element={<FolderContents/>}/>
//         <Route path="/login" element={
//            <GoogleOAuthProvider clientId={`${config.GOOGLE_CLIENT_ID}`}>
//            <Login />
//          </GoogleOAuthProvider>
//         }>
//         </Route>
//       </Routes>
//     </Router>

//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import FolderContents from "./components/folders/FolderContents";
import Login from "./components/auth/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./config";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
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
            path="/folders/:folderName"
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
                <Login />
              </PublicRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
