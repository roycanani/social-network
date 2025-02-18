import React, { useState } from "react";

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const data = isLogin ? { email, password } : { userName, email, password };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        // Handle successful login/registration (e.g., store tokens, redirect)
      } else {
        const error = await response.json();
        console.error("Error:", error);
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Handle network errors
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google authentication endpoint
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="login-register-container">
      <div className="tabs">
        <button
          onClick={() => setIsLogin(true)}
          className={isLogin ? "active" : ""}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={!isLogin ? "active" : ""}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label htmlFor="userName">Username:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      <hr />

      <button onClick={handleGoogleLogin} className="google-login-button">
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginRegister;
