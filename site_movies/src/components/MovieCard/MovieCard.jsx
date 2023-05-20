import { Link } from "react-router-dom"

import {FaStar} from "react-icons/fa"
const imageUrl = import.meta.env.VITE_IMG
import Movie from "../../pages/Movie/Movie";

import './MovieCard.css'

const MovieCard = ({movie, showLink = true, type = 1}) => {
  
  //var url_path = type == 1 ? movie.backdrop_path : type == 2 ? movie.poster_path : ""
  var url_path = type == 1 ? movie.backdrop_path : movie.poster_path

  return <div className="movie-card">
    {showLink && <Link to={`/movie/${movie.id}`}>
      <div className="movie-cardPoster">
        <img src={imageUrl + url_path} alt={movie.title} />
        <div className="movie-cardInfo">
          <p id="star">
              <FaStar /> {movie.vote_avarage}
          </p>
        </div>
      </div>
      <div className="movieTitle">
        <h2 >{movie.title}</h2>
      </div>
    </Link>}
  
  </div>
}

export default MovieCard