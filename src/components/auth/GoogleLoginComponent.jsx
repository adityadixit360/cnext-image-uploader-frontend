import React from "react";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";

const GoogleLoginComponent = () => {
  const onSuccess = (response) => {
    console.log("Login Success:", response);
    localStorage.setItem("token", response.tokenId);
    // Handle post-login logic here
  };

  const onFailure = (response) => {
    console.log("Login Failed:", response);
  };

  return (
    <GoogleLogin
      clientId={CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginComponent;
