"use client";
import React from "react";
import Link from "next/link";
import "./login.css";

const Login = () => {
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;

    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/main";
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form id="loginpage" onSubmit={handleLogin}>
        <label>Email</label>
        <input id="email" placeholder="Enter your email" />
        <label>Password</label>
        <input id="pass" type="password" placeholder="Enter your password" />
        <button id="loginbutton" type="submit">
          Login
        </button>
        <p>
          Don't have an account? <Link href="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
  