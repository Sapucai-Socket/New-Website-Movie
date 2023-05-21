import { Link, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import './MovieCard.css';

const imageUrl = import.meta.env.VITE_IMG;

const MovieCard = ({ movie, showLink = true, type = 1 }) => {
  const location = useLocation();
  const url_path = location.pathname === "/" ? "" : (type === 1 ? movie.backdrop_path : movie.poster_path);

  return (
    <div className="movie-card">
      {showLink && (
        <Link to={`/movie/${movie.id}`}>
          <div className="movie-cardPoster">
            {url_path && <img src={imageUrl + url_path} alt={movie.title} />}
            <div className="movie-cardInfo">
              <p id="star">
                <FaStar /> {movie.vote_average}
              </p>
            </div>
          </div>
          <div className="movieTitle">
            <h2>{movie.title}</h2>
          </div>
        </Link>
      )}
    </div>
  );
};

export default MovieCard;

