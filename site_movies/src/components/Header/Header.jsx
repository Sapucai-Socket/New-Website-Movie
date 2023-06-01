import React from "react";
import './Header.css'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"


function Header({ user }) {
    const [search, setSearch] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(!search) return;

        navigate(`/search?q=${search}`)
        setSearch("")
    }

    return (
        <header>
            <div className="wrapper-header">
                <input type="checkbox" id="check" />
                <nav>
                    <div className="icon">
                        <a href="/">Ciné</a>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="box">
                            <input
                                id="pesquisa"
                                placeholder="Busque filmes, séries, reviews ou pessoas..."
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />
                            <button className="fa fa-search"></button>
                        </div>
                    </form>
                    <ol>
                        <li id="dropdownMenu">
                            <a href="#" id="dropdownFather">Filmes ▾</a>
                            <ul className="dropdown">
                                <li id="dropdownOption"><a href="#populares" id="dropdownOptionA">Populares</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">Séries</a>
                        </li>
                        <li>
                            <a href="#">Reviews</a>
                        </li>
                        <li>
                            {user ?
                                <a href="/perfil" className="usuarioIcon">
                                    <img
                                        src={user.photoURL}
                                        referrerPolicy="no-referrer"
                                        alt={user.displayName}
                                        id="userIconCadastrado"
                                        onError={(e) => {
                                            console.log('Error loading image:', e.target.src);
                                        }}
                                    />
                                </a>
                                :
                                <a href="/login" className="usuarioIcon">
                                    <img src="/loginIcon.svg" alt="svg" id="userNaoCadastrado" />
                                </a>
                            }
                        </li>
                    </ol>
                    <label htmlFor="check" className="bar">
                        <span className="fa fa-bars" id="bars" />
                        <span className="fa fa-times" id="times" />
                    </label>
                </nav>
            </div>

        </header>

    )
}

export default Header;
