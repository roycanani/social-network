import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../auth.context";

const Logout = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthDispatch();

  useEffect(() => {
    localStorage.clear();
    setToken(null);

    navigate("/");
  }, [navigate]);

  return (
    <div className="logout-page">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
