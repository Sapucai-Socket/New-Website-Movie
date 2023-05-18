import React from 'react';
import { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";


const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
    const [topMovies, setTopMovies] = useState([]);

    const getTopRatedMovies = async (url) => {
        const res = await fetch(url);
        const data = await res.json();
        setTopMovies(data.results);
    };

    useEffect(() => {
        const topRatedUrl = `${moviesURL}popular?${apiKey}&language=pt-BR`;
        getTopRatedMovies(topRatedUrl);
    }, []);

    return (
        <div className="container">
            <div className="wrapper-content">
                <div className="lista">
                    <div className="title">
                        <h2>Populares na Ciné</h2>
                        <a href="#">Ver Lista</a>
                    </div>
                    <div className="movie-container">
                        {topMovies.length === 0 && <p>Carregando...</p>}
                        {topMovies.length > 0 && topMovies.map((movie) => <MovieCard  key={movie.id} movie={movie} />)}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

