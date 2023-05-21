import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Header from "../../components/Header/Header";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imageUrl = import.meta.env.VITE_IMG;

const Slideshow = ({ topMovies }) => {
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % topMovies.length);
        }, 5000);

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
                         <div id="description" className="info descriptionsSlider">
                            <p>{movie.overview}</p>
                        </div>
                        <MovieCard key={movie.id} movie={movie} type={0} />
                    </div>
                ))}
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
                alert("Signed out successfully!");
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="container">
            <Header user={authUser} />
            <Slideshow topMovies={topMovies} />
            <div className="welcomeUser" style={{ textAlign: "center" }}>
                {authUser ? (
                    <>
                        <div style={{ textAlign: "center" }}>
                            <h1>
                                Bem-Vindo! <a href="">{authUser.displayName}</a>. Aqui está o que temos assistido...
                            </h1>
                            <h4>Name: {authUser.displayName}</h4>
                            <p>{`Signed In as ${authUser.email}`}</p>
                            <button onClick={userSignOut}>Sign Out</button>
                        </div>
                    </>
                ) : (
                    <p id="signedOut">Signed Out</p>
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
                                <MovieCard key={movie.id} movie={movie} type={0} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
