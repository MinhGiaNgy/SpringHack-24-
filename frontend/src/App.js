import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import DeckPage from './Pages/DeckPage';
import Transcript from './Pages/Transcript';
import Landing from './Pages/Landing';
import Navbar1 from './Component/Navbar1/NavBar'

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
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
