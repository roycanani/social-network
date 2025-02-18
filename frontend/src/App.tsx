import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegister from "./Login";
import GoogleLoginPage from "./GoogleLoginPage";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/google-login" element={<GoogleLoginPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
