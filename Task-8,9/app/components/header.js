"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    setUser(null); 
    window.location.href = "/";
  };

  return (
    <header>
      <div className="left">
        <Link href="/main">
          <img src="/pics/logo.png" alt="Logo" height="350" width="250" />
        </Link>
      </div>
      <div className="right">
        <nav className="navigation">
          <Link href="/">Home</Link>
          <Link href="main/#commentsection">Reviews</Link>
          <Link href="/tasklist">Tasklist</Link>
        </nav>
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btnlogout">
              Logout
            </button>
          </div>
        ) : (
          <Link href="/signup">
            <button className="btnlogin">Login/Sign Up</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
