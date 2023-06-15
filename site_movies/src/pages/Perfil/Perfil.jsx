import React, { useState, useEffect } from "react";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithPopup, signOut, } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const Perfil = () => {
    const [authUser, setAuthUser] = useState(null);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [fav, setFav] = useState("");
    const navigate = useNavigate();

    const getNomeUsuario = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const name = docSnap.data().nome_usr;
        setNome(name);
        /*
                if (docSnap.exists()) {
                    console.log("Nome de usuário:", docSnap.data().nome);
                } else {
                  
                    console.log("No such document!");
                }
                */
    };

    const getDescricao = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const descricao = docSnap.data().descricao;
        setDescricao(descricao);
    };
    const getFav = async(uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const fav = docSnap.data().fav;
        setFav(fav);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setAuthUser(user);
                getNomeUsuario(uid);
                getDescricao(uid);
                getFav(uid)
            } else {
                navigate("/login");
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
            toast.success("Usuário desconectado");
        } catch (error) {
            console.log("Erro ao fazer logout:", error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
        } catch (error) {
            console.log("Erro ao fazer login com o Google:", error);
        }
    };

    return (
        <div className="wrapperProfile">
            <div className="profileContainer">
                <div className="pfpImage">
                    {authUser?.photoURL ? (
                        <img id="pfp" src={authUser.photoURL} alt="Perfil" />
                    ) : (
                        <img src="/iconepadrao.png" alt="png" id="userPadrao" />
                    )}
                </div>
                <div>
                    <h1 id="nomeUsuario">{!authUser?.displayName ? nome : authUser.displayName}</h1>
                    <i id="descUsuario">{descricao}</i>
                </div>

            </div>

            <div className="otherUserInfos">
                <div className="otherUserInfo">
                    <span className="quantity">{Object.keys(fav).length}</span>
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
            <button onClick={handleLogout}>Sair</button>
            <div id="favoritos">
                <h2 id="favoritos-cabecalho">FILMES FAVORITOS</h2>

                <div className="posterUserFavorites">
                    {Object.entries(fav).map(([key, url]) => (
                    <div className="flex-child" key={key}>
                        <Link to={`/movie/${key}`}>
                        <img
                            src={url}
                            alt="Imagem Favorita"
                            className="filme-favorito"
                        />
                        </Link>
                    </div>
                    ))}
                </div>
                </div>

            <div id="secao-filmes-avaliados">
                <h2 id="avaliacoes-cabecalho">REVIEWS</h2>

                <div id="filme-poster-avaliado">
                    <a href="#">
                        <img
                            className="filme-avaliado"
                            src="https://image.tmdb.org/t/p/original/MbP1pIUKQcZaC1XCwSomuiLrva.jpg"
                            alt="Filme Avaliado"
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
};

export default Perfil;
