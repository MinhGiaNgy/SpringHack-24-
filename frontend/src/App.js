import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from './Component/Navbar/NavBar';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import DeckPage from './Pages/DeckPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/deckpage' element={<DeckPage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
