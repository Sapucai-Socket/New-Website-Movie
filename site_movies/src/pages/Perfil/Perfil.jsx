import React, { useState, useEffect } from "react";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAdditionalUserInfo} from "firebase/auth";
import { Link } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Rating from "react-rating-stars-component";

const Perfil = () => {
  const [authUser, setAuthUser] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fav, setFav] = useState({});
  const [review, setReview] = useState({});
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

  const getReview = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    const review = docSnap.data().review;
    setReview(review);
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
          getReview(uid)
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
      <ol className="userSection">
        <li>
          <div className="profileContainer">
            <div className="pfpImage">
              {authUser?.photoURL ? (
                <img id="pfp" src={authUser.photoURL} alt="Perfil" />
              ) : (
                <img src="/iconepadrao.png" alt="png" id="userPadrao" />
              )}
            </div>
            <img src="icone-sair.png" className="svg-log-out" onClick={handleLogout}></img>
            <div>
              <h1 id="nomeUsuario">
                {!authUser?.displayName ? nome : authUser.displayName}
              </h1>
              <i id="descUsuario">{descricao}</i>
            </div>
          </div>
        </li>
        <li>
          <div className="userStat">
            <ol className="userStatOl">
              <li><span className="quantity">{Object.keys(fav).length}</span></li>
              <li><span className="parameter">Filmes Registrados</span></li>
            </ol>
          </div>
        </li>
      </ol>

      <div className="userFavourites">
        <div className="userFavouritesData">
          <h2 id="favoritos-cabecalho">FILMES FAVORITOS</h2>

          <div className="posterUserFavourites">
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
      </div>

      <div id="secao-filmes-avaliados">
        <h2 id="avaliacoes-cabecalho">REVIEWS</h2>
        {Object.entries(review).map(([id, { review, imageUrl, title, year, rating }]) => (
          <div key={id} className="profileReview">
            <ol className="profileReviewOl">
              <li>
                <div className="posterReview">
                  <a href={`/movie/${id}`}>
                    <img
                      className="filme-avaliado"
                      src={imageUrl}
                      alt="Filme Avaliado"
                    />
                  </a>
                </div>
              </li>
              
              <li>
                <div id="infos-avaliacao">
                  <span id="titulo-filme-avaliado">{title}</span>
                  <span id="ano-filme-avaliado">{year}</span>
                  <br />
                  <div className="reviewRating">
                    <Rating
                      value={rating}
                      edit={false}
                      size={20}
                      activeColor="#ffd700"
                      emptyIcon={<i className="far fa-star"></i>}
                      filledIcon={<i className="fas fa-star"></i>}
                    />                    
                  </div>
                  <br />
                  <span id="review-filme-avaliado">
                    {review}
                  </span>
                </div>                
              </li>

            </ol>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Perfil;
