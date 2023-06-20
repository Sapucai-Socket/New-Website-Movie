import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth"

import './Header.css'

function Header({ user_old }) {
    const [search, setSearch] = useState("")
    const [user, setUser] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
          }
        });
    
        return () => {
          unsubscribe();
        };
      }, []);
    

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!search) return;

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
                                <li id="dropdownOption"><a href="/terror" id="dropdownOptionA">Terror</a></li>
                                <li id="dropdownOption"><a href="/acao" id="dropdownOptionA">Ação</a></li>
                                <li id="dropdownOption"><a href="/animacao" id="dropdownOptionA">Animação</a></li>
                                <li id="dropdownOption"><a href="/ficcao" id="dropdownOptionA">Ficção</a></li>
                                <li id="dropdownOption"><a href="/guerra" id="dropdownOptionA">Guerra</a></li>
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
                                        src={user.photoURL ? user.photoURL : "/iconepadrao.png"}
                                        referrerPolicy="no-referrer"
                                        alt={user.displayName}
                                        id={user.photoURL ? "userIconCadastrado" : "userNaoCadastrado"}
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