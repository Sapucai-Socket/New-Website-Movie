import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import './MovieCard.css';

const imageUrl = import.meta.env.VITE_IMG;

const MovieCard = ({ movie, showLink = true, type = 1, carussel = 0 }) => {
  const getStarRating = () => {
    const rating = Math.round(movie.vote_average / 2); // Converter a escala de 0-10 para 0-5
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} />);
      } else {
        stars.push(<FaStar key={i} style={{ color: "gray" }} />);
      }
    }

    return stars;
  };

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
          {carussel !== 0 ? (
            <Link to={`/movie/${movie.id}`}>
              <div className="movie-cardPoster">
                <img src={imageUrl + (type === 1 ? movie.backdrop_path : movie.poster_path)} alt={movie.title} />
                <div className="movie-cardInfo">
                  <p id="star">
                    {getStarRating()} {movie.vote_average}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="movie-cardPoster">
              <div className="movie-cardInfo">
                <p id="star">
                  {getStarRating()} {movie.vote_average}
                </p>
              </div>
            </div>
          )}
          <div className="movieTitle">

          </div>
        </>
      )}
    </div>
  );
};

export default MovieCard;
