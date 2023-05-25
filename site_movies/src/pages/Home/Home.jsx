import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imageUrl = import.meta.env.VITE_IMG;

const Slideshow = ({ topMovies }) => {
    const [slideIndex, setSlideIndex] = useState(0);

    const goToPreviousSlide = () => {
        setSlideIndex((prevIndex) => (prevIndex - 1 + topMovies.length) % topMovies.length);
    };

    const goToNextSlide = () => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % topMovies.length);
    };

    useEffect(() => {
        const interval = setInterval(goToNextSlide, 5000); // Definir tempo do carousel

        return () => {
            clearInterval(interval);
        };
    }, [topMovies]);

    return (
        <div className="slideshow-container">
            {topMovies.length > 0 &&
                topMovies.map((movie, index) => (
                    <div
                        key={movie.id}
                        className={`carousel ${index === slideIndex ? "active" : ""}`}
                        style={{
                            display: index === slideIndex ? "block" : "none",
                            position: "relative",
                        }}
                    >
                        <div className="numbertext">
                            {index + 1} / {topMovies.length}
                        </div>
                        <img
                            src={imageUrl + movie.backdrop_path}
                            style={{
                                width: "100%",
                                filter: index === slideIndex ? "brightness(50%)" : "none",
                            }}
                            alt="Movie Backdrop"
                        />
                        <div id="descriptionSlide">
                            <p>{movie.overview}</p>
                            <MovieCard key={movie.id} movie={movie} type={0} carussel={0} />
                        </div>
                    </div>
                ))}
            <div className="arrow-wrapper">
                <div className="arrow left" onClick={goToPreviousSlide}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </div>
                <div className="arrow right" onClick={goToNextSlide}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const [topMovies, setTopMovies] = useState([]);
    const [authUser, setAuthUser] = useState(null);

    const getTopRatedMovies = async (url) => {
        const res = await fetch(url);
        const data = await res.json();
        setTopMovies(data.results);
    };

    useEffect(() => {
        const topRatedUrl = `${moviesURL}popular?${apiKey}&language=pt-BR`;
        getTopRatedMovies(topRatedUrl);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                toast.success("Desconectado com sucesso!");
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="container">
            <ToastContainer />
            <Header user={authUser} />
            <Slideshow topMovies={topMovies} />
            <div className="welcomeUser" style={{ textAlign: "center" }}>
                {authUser ? (
                    <>
                        <div style={{ textAlign: "center" }}>
                            <h1>
                                Bem-Vindo! <a href="">{authUser.displayName}</a>. Aqui está o que temos assistido...
                            </h1>
                            <h4>Nome: {authUser.displayName}</h4>
                            <p>{`Conectado como ${authUser.email}`}</p>
                            <button onClick={userSignOut}>Desconectar</button>
                        </div>
                    </>
                ) : (
                    <p id="signedOut">Desconectado</p>
                )}
            </div>
            <div className="wrapper-content">
                <div className="lista">
                    <div className="title">
                        <h2>Populares na Ciné</h2>
                        <a href="#">Ver Lista</a>
                    </div>
                    <hr />
                    <div className="movie-container">
                        {topMovies.length > 0 &&
                            topMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} type={0} carussel={1} />
                            ))}
                    </div>
                    <br></br><br></br>
                </div>
            </div>
        </div>
    );
};

export default Home;
