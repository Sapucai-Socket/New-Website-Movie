import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App'
import Home from './pages/Home/Home'
import Movie from './pages/Movie/Movie'
import Perfil from './pages/Perfil/Perfil'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import '../node_modules/font-awesome/css/font-awesome.min.css'; 

import './pages/Perfil/Perfil'
import './pages/Home/Home.css'
import './pages/Login/Login.css'
import './pages/Register/Register.css'
import './components/Footer/Footer.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter >
      <Routes>
        <Route element={<App />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/movie/:id' element={<Movie />} />
          <Route path='/perfil' element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)