import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./NavBar.css"

export default function Navbar() {
    const [menu, setMenu] = useState("home");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    }

  return (
    <div className='navbar'>
        <div className='nav-name'>
            <p>LectureFlashMaster</p>
        </div>

        <ul className='nav-menu'>
            <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration: 'none'}} to='/'>Home{menu==="home" ? <hr/> : <></>}</Link></li>
            <li onClick={()=>{setMenu("flashcard")}}><Link style={{textDecoration: 'none'}} to='/deckpage'>Cards{menu==="flashcard" ? <hr/> : <></>}</Link></li>
            <li onClick={()=>{setMenu("deck")}}><Link style={{textDecoration: 'none'}} to='/deck'>Decks{menu==="deck" ? <hr/> : <></>}</Link></li>
            <li onClick={()=>{setMenu("transcript")}}><Link style={{textDecoration: 'none'}} to='/transcript'>Transcripts{menu==="transcript" ? <hr/> : <></>}</Link></li>
        </ul>

        <div className='login'>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <Link to='/login'><button>Log In</button></Link>
        )}
      </div>

    </div>

  )
}
