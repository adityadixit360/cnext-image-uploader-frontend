import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
          // Save the token and user info in local storage or state if needed
          localStorage.setItem("token", tokenResponse.access_token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // Redirect to home page
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

  return <button onClick={() => login()}>Sign in with Google</button>;
};

export default Login;
