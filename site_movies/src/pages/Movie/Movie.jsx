import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import Header from "../../components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Movie.css";

const imageUrl = import.meta.env.VITE_IMG;
const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [fav, setFav] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const movieUrl = `${moviesURL}${id}?${apiKey}&language=pt-BR`;
    getMovie(movieUrl);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        getFav(uid);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addFavoriteFilm = async (id) => {
    if (!user) {
      // Caso o usuário não esteja autenticado, redirecionar para a página de login
      navigate("/login");
      return;
    }

    const updatedFav = { ...fav };
    updatedFav[id] = imageUrl + movie.poster_path;

    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { fav: updatedFav }, { merge: true });
    toast.success("Filme adicionado aos favoritos");

    setFav(updatedFav);
  };

  const removeFavoriteFilm = async (id) => {
    if (!user) {
      // Caso o usuário não esteja autenticado, redirecionar para a página de login
      navigate("/login");
      return;
    }

    const updatedFav = { ...fav };
    delete updatedFav[id];

    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, { fav: updatedFav });
    toast.success("Filme removido dos favoritos");

    setFav(updatedFav);
  };

  const updateFavoriteFilm = (id) => {
    if (fav.hasOwnProperty(id)) {
      removeFavoriteFilm(id);
    } else {
      addFavoriteFilm(id);
    }
  };

  const getMovie = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    setMovie(data);
  };

  const getFav = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data();

    if (userData && userData.fav) {
      setFav(userData.fav);
    } else {
      setFav({});
    }
  };

  // Adicione este useEffect para buscar os favoritos do usuário novamente após a atualização da página
  useEffect(() => {
    if (user) {
      getFav(user.uid);
    }
  }, [user]);

  return (
    <div>
      <Header user={user} />
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
                        <p id="movieTitle" className="Title">
                          {movie.title}
                        </p>
                        <p id="movieDirector" className="Director">
                          {movie.director}
                        </p>
                        <p id="movieTagline" className="tagline">
                          {movie.tagline}
                        </p>
                      </div>
                      <div id="description" className="info description">
                        <p>{movie.overview}</p>
                      </div>
                      <div id="duration">
                        <p>
                          <p id="movieRuntime">{movie.runtime}</p> minutos de duração.
                        </p>
                      </div>
                    </ol>
                  </li>
                  <li>
                    <div className="movieActionsBox">
                      <ol className="movieActions">
                        <div>
                          {fav[id] ? (
                            <button className="button heart" onClick={() => removeFavoriteFilm(id)}>
                              <i className="fas fa-heart"></i>
                            </button>
                          ) : (
                            <button className="button heart" onClick={() => addFavoriteFilm(id)}>
                              <i className="far fa-heart"></i>
                            </button>
                          )}
                        </div>
                        <div>
                          <button className="button eyes">
                            <i className="fa-solid fa-eye"></i>
                          </button>
                        </div>
                        <div>
                          <button className="button clock">
                            <i className="fa-solid fa-list-ul"></i>
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
                          <h2>Adicionar à Lista...</h2>
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
      <ToastContainer />
    </div>
  );
};

export default Movie;
