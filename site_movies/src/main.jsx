import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App'
import Home from './pages/Home/Home'
import Movie from './pages/Movie/Movie'
import Search from './pages/Search/Search'
import Perfil from './pages/Perfil/Perfil'
import Terror from './pages/Generos/Terror'
import Acao from './pages/Generos/Acao'
import Animacao from './pages/Generos/Animacao'
import Guerra from './pages/Generos/Guerra'
import Ficcao from './pages/Generos/Ficcao'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import NotFound from './pages/NotFound/NotFound'
import '../node_modules/font-awesome/css/font-awesome.min.css';

import './pages/Perfil/Perfil'
import './pages/Home/Home.css'
import './pages/Login/Login.css'
import './pages/Register/Register.css'
import './pages/NotFound/NotFound.css'
import './components/Footer/Footer.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter >
      <Routes>
        <Route element={<App />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/terror' element={<Terror />} />
          <Route path='/acao' element={<Acao />} />
          <Route path='/animacao' element={<Animacao />} />
          <Route path='/guerra' element={<Guerra />} />
          <Route path='/ficcao' element={<Ficcao />} />
          <Route path='/movie/:id' element={<Movie />} />
          <Route path="search" element={<Search />} />
          <Route path='/perfil' element={<Perfil />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)