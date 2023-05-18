import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'


import { useLocation } from 'react-router-dom';

import './App.css'

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Header />
      <Outlet />
    </div>
  );
}

export default App
