import React, { useState, useEffect } from "react";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Perfil = () => {
  const [authUser, setAuthUser] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fav, setFav] = useState({});
  const [favLoaded, setFavLoaded] = useState(false); // Estado para rastrear se os dados dos filmes favoritos foram buscados
  const navigate = useNavigate();

  const getNomeUsuario = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const name = docSnap.data().nome_usr;
    setNome(name);
  };

  const getDescricao = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const descricao = docSnap.data().descricao;
    setDescricao(descricao);
  };

  const getFav = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const favData = docSnap.data().fav;
    setFav(favData);
    setFavLoaded(true); // Indicar que os dados dos filmes favoritos foram buscados
  };

  const updateFav = async (updatedFav) => {
    const docRef = doc(db, "users", authUser.uid);
    await setDoc(docRef, { fav: updatedFav });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setAuthUser(user);
        getNomeUsuario(uid);
        getDescricao(uid);

        if (!favLoaded) {
          // Buscar os filmes favoritos somente se ainda não foram buscados
          getFav(uid);
        }

        // Atualiza o filme favorito no banco de dados
        const unsubscribeFav = onSnapshot(doc(db, "users", uid), (doc) => {
          const favData = doc.data().fav;
          setFav(favData);
        });

        return () => {
          unsubscribeFav(); // Desfavorita os filmes
        };
      } else {
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [authUser, favLoaded]); // Trigger useEffect whenever authUser state or favLoaded state changes

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
          <h1 id="nomeUsuario">
            {!authUser?.displayName ? nome : authUser.displayName}
          </h1>
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
          <Carousel
            showThumbs={false}
            showArrows={true}
            showStatus={false}
            emulateTouch={true}
            infiniteLoop={fav.length > 5}
            swipeScrollTolerance={5}
            showIndicators={false}
            dynamicHeight={false}
            centerMode={true}
            centerSlidePercentage={20}
          >
            {Object.entries(fav)
              .map(([key, url]) => (
                <div
                  className="flex-child"
                  key={key}
                  onClick={() => navigate(`/movie/${key}`)}
                >
                  <Link to={`/movie/${key}`}>
                    <img src={url} alt="Imagem Favorita" className="filme-favorito" />
                  </Link>
                </div>
              ))}
          </Carousel>
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
            Filme bem divertido, ótimas cenas de ação. O filme fica meio
            chatinho em algumas partes, mas é legal de forma geral.
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Perfil;
