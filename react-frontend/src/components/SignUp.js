import React from "react";
//import '../App.css';
import { Button, Input } from "@mui/material";
import { InputLabel } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

// import the Sign Up file
import "./SignUp.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { name, email, password, cpassword } = event.target;

    console.log("name", name.value);
    console.log("email", email.value);
    console.log("password", password.value);
    console.log("cpassword", cpassword.value);
    function validateName(name) {
      const nameRegex = /^[a-zA-Z]+$/;
      if (nameRegex.test(name) === false) {
        alert("Name contains numbers or symbols");
        return false;
      }
      return true;
    }
    const validateEmail = (email) => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (emailRegex.test(email) === false) {
        alert("Error in Email");
        return false;
      }
      return true;
    };
    const validatePassword = (password) => {
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
      if (passwordRegex.test(password) === false) {
        alert(
          "Password should contain at least 1 number, 1 symbol, and one capital letter. It should also be more than 6 characters."
        );
        return false;
      }
      return true;
    };

    if (validateName(name.value) === false) {
      return false;
    }
    if (validateEmail(email.value) === false) {
      return false;
    }
    if (validatePassword(password.value) === false) {
      return false;
    }
    console.log(1);
    if (validatePassword(cpassword.value) === false) {
      return false;
    }
    if (password.value !== cpassword.value) {
      // setPasswordMatch("Passwords do not match");
      alert("Passwords do not match.");
      return false;
    }

    // if (currentUser) {
    //   navigate("/home");
    // }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      await updateProfile(userCredential.user, { displayName: name.value });
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
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
      <div className="register">
        <h2>Register</h2>
        <form onSubmit={(e) => handleSignUp(e)} className="login-form">
          <div className="inputBox">
            <InputLabel htmlFor="name">User Name</InputLabel>
            <Input id="name" name="name" />
          </div>
          <div className="inputBox">
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" type="email" name="email" />
          </div>
          <div className="inputBox">
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input id="password" type="password" name="password" />
          </div>
          <div className="inputBox">
            <InputLabel htmlFor="cpassword">Confirm Password</InputLabel>
            <Input id="cpassword" type="password" name="cpassword" />
          </div>
          <div className="inputBox">
            <Button type={"submit"} variant={"contained"}>
              Create Account
            </Button>
          </div>
        </form>
        <button className="alreadyHaveAccount" onClick={redirectToLogin}>
          Already Have an Account?
        </button>
      </div>
      <footer className="footer">Footer Content Will Go Here</footer>
    </section>
  );
};

export default SignUpPage;
