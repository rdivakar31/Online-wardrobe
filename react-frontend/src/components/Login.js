import React, { useState } from "react";
// import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doPasswordReset } from "../firebase/FirebaseFunctions";

// import the login page css
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert("Either email or password is incorrect.");
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    if (email) {
      doPasswordReset(email);
      // alert("Password reset email was sent");
    } else {
      alert(
        "Please enter an email address below before you click the forgot password link."
      );
    }
  };

  const redirectToSignUp = () => {
    navigate("/register");
  };

  return (
    <section className="container">
      <header className="header">
        <div className="header-text">
          <span>Wardrobe Wizard</span>
        </div>
        <div className="header-label">
          <span>Slay Every Day</span>
        </div>
      </header>
      <div className="login">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="inputBox">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="inputBox">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="inputBox">
            <input type="submit" value="Login" id="btn" />
          </div>
        </form>
        <button className="forgotPassword" onClick={passwordReset}>
          Forgot Password?
        </button>
        <button className="dontHaveAccount" onClick={redirectToSignUp}>
          Don't Have an Account?
        </button>
      </div>
      <footer className="footer">Footer Content Will Go Here</footer>
    </section>
  );
};

export default Login;
