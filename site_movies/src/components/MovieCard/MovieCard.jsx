import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import './MovieCard.css';

const imageUrl = import.meta.env.VITE_IMG;

const MovieCard = ({ movie, showLink = true, type = 1, carussel = 0 }) => {
  return (
    <div className="movie-card">
      {showLink && carussel === 0 ? (
        <Link to={`/movie/${movie.id}`}>
          <div className="movieTitle">
            <h2>{movie.title}</h2>
          </div>
        </Link>
      ) : (
        <>
          <div className="movie-cardPoster">
            {carussel !== 0 && (
              <img src={imageUrl + (type === 1 ? movie.backdrop_path : movie.poster_path)} alt={movie.title} />
            )}
            <div className="movie-cardInfo">
              <p id="star">
                <FaStar /> {movie.vote_average}
              </p>
            </div>
          </div>
          <div className="movieTitle">
            <h2>{movie.title}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieCard;
