import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import requests from "../../utils/requests";
import "./banner.css";

function Banner() {
  const [movie, setMovie] = useState({});
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Fetch a random Netflix original
      const request = await axios.get(requests.fetchNetflixOriginals);
      const randomMovie =
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ];
      setMovie(randomMovie);

      // Fetch videos for this movie
      if (randomMovie?.id) {
        const videoResponse = await axios.get(
          `/movie/${randomMovie.id}/videos?api_key=${process.env.REACT_APP_API_KEY}`
        );

        const videos = videoResponse.data.results;
        // Find trailer
        const trailer = videos.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        setTrailer(trailer || null);
      }
    }
    fetchData();
  }, []);

  // Truncate description
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
        )`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className="banner__buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>
          {trailer && (
            <button
              className="banner__button"
              onClick={() => {
                // Open trailer modal or play trailer
                window.open(
                  `https://www.youtube.com/watch?v=${trailer.key}`,
                  "_blank"
                );
              }}
            >
              Watch Trailer
            </button>
          )}
        </div>

        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>

      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;
