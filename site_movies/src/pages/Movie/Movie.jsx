import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const imageUrl = import.meta.env.VITE_IMG

import "./Movie.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const getMovie = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    setMovie(data);
  };

  const formatCurrency = (number) => {
    return number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  useEffect(() => {
    const movieUrl = `${moviesURL}${id}?${apiKey}&language=pt-BR`;
    getMovie(movieUrl);
  }, []);

  return (
    <div className="movie-page">
      {movie && (
        <>
          <img id="movieImg" src={imageUrl + movie.backdrop_path} alt={movie.title} />
          <div id="bgColor"></div>
          <div className="infoPanel">
            <p id="movieTitle" className="Title">{movie.title}</p>
            <p id="movieTagline" className="tagline">"{movie.tagline}"</p>
            <div id="description" className="info description">
              <p>{movie.overview}</p>
            </div>
            <div id="duration" className="info">
              <p>{movie.runtime} minutos de duração.</p>
            </div>
            <div className="movieBtns">
              <button id="gostei">❤</button>
              <button id="lista">📃</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Movie;