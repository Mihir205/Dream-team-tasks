"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./movie.css";

const Movie = ({ params: paramsPromise }) => {
  const [id, setId] = useState(null); 
  const [movie, setMovie] = useState(null); 
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState(""); 
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await paramsPromise;
      setId(id);
    };
    resolveParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://127.0.0.1:5000/movie/${id}`)
        .then((response) => {
          setMovie(response.data.movie);
          setReviews(response.data.reviews || []);
        })
        .catch((error) => {
          console.error("Error fetching movie details:", error);
        });
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUsername(user.name); 
      }
    }
  }, [id]);

  const addToTasklist = (movie) => {
    axios
      .post("http://127.0.0.1:5000/tasklist", { id: movie.id }, { withCredentials: true })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error("Error adding to tasklist:", error);
        alert("Failed to add movie to tasklist.");
      });
  };

  const addReview = () => {
    if (!newReview.trim()) {
      alert("Review cannot be empty.");
      return;
    }

    axios
      .post(
        `http://127.0.0.1:5000/movie/${id}/review`,
        { review: newReview, username },
        { withCredentials: true }
      )
      .then((response) => {
        setReviews([...reviews, response.data.review]);
        setNewReview(""); 
      })
      .catch((error) => {
        console.error("Error adding review:", error);
        alert("Failed to add review.");
      });
  };

  if (!movie) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="movie">
      <div className="movie-container">
        <div className="pic">
          <img src={movie.image} alt={movie.title} />
        </div>
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <p>
            <strong>Genre:</strong> {movie.genre}
          </p>
          <p>
            <strong>Year:</strong> {movie.year}
          </p>
        </div>
        <button
          className="watchlist"
          onClick={() => addToTasklist(movie)} 
        >
          Add to Tasklist
        </button>
        <div className="review-section">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review"
          ></textarea>
          <button className="addreview" onClick={addReview}>
            Add Review
          </button>
          <div className="reviews-box">
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review">
                  <p>
                    <strong>{review.username || "Guest"}:</strong> {review.text}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to add one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
