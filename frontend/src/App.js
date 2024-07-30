import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import DeckPage from './Pages/DeckPage';
import Transcript from './Pages/Transcript';
import Landing from './Pages/Landing';
import Deck from './Pages/Deck'
import Navbar1 from './Component/Navbar1/NavBar'

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateDeck from './Pages/CreateDeck';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar1/>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/deckpage' element={<DeckPage/>}/>
        <Route path='/transcript' element={<Transcript/>}/>
        <Route path='/createdeck' element={<CreateDeck/>}/>
        <Route path='/deck' element={<Deck/>}/>
        <Route path='/decks/:deckId' element={<DeckPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
