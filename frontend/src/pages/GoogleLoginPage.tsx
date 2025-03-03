import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleLoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

      // Redirect to the desired page
      navigate("/home");
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

export default GoogleLoginPage;
