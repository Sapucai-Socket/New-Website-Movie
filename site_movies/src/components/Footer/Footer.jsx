import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="footer-col">
            <h4>Sobre</h4>
            <ul>
              <li>
                <a href="#">Nossos serviços</a>
              </li>
              <li>
                <a href="#">Nossas políticas</a>
              </li>
              <li>
                <a href="#">Seja um Crítico Verificado</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Ajuda</h4>
            <ul>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li>
                <a href="https://github.com/Sapucai-Socket">Equipe de devs</a>
              </li>
              <li>
                <a href="https://github.com/Sapucai-Socket">Equipe ADM</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Nossas redes</h4>
            <div className="social-links">

              <a href="https://github.com/Sapucai-Socket">
                <i className="fab fa-github" />
              </a>

            </div>
          </div>
        </div>
        <li className="devBy">
          <h5>Desenvolvido por:</h5>
          <img src="images/Sapucaí_Logo.png" alt="" href="" />
        </li>
        <h4 className="copy">
          © Ciné. Feito por uma equipe de estudantes. Informações sobre os filmes
          providenciadas pela TMDB.
        </h4>
      </div>
    </footer>
  );
}

export default Footer;
