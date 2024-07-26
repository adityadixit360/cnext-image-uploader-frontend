import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { useDispatch } from "react-redux";
import { userDetails } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const response = await axios.post(
          "http://127.0.0.1:8000/api/google-login/",
          {
            token: tokenResponse.access_token,
          }
        );
        dispatch(userDetails(userInfo?.data)); // storing the user info

        if (response.data.success) {
          toast.success("Logged in successfully");
          localStorage.setItem("token", tokenResponse.access_token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/");
        } else {
          console.error("Login failed:", response.data.error);
        }
      } catch (error) {
        console.error("Error during Google login:", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      setIsLoading(false);
    },
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9120.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721520000&semt=ais_user')",
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-2xl">Wait for a while..</div>
        </div>
      )}
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 z-10">
        <div>
          <h1 className="text-xl font-medium text-black mb-4">Sign in</h1>
          <GoogleButton onClick={() => login()} />
        </div>
      </div>
    </div>
  );
};

export default Login;
