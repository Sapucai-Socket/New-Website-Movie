import React, { useState, useEffect } from "react";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";


const Perfil = () => {
    const [authUser, setAuthUser] = useState(null);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const navigate = useNavigate();

    const getNomeUsuario = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const name = docSnap.data().nome;
        setNome(name)
        /*
                if (docSnap.exists()) {
                    console.log("Nome de usuário:", docSnap.data().nome);
                } else {
                  
                    console.log("No such document!");
                }
                */
    }

    const getDescricao = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const descricao = docSnap.data().descricao;
        setDescricao(descricao)
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setAuthUser(uid);
                getNomeUsuario(uid);
                getDescricao(uid);
            } else {
                navigate('/login');
            }
        });
    });





    return (
        <div>
            <div className="profileContainer">
                <div className="pfpImage">
                    <img
                        id="pfp"
                        src="https://pbs.twimg.com/profile_images/836420807085674497/fjDNEUsp_400x400.jpg"
                    />
                </div>
                <div>
                    <h1 id="nomeUsuario">{nome}</h1>
                    <i id="descUsuario">{descricao}</i>
                </div>
            </div>
            <div className="otherUserInfos">
                <div className="otherUserInfo">
                    <span className="quantity">4</span>
                    <br />
                    <span className="parameter">FILMES</span>
                </div>
                <div className="vertical-line"></div>

                <div className="otherUserInfo">
                    <span className="quantity">23</span>
                    <br />
                    <span className="parameter">ESTE ANO</span>
                </div>
                <div className="vertical-line"></div>

                <div className="otherUserInfo">
                    <span className="quantity">3</span>
                    <br />
                    <span className="parameter">LISTAS</span>
                </div>
                <div className="vertical-line"></div>
                <div className="otherUserInfo">
                    <span className="quantity">1</span>
                    <br />
                    <span className="parameter">SEGUINDO</span>
                </div>
                <div className="vertical-line"></div>

                <div className="otherUserInfo">
                    <span className="quantity">4</span>
                    <br />
                    <span className="parameter">SEGUIDORES</span>
                </div>
            </div>
            <div id="favoritos">
                <h2 id="favoritos-cabecalho">FILMES FAVORITOS</h2>

                <div className="posterUserFavorites">
                    <div className="flex-child">
                        <a href="#">
                            <img
                                className="filme-favorito"
                                src="https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
                            />
                        </a>
                    </div>

                    <div className="flex-child">
                        <a href="#">
                            <img
                                className="filme-favorito"
                                src="https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
                            />
                        </a>
                    </div>
                    <div className="flex-child">
                        <a href="#">
                            <img
                                className="filme-favorito"
                                src="https://image.tmdb.org/t/p/original/gmU7P3FzGFsl2wiSDhx9znZCNub.jpg"
                            />
                        </a>
                    </div>
                </div>
            </div>
            <div id="secao-filmes-avaliados">
                <h2 id="avaliacoes-cabecalho">REVIEWS</h2>

                <div id="filme-poster-avaliado">
                    <a href="#">
                        <img
                            className="filme-avaliado"
                            src="https://image.tmdb.org/t/p/original/MbP1pIUKQcZaC1XCwSomuiLrva.jpg"
                        />
                    </a>
                </div>
                <div id="infos-avaliacao">
                    <span id="titulo-filme-avaliado">Bullet Train</span>
                    <span id="ano-filme-avaliado">2022</span>
                    <br />
                    <span id="estrelas-filme-avaliado">★★</span>
                    <br />
                    <span id="review-filme-avaliado">
                        Filme bem divertido, ótimas cenas de ação. O filme fica meio chatinho
                        em algumas partes, mas é legal de forma geral.
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Perfil;