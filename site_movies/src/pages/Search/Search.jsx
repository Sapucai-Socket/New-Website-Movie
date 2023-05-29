import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard";

const searchURL = import.meta.env.VITE_SEARCH;
const apiKey = import.meta.env.VITE_API_KEY;


import "../Search/Search.css"

const Search = () => {
    const [searchParams] = useSearchParams();

    const [movies, setMovies] = useState([]);
    const query = searchParams.get("q");

    const getSearchedMovies = async (url) => {
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data.results);
    };

    useEffect(() => {
        const searchWithQueryURL = `${searchURL}?${apiKey}&query=${query}&language=pt-BR`;
        getSearchedMovies(searchWithQueryURL);
    }, [query]);

    return (
        <div className="container-search">
             <h2 className="title-search"> Mostrando resultados para &nbsp;<span className="query-text">{query}</span></h2>
            <div className="movies-container-search">
                {movies.length === 0 && <p>Carregando...</p>}
                {movies.length > 0 && 
                    movies.map((movie) =>  <MovieCard key={movie.id} movie={movie} type={0} carussel={1} />)}
            </div>

        </div>
    )

};

export default Search; 