import React, { useState, useEffect } from "react";
import "./Perfil.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAdditionalUserInfo } from "firebase/auth";
import { Link } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Rating from "react-rating-stars-component";

const Perfil = () => {
  //const [authUser, setAuthUser] = useState(null);
  const [fav, setFav] = useState({});
  const [review, setReview] = useState({});
  const [favLoaded, setFavLoaded] = useState(false); // Estado para rastrear se os dados dos filmes favoritos foram buscados
  const [favsQuantity, setFavsQuantity] = useState(null);
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoDePerfil, setFotoDePerfil] = useState('');

  const getUser = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    const currentUser = {
      name: userSnap.data().nome_usr,
      bio: userSnap.data().descricao,
      photo: userSnap.data().foto,
      favorites: userSnap.data().fav,
      reviews: userSnap.data().review
    }

    setNome(currentUser.name)
    setDescricao(currentUser.bio)
    setFav(currentUser.favorites)
    setFotoDePerfil(currentUser.photo)
    setFavLoaded(true)
    setFavsQuantity(Object.keys(currentUser.favorites).length);
    setReview(currentUser.reviews);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUser(user.uid); // Get user
      } else {
        navigate("/login");
      }
    });
    console.log('oi')
  },[favLoaded]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="wrapperProfile">
      <ol className="userSection">
        <li>
          <div className="profileContainer">
            <div className="pfpImage">
                <img id="pfp" src={fotoDePerfil} alt="Perfil" />
            </div>
            <img src="icone-sair.png" className="svg-log-out" onClick={handleLogout}></img>
            <div>
              <h1 id="nomeUsuario">
                {nome}
              </h1>
              <i id="descUsuario">{descricao}</i>
            </div>
          </div>
        </li>
        <li>
          <div className="userStat">
            <ol className="userStatOl">
              <li><span className="quantity">{favsQuantity}</span></li>
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
