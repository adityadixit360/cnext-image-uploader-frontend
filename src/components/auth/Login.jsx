import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";

const Login = () => {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const response = await axios.post(
          "http://localhost:8000/api/google-login/",
          {
            token: tokenResponse.access_token,
            email: userInfo.data.email,
            name: userInfo.data.name,
          }
        );

        if (response.data.success) {
          console.log(response.data)
          localStorage.setItem("token", tokenResponse.access_token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/");
        } else {
          console.error("Login failed:", response.data.error);
        }
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    },
    onError: (error) => console.error("Google Login Error:", error),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div>
        <h1 className="text-xl font-medium text-black mb-4">Sign in</h1>
        <GoogleButton onClick={() => login()} />
      </div>
    </div>
  </div>)
};

export default Login;
