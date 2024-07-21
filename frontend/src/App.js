import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from './Component/Navbar/Navbar';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import DeckPage from './Pages/DeckPage';
import Transcript from './Pages/Transcript';
import Landing from './Pages/Landing';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/deckpage' element={<DeckPage/>}/>
        <Route path='/transcript' element={<Transcript/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
