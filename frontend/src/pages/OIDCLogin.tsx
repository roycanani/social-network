import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../auth.context";

const GoogleLogin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setToken = useAuthDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userId = searchParams.get("_id");

    if (accessToken && refreshToken && userId) {
      // Store the tokens in local storage or cookies
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);

      setToken(accessToken);
      // Redirect to the desired page
      navigate("/");
    } else {
      // Handle the case where tokens are missing
      console.error("Tokens missing from URL");
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Logging in with Google...</h1>
      {/* You can add a loading spinner or message here */}
    </div>
  );
};

export default GoogleLogin;
