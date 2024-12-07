"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "./tasklist.css";

const Tasklist = () => {
  const [tasklist, setTasklist] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/tasklist")
      .then((response) => {
        setTasklist(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasklist:", error);
      });
  }, []);

  return (
    <div className="tasklist">
      <h1>Tasklist</h1>
      {tasklist.length === 0 ? (
        <p>It is empty.</p>
      ) : (
        <div className="tables-container">
          {tasklist.map((movie, index) => (
            <div key={index} className="movie-item">
              <Link href={`/movie/${movie.id}`}>
                <img
                  src={movie.image}
                  alt={movie.title}
                />
                <p>
                  {movie.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasklist;
