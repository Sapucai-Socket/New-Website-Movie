import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import MovieCard from "../../components/MovieCard/MovieCard";
import { auth, db } from "../../firebase";
import { getAdditionalUserInfo, onAuthStateChanged, signInWithPopup, signOut, } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayRemove, } from "firebase/firestore";
import StarRatings from 'react-star-ratings';
import Header from "../../components/Header/Header";
import { MdPlayArrow } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import dayjs from "dayjs";
import "./Movie.css";

const imageUrl = import.meta.env.VITE_IMG;
const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const youtubeBaseUrl = "https://www.youtube.com/watch?v=";

const Movie = () => {
  const { id } = useParams();
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [fav, setFav] = useState({});
  const [review, setReview] = useState({});
  const [user, setUser] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [valorInputReview, setValorInputReview] = useState("");
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [valueStarRating, setValueStarRating] = useState(0);
  const [reviews, setReviews] = useState({});

  const handleStarRatingChange = (newRating) => {
    setValueStarRating(newRating);
  };

  useEffect(() => {
    // ...

    const getUserReviews = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        if (userData && userData.review) {
          setReviews(userData.review);
        }
      }
    };

    getUserReviews();

    // ...
  }, []);
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
    setIsOpen(true);
    setReview(updatedReview);
  };

  function closeModal() {
    setIsOpen(false);
  }
  const handleChange = (event) => {
    setValorInputReview(event.target.value);
  };

  const enviarReview = () => {
    if (valorInputReview.trim() !== "") {
      const updatedEnviarReview = {
        ...review,
        [id]: {
          title: movie.title,
          imageUrl: imageUrl + movie.poster_path,
          review: valorInputReview,
          rating: valueStarRating,
          year: movie.release_date.split("-")[0]
        }
      };

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, { review: updatedEnviarReview }, { merge: true });
      toast.success("Review enviado com sucesso!");
      setIsOpen(false);
      setFav(updatedEnviarReview);
    } else {
      const updatedEnviarReview = {};

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, { review: updatedEnviarReview }, { merge: true });
      toast.error("Não é possivel enviar o seu review, pois o campo está vazio!");
      setIsOpen(true);
      setFav(updatedEnviarReview);
    }
  };
  const updateFavoriteFilm = async (id, imageUrl, poster_path) => {
    // Se o filme não estiver favoritado
    if (!fav.hasOwnProperty(id)) {
      // Adicionar aos favoritos
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        {
          fav: {
            [id]: {
              imageUrl: imageUrl,
              poster_path: poster_path,
            },
          },
        },
        { merge: true }
      );
      toast.success("Filme adicionado aos favoritos");
    } else {
      // O que você deseja fazer quando o filme já estiver favoritado?
      const updatedFav = { ...fav };
      delete updatedFav[id];
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        {
          fav: updatedFav,
        },
        { merge: true }
      );
      toast.success("Filme removido dos favoritos");
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
    const fav = docSnap.data().fav;
    //const favJson = JSON.stringify(fav, null, 3);
    //alert(`${fav["3213123"]}`);
    setFav(fav);

    ///TODO: acessar o fav[id] e, caso exista, mudar o coração para preenchido, senão mantem o coração sem preenchimento
  };

  useEffect(() => {
    if (user) {
      getFav(user.uid);
    }
  }, [user]);

  const playTrailer = async () => {
    const trailerUrl = `${moviesURL}${id}/videos?${apiKey}&language=pt-BR`;
    const res = await fetch(trailerUrl);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const trailerKey = data.results[0].key;
      const trailerUrl = youtubeBaseUrl + trailerKey;
      window.open(trailerUrl, "_blank");
    } else {
      toast.error("Trailer não disponível");
    }
  };

  return (
    <div>
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

                        <div className="row">
                          <div className="playbtn" onClick={playTrailer}>
                            <MdPlayArrow
                              size={36}
                              color="557373"
                              className="play-icon"
                            />
                            <span className="text"> Assista o trailer</span>
                          </div>
                        </div>

                        <p id="movieTagline" className="tagline">
                          {movie.tagline}
                        </p>
                      </div>

                      <div id="description" className="info description">
                        <p>{movie.overview}</p>
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
                            <span className="text bold">Creator: </span>
                            <span className="text">
                              {movie?.created_by?.map((d, i) => (
                                <span key={i}>
                                  {d.name}
                                  {movie?.created_by?.length - 1 !== i && ", "}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}
                      </div>
                      <div id="user-review">
                        {user && reviews[id] && (
                          <div className="userReview">
                            <img
                              className="userPhoto"
                              src={user.authUser?.photoURL} // Add the photoUrl here
                              alt={reviews[id].displayName}
                            />
                            <div className="userInfo">
                              <p className="userName">{user.displayName}</p>
                              <p className="userRating">
                                <StarRatings
                                  rating={reviews[id].rating}
                                  starRatedColor="#ecab3c"
                                  numberOfStars={5}
                                  starDimension="20px"
                                  starSpacing="2px"
                                />
                              </p>
                              <p className="userComment">{reviews[id].review}</p>
                            </div>
                          </div>
                        )}
                      </div>

                    </ol>
                  </li>
                  <li>
                    <div className="movieActionsBox">
                      <ol className="movieActions">
                        <div>
                          {fav.hasOwnProperty(id) ? (
                            <button
                              className="button heart"
                              onClick={() => removeFavoriteFilm(id)}
                            >
                              <i className="fas fa-heart"></i>
                            </button>
                          ) : (
                            <button
                              className="button heart"
                              onClick={() =>
                                addFavoriteFilm(id, imageUrl, movie.poster_path)
                              }
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
                          <ol className="modalList">
                            <li>
                              <img
                                id="movieModalPoster"
                                src={imageUrl + movie.poster_path}
                                alt={movie.title}
                              />
                            </li>
                            <li>
                              <div>
                                <h2>{movie.title}</h2>
                                <hr />
                                <textarea
                                  type="text"
                                  id="inputReview"
                                  value={valorInputReview}
                                  onChange={handleChange}
                                  placeholder="Escreva a sua Review..."
                                />
                                <p>Review:</p>
                                <StarRatings
                                  rating={valueStarRating}
                                  starRatedColor="#ecab3c"
                                  changeRating={handleStarRatingChange}
                                  numberOfStars={5}
                                  starDimension="25px"
                                  starSpacing="2px"
                                />
                                <button onClick={enviarReview} id="sendReview">
                                  Enviar
                                </button>
                                <button onClick={closeModal} id="closeReview">
                                  Fechar
                                </button>
                              </div>
                            </li>
                          </ol>
                        </Modal>
                      </div>
                      <div className="reviewButton">
                        <button>
                          <h2>Adicionar à lista</h2>
                        </button>
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
