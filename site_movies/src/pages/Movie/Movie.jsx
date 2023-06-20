import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import MovieCard from "../../components/MovieCard/MovieCard";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import Header from "../../components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import dayjs from "dayjs";

import "./Movie.css";

const imageUrl = import.meta.env.VITE_IMG;
const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [fav, setFav] = useState({});
  const [review, setReview] = useState({});
  const [user, setUser] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

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

  const reviewFilm = async (id) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const updatedReview = { ...review };
    updatedReview[id] = imageUrl + movie.poster_path;

    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { review: updatedReview }, { merge: true });
    toast.success("Filme adicionado aos favoritos");
    setIsOpen(true);
    setReview(updatedReview);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const updateFavoriteFilm = (id) => {
    if (fav.hasOwnProperty(id)) {
      removeFavoriteFilm(id);
    } else {
      addFavoriteFilm(id);
    }
  };

  const getStarRating = () => {
    const rating = Math.round(movie.vote_average / 2);
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

  const getMovie = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    setMovie(data);
  };

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
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
              <img
                id="movieBackground"
                src={imageUrl + movie.backdrop_path}
                alt={movie.title}
              />
              <div className="backgroundMovieShadow"></div>
              <div id="infoPanel" className="infoPanel">
                <ol id="infoList">
                  <li>
                    <img
                      id="movieImg"
                      src={imageUrl + movie.poster_path}
                      alt={movie.title}
                    />
                  </li>
                  <li>
                    <ol>
                      <div className="headMovie">
                        <p id="movieTitle" className="Title">
                          {movie.title}
                        </p>

                        <div className="movie-cardInfo">
                          <p id="star">
                            {getStarRating()} {movie.vote_average}
                          </p>
                        </div>
                        <p id="movieTagline" className="tagline">
                          {movie.tagline}
                        </p>
                      </div>

                      <div id="description" className="info description">
                        <p>{movie.overview}</p>
                      </div>
                      <div id="duration">
                        <p>
                          <p id="movieRuntime">{movie.runtime}</p> minutos de
                          duração.
                        </p>
                      </div>
                      <div className="infoNewApi">
                        {movie.status && (
                          <div className="infoItem">
                            <span className="text bold">Status: </span>
                            <span className="text">{movie.status}</span>
                          </div>
                        )}
                        {movie.release_date && (
                          <div className="infoItem">
                            <span className="text bold">
                              Data de Lançamento:{" "}
                            </span>
                            <span className="text">
                              {dayjs(movie.release_date).format("D MMM, YYYY")}
                            </span>
                          </div>
                        )}
                        {movie.runtime && (
                          <div className="infoItem">
                            <span className="text bold">Duração: </span>
                            <span className="text">
                              {toHoursAndMinutes(movie.runtime)}
                            </span>
                          </div>
                        )}

                        {movie?.created_by?.length > 0 && (
                          <div className="info">
                            <span className="text bold">
                              Creator:{" "}
                            </span>
                            <span className="text">
                              {movie?.created_by?.map(
                                (d, i) => (
                                  <span key={i}>
                                    {d.name}
                                    {movie?.created_by?.length - 1 !== i && ", "}
                                  </span>
                                )
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </ol>
                  </li>
                  <li>
                    <div className="movieActionsBox">
                      <ol className="movieActions">
                        <div>
                          {fav[id] ? (
                            <button
                              className="button heart"
                              onClick={() => removeFavoriteFilm(id)}
                            >
                              <i className="fas fa-heart"></i>
                            </button>
                          ) : (
                            <button
                              className="button heart"
                              onClick={() => addFavoriteFilm(id)}
                            >
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
                        <button onClick={() => reviewFilm(id)}>
                          <h2>Review</h2>
                        </button>
                        <Modal
                          isOpen={modalIsOpen}
                          onRequestClose={closeModal}
                          contentLabel="Example Modal"
                          overlayClassName="modal-overlay"
                          className="modal-content"
                        >
                          <h2>{movie.title}</h2>
                          <hr />
                          <p>
                            Aqui você pode escrever sua review para o filme
                            selecionado.
                          </p>
                          <button onClick={closeModal}>Fechar</button>
                        </Modal>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
              <ToastContainer />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Movie;
