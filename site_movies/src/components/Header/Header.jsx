import React from "react";
import './Header.css'

function Header(){
    return(
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
      <li>
        <a href="#">Filmes</a>
      </li>
      <li>
        <a href="#">Séries</a>
      </li>
      <li>
        <a href="#">Reviews</a>
      </li>
      <li>
        <a href="/login" id="loginIconPadding">
          <img src="/public/loginIcon.svg" alt="svg" id="loginIcon" />
        </a>
      </li>
    </ol>
    <label htmlFor="check" className="bar">
      <span className="fa fa-bars" id="bars" />
      <span className="fa fa-times" id="times" />
    </label>
  </nav>
</div>

    )
}

export default Header;