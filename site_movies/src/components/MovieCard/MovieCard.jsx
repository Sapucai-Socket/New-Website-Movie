import { Link } from "react-router-dom"

import {FaStar} from "react-icons/fa"
const imageUrl = import.meta.env.VITE_IMG

import './MovieCard.css'

const MovieCard = ({movie, showLink = true, type = 1}) => {
  
  //var url_path = type == 1 ? movie.backdrop_path : type == 2 ? movie.poster_path : ""
  var url_path = type == 1 ? movie.backdrop_path : movie.poster_path
  
  return <div className="movie-card">
    {showLink && <Link to={`/movie/${movie.id}`}>
      <img src={imageUrl + movie.poster_path} alt={movie.title} />
    <h2>{movie.title}</h2>
    <p id="star">
        <FaStar /> {movie.vote_avarage}
    </p>
      </Link>}
  
  </div>
}

export default MovieCard