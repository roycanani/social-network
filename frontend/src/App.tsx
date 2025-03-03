// import Home from "./pages/Home";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
// import AddPost from "./pages/AddPost";
// import Profile from "./pages/Profile";
// import Navbar from "./components/Navbar";
// import PostDetails from "./pages/PostDetails";
// import { useUserContext } from "./context/UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  // const { user, loadingUser } = useUserContext() ?? {};
  const user = true;
  const loadingUser = false;

  return (
    <Router>
      {/* {user && <Navbar />} */}

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#fcf1d9" }}
      >
        {false && loadingUser ? (
          <div
            className="spinner-border text-success"
            style={{ width: "15rem", height: "15rem" }}
          />
        ) : (
          <Routes>
            {true || !user ? (
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
