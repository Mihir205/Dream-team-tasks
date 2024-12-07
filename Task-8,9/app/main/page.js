"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./main.css";
import Footer from "../components/footer";

const imageData = [
  { id: 1, src: "/pics/luckybhasker.jpg", title: "Lucky Bhasker", genre: "Action", year: "2024" },
  { id: 2, src: "/pics/venom.jpg", title: "Venom", genre: "Sci-Fi", year: "2021" },
  { id: 3, src: "/pics/devara.jpg", title: "Devara", genre: "Action", year: "2024" },
  { id: 4, src: "/pics/moana.jpg", title: "Moana 2", genre: "Action", year: "2024" },
  { id: 5, src: "/pics/ss.jpg", title: "Saripodha Sanivaram", genre: "Action", year: "2024" },
  { id: 6, src: "/pics/amaran.jpg", title: "Amaran", genre: "Sci-Fi", year: "2021" },
  { id: 7, src: "/pics/sathyam.jpg", title: "Sathyam Sundharam", genre: "Action", year: "2024" },
  { id: 8, src: "/pics/kanguva.jpg", title: "Kanguva", genre: "Action", year: "2024" },
];

const top10Data = [
  { src: "/pics/luckybhasker.jpg", title: "Lucky Bhasker", genre: "Drama,Thriller" },
  { src: "/pics/dead.jpg", title: "Deadpool and wolverine", genre: "Action" },
  { src: "/pics/amaran.jpg", title: "Amaran", genre: "Action" },
  { src: "/pics/wild.jpg", title: "Wild Robot", genre: "Drama" },
  { src: "/pics/devara.jpg", title: "Devara", genre: "Action" },
  { src: "/pics/ss.jpg", title: "Saripodha Sanivaram", genre: "Action" },
  { src: "/pics/bb3.jpg", title: "Bhool Bhuilya 3", genre: "Horror Comedy" },
  { src: "/pics/ka.jpg", title: "Ka", genre: "Suspense,Thriller" },
  { src: "/pics/moana.jpg", title: "Moana-2", genre: "Fantasy" },
  { src: "/pics/sathyam.jpg", title: "Sathyam Sundharam", genre: "Drama" },
];

function Main() {
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {
    showSlides(slideIndex);

    const interval = setInterval(() => {
      plusSlides(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideIndex]);

  const plusSlides = (n) => {
    setSlideIndex((prevIndex) => {
      const newIndex = prevIndex + n;
      return newIndex > 3 ? 1 : newIndex < 1 ? 3 : newIndex;
    });
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  const showSlides = (n) => {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    if (n > slides.length) setSlideIndex(1);
    if (n < 1) setSlideIndex(slides.length);
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  };

  return (
    <main>
      <div className="slideshow-container">
        {["wildrobot.jpg", "daw.jpg", "substance.jpeg"].map((image, index) => (
          <div className="mySlides fade" key={index}>
            <div className="numbertext">{`${index + 1} / 3`}</div>
            <img src={`/pics/${image}`} style={{ width: "100%" }} alt={`Slide ${index + 1}`} />
            <div className="text">{index + 1}</div>
          </div>
        ))}
        <a className="prev" onClick={() => plusSlides(-1)}>❮</a>
        <a className="next" onClick={() => plusSlides(1)}>❯</a>
      </div>
      <br />
      <div style={{ textAlign: "center" }}>
        {[1, 2, 3].map((n) => (
          <span key={n} className="dot" onClick={() => currentSlide(n)}></span>
        ))}
      </div>
      <div className="tables-container">
        <div className="left-table">
        <h1>Latest Movies</h1>
          <table align="center">
            <tbody>
              {imageData.map((image, index) => {
                if (index % 4 === 0) {
                  return (
                    <tr key={index}>
                      {imageData.slice(index, index + 4).map((img, idx) => (
                        <td key={idx}>
                          <Link href={`/movie/${img.id}`}>
                            <img src={img.src} height="350" width="250" alt={img.title} />
                            <p>{`${img.title}`}</p>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          <div id="commentsection" className="commentsection">
            <h2>Newest Reviews</h2>
            <div className="commentrow">
              <div className="commentcard">
                <p><strong>Mihir:</strong> <br />This is a great post!</p>
              </div>
              <div className="commentcard">
                <p><strong>Guest:</strong> <br />I found this very helpful, thanks!</p>
              </div>
              <div className="commentcard">
                <p><strong>Dheeraj:</strong><br /> Awesome content, keep it up!</p>
              </div>
            </div>
            <div className="commentrow">
              <div className="commentcard">
                <p><strong>Nikhil:</strong><br /> I learned a lot from this.</p>
              </div>
              <div className="commentcard">
                <p><strong>Mihir:</strong> <br />Can't wait for the next article!</p>
              </div>
              <div className="commentcard">
                <p><strong>Guest:</strong> <br />Very informative, thank you!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="top10-section">
          <div className="top10-title">Top 10</div>
          <table className="top10-table">
            <tbody>
              {top10Data.map((item, index) => (
                <tr key={index}>
                  <td className="rank">
                  <Link href={`/movie/${item.id}`}>
                    <span className="rank-number">{index + 1}</span>
                    <div className="rank-content">
                      <img src={item.src} alt={item.title} />
                      <p>{`${item.title}\nGenres: ${item.genre}`}</p>
                    </div>
                  </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Main;
