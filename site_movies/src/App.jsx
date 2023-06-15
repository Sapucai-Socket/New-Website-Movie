import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import { useLocation } from 'react-router-dom';

import './App.css'

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {(location.pathname !== '/login' && <Header />) && (location.pathname !== '/register' && <Header />)
        && (location.pathname !== '/' && <Header />) && (location.pathname !== '/acao' && <Header />) &&
        (location.pathname !== '/terror' && <Header />) && (location.pathname !== '/animacao' && <Header />)
        && (location.pathname !== '/ficcao' && <Header />) && (location.pathname !== '/guerra' && <Header />)
        && (location.pathname !== '../../Movie' && <Header />)}

      <Outlet />
      <Footer />
    </div>
  );
}

export default App
