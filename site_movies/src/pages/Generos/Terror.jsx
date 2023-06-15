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
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";


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
        const interval = setInterval(goToNextSlide, 7000); // Carrosel vai passar em 7 segundos

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

const Terror = () => {
    const [topMovies, setTopMovies] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);


    const getTopRatedMovies = async (url) => {
        const res = await fetch(url);
        const data = await res.json();
        const movies = data.results.slice(0, 18); // Limita a exibição de 18 filmes por página
        setTopMovies(movies);
    };


    useEffect(() => {
        const topRatedUrl = `${moviesURL}popular?${apiKey}&with_genres=27&language=pt-BR&page=${currentPage}`;
        getTopRatedMovies(topRatedUrl);
    }, [currentPage]);

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

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            <ToastContainer />
            <Header user={authUser} />
            <div className="welcomeUser" style={{ textAlign: "center" }}>
                {authUser ? (
                    <>
                        <div style={{ textAlign: "center" }}>
                            <h1>
                                Bem-Vindo! <a href="/perfil">{authUser.displayName}</a>. Aqui está o que temos assistido...
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
            <Slideshow topMovies={topMovies} />

            <div className="wrapper-content">
                <section id="populares">
                    <div className="lista">
                        <div className="title">
                            <h2>Populares na Ciné</h2>
                            <a href="#">Ver Lista</a>
                        </div>
                        <hr />
                        <div className="movie-container">
                            {topMovies.length > 0 &&
                                topMovies.map((movie) => <MovieCard key={movie.id} movie={movie} type={0} carussel={1} />)}
                        </div>
                        <br />
                        <br />

                        <Stack spacing={2} direction="row" justifyContent="center">
                            <Pagination
                                count={200} // Coloquei o total de paginas 200, mas se quiser aumentar, à vontade.
                                page={currentPage}
                                onChange={handlePageChange}
                                renderItem={(item) => (
                                    <PaginationItem
                                        component={Link}
                                        to={`/terror?page=${item.page}`} // Ajuste a rota para '/terror?page='
                                        {...item}
                                        sx={{
                                            "&.Mui-selected": {
                                                backgroundColor: "#557373", // Cor da bolinha da pagina atual
                                            },
                                            color: "white", // Cor dos numeros
                                            fontWeight: "bold"
                                        }}
                                    />
                                )}
                            />


                        </Stack>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Terror;
