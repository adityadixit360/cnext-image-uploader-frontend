import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { useDispatch } from "react-redux";
import { userDetails } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
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
        dispatch(userDetails(userInfo?.data)); //storing the user info

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
      }
    },
    onError: (error) => console.error("Google Login Error:", error),
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/abstract-digital-grid-vector-black-background_53876-111550.jpg?w=1060&t=st=1721913963~exp=1721914563~hmac=8ada60cd38fad6050ba53fcf1654d7dd86919278e3c4f28de7256094e7062da5')",
      }}
    >
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-medium text-black mb-4">Sign in</h1>
          <GoogleButton onClick={() => login()} />
        </div>
      </div>
    </div>
  );
};

export default Login;
