import SignIn from "./pages/SignIn";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import { useAuthDispatch, useAuth } from "./auth.context";
import { postAuthRefresh } from "./auth/auth";
import { parseJwt } from "./lib/utils";
import GoogleLogin from "./pages/OIDCLogin";
import { Navbar } from "./components/navbar";
import NotFound from "./pages/NotFound";

function App() {
  const { setToken } = useAuthDispatch();
  const { token } = useAuth();
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      setLoadingUser(true);

      try {
        const accessToken = parseJwt(localStorage.getItem("accessToken"));
        const refreshToken = parseJwt(localStorage.getItem("refreshToken"));
        if (accessToken && accessToken.exp * 1000 > Date.now()) {
          setToken(localStorage.getItem("accessToken")!);
          setIsAuthenticated(true);
        } else if (refreshToken && refreshToken.exp * 1000 > Date.now()) {
          const response = await postAuthRefresh({
            refreshToken: localStorage.getItem("refreshToken")!,
          });

          if (response.data) {
            localStorage.setItem(
              "accessToken",
              response.data.accessToken || ""
            );
            localStorage.setItem(
              "refreshToken",
              response.data.refreshToken || ""
            );
            localStorage.setItem("userId", response.data._id || "");
            setToken(response.data.accessToken || "");
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userId");
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
      } finally {
        setLoadingUser(false);
      }
    };

    validateToken();
    // eslint-disable-next-line
  }, [token]);

  return (
    <Router>
      {isAuthenticated && !loadingUser && <Navbar />}

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#fcf1d9" }}
      >
        {loadingUser ? (
          <div
            className="spinner-border text-success"
            style={{ width: "15rem", height: "15rem" }}
          />
        ) : (
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<SignIn />} />
                <Route path="/oidc-login" element={<GoogleLogin />} />
                <Route path="/*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/feed" replace />} />{" "}
                <Route path="/feed" element={<Home />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="*" element={<NotFound />} />{" "}
                {/* <Route path="/add-post" element={<AddPost></AddPost>} /> */}
                {/* <Route path="/profile" element={<Profile></Profile>} /> */}
                {/* <Route path="/post/:id" element={<PostDetails></PostDetails>} /> */}
              </>
            )}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
