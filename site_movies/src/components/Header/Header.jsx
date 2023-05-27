import React from "react";
import './Header.css'


function Header({ user }) {

    return (
        <header>
            <div className="wrapper-header">
                <input type="checkbox" id="check" />
                <nav>
                    <div className="icon">
                        <a href="/">Ciné</a>
                    </div>
                    <form>
                        <div className="box">
                            <input
                                id="pesquisa"
                                placeholder="Busque filmes, séries, reviews ou pessoas..."
                            />
                            <button className="fa fa-search"></button>
                        </div>
                    </form>
                    <ol>
                        <li id="dropdownMenu">
                            <a href="#" id="dropdownFather">Filmes ▾</a>
                            <ul className="dropdown">
                                <li id="dropdownOption"><a href="#" id="dropdownOptionA">Populares</a></li>
                                <li id="dropdownOption"><a href="#" id="dropdownOptionA">Populares</a></li>
                                <li id="dropdownOption"><a href="#" id="dropdownOptionA">Populares</a></li>
                                <li id="dropdownOption"><a href="#" id="dropdownOptionA">Populares</a></li>
                                <li id="dropdownOption"><a href="#" id="dropdownOptionA">Populares</a></li>
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
