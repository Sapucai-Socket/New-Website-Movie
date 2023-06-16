import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";
import { auth, db } from "../../firebase";
import { getAdditionalUserInfo, onAuthStateChanged, signInWithPopup, signOut, } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

//import firebase from 'firebase/app'
//const FieldValue = firebase.firestore.FieldValue;

const imageUrl = import.meta.env.VITE_IMG;

import "./Movie.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [fav, setFav] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const movieUrl = `${moviesURL}${id}?${apiKey}&language=pt-BR`;
    getMovie(movieUrl);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            setUser(user)
            getFav(uid)       
        } /*else {
          navigate("/login");
        }*/
        alert(`${user.uid}"`);
    });

    return () => {
        unsubscribe();
    };
  }, []);


  const updateFavoriteFilm = (id, imageUrl, poster_path) => {
    alert(`${id}: "${imageUrl + poster_path}" ${fav["3213123"]}`);
  
    // Se o filme não estiver favoritado
    if (!fav.hasOwnProperty(id)) {
      const docRef = doc(db, "users", user.uid);
      setDoc(
        docRef,
        {
          fav: {
            ...fav, // Manter as propriedades existentes
            [id]: imageUrl + poster_path // Adicionar a nova propriedade com o ID como chave
          },
        },
        { merge: true }
      );
    } else {
      // O que você deseja fazer quando o filme já estiver favoritado?
      // Adicione o código aqui.
    }
  }
  

  const getMovie = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    setMovie(data);
    console.log(`${id}: "${imageUrl + data.poster_path}"`)
  };

  const getFav = async(uid) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const fav = docSnap.data().fav
      //const favJson = JSON.stringify(fav, null, 3);
      //alert(`${fav["3213123"]}`);
      setFav(fav);

      ///TODO: acessar o fav[id] e, caso exista, mudar o coração para preenchido, senão mantem o coração sem preenchimento

      
  }

  return (
    <div className="movie-page">
      {movie && (
        <>
          <MovieCard movie={movie} showLink={false} type={1} />
          <div className="container">

          <img id="movieBackground" src={imageUrl + movie.backdrop_path} alt={movie.title} />
          <div className="backgroundMovieShadow"></div>
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
                    <p><p id="movieRuntime">{movie.runtime}</p> minutos de duração.</p>
                  </div>
                </ol>
              </li>
              <li>
                <div className="movieActionsBox">
                  <ol className="movieActions">
                    <div>
                      <button class="button heart" onClick={() => updateFavoriteFilm(id, imageUrl, movie.poster_path)}>
                        <i className="fa-regular fa-heart"></i>
                      </button>
                    </div>
                    <div>
                      <button class="button eyes">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                    </div>
                    <div>
                      <button class="button clock">
                        <i class="fa-solid fa-list-ul"></i>
                      </button>
                      
                    </div>
                  </ol>
                  
                  <div className="reviewButton">
                    <button>
                      <h2>Review</h2>
                    </button>
                  </div>
                  
                  <div className="addListButton">
                    <button>
                      <h2>Adicionar á Lista...</h2>
                    </button>
                  </div>
                  
                 
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