"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./signup.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
    validateField(id, value);
  };

  const validateField = (id, value) => {
    let error = "";
    switch (id) {
      case "email":
        if (!value.includes("@") || !value.includes(".com")) {
          error = "Email must contain '@' and '.com'.";
        }
        break;
      case "phone_number":
        if (!/^\d{10}$/.test(value)) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "password":
        if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        break;
      case "confirm_password":
        if (value !== form.password) {
          error = "Passwords do not match.";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const { name, email, phone_number, password, confirm_password } = form;
    if (!name || !email || !phone_number || !password || !confirm_password) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone_number, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setForm({
          name: "",
          email: "",
          phone_number: "",
          password: "",
          confirm_password: "",
        });
        setErrors({});
        window.location.href = "/login";
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="signup">
      <h1>Signup</h1>
      <form id="signuppage" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          id="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Email</label>
        <input
          id="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Phone Number</label>
        <input
          id="phone_number"
          placeholder="Enter your phone number"
          value={form.phone_number}
          onChange={handleChange}
        />
        {errors.phone_number && <p className="error">{errors.phone_number}</p>}

        <label>Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Confirm Password</label>
        <input
          id="confirm_password"
          type="password"
          placeholder="Confirm your password"
          value={form.confirm_password}
          onChange={handleChange}
        />
        {errors.confirm_password && (
          <p className="error">{errors.confirm_password}</p>
        )}

        <button id="signupbutton" type="submit">
          Register
        </button>
        <p>
          Have an account? <Link href="/login">Login</Link>
        </p>
      </form>
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default Signup;
