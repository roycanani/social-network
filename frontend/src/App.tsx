import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import { useAuth, useAuthDispatch } from "./auth.context";
import { postAuthRefresh } from "./auth/auth";

function App() {
  const token = useAuth();
  const setToken = useAuthDispatch();
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("first");
    const validateToken = async () => {
      setLoadingUser(true);

      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("first1");
        if (
          accessToken &&
          JSON.parse(accessToken ?? "").expiresIn > Date.now()
        ) {
          console.log("first2");
          // We have a token, set it in auth context
          setToken(accessToken);
          setIsAuthenticated(true);
        } else if (
          refreshToken &&
          JSON.parse(refreshToken ?? "").expiresIn > Date.now()
        ) {
          console.log("first3");
          const response = await postAuthRefresh({ refreshToken });

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
          console.log("first4");
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
  }, [setToken]);

  return (
    <Router>
      {/* {user && <Navbar />} */}

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
                <Route path="/signup" element={<Login />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<SignIn />} />
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
