import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";
const imageUrl = import.meta.env.VITE_IMG;

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
          <MovieCard movie={movie} showLink={false} type={1} />
          <div className="container">
          <img id="movieBackground" src={imageUrl + movie.backdrop_path} alt={movie.title} />
          <div id="infoPanel" className="infoPanel">
            <ol id="infoList">
              <li>
                <img id="movieImg" src={imageUrl + movie.poster_path} alt={movie.title} />
              </li>
              <li>
                <ol>
                  <div className="headMovie">
                    <p id="movieTitle" className="Title">{movie.title}</p>
                    <p id="movieDirector" className="Director">{movie.director}</p>
                    <p id="movieTagline" className="tagline">{movie.tagline}</p>
                  </div>
                  <div id="description" className="info description">
                    <p>{movie.overview}</p>
                  </div>
                  <div id="duration">
                    <p>{movie.runtime} minutos de duração.</p>
                  </div>
                </ol>
              </li>
              <li>
                <div className="movieActions">
                  <button id="likeAdd">❤</button>
                  <button id="watchlistAdd">📃</button>
                </div>
              </li>
            </ol>
            
          </div>
          
        </div>
        </>
      )}
    </div>
  );
};

export default Movie;
