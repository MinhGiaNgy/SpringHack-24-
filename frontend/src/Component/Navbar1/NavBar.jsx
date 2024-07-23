import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import "./NavBar.css"

export default function Navbar() {
    const [menu, setMenu] = useState("home");

  return (
    <div className='navbar'>
        <div className='nav-name'>
            <p>LectureFlashMaster</p>
        </div>

        <ul className='nav-menu'>
            <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration: 'none'}} to='/'>Home{menu==="home" ? <hr/> : <></>}</Link></li>
            <li onClick={()=>{setMenu("flashcard")}}><Link style={{textDecoration: 'none'}} to='/deckpage'>Flashcard{menu==="flashcard" ? <hr/> : <></>}</Link></li>
            <li onClick={()=>{setMenu("transcript")}}><Link style={{textDecoration: 'none'}} to='/transcript'>Files{menu==="transcript" ? <hr/> : <></>}</Link></li>
        </ul>

        <div className='login'>
            <Link to='/login'><button>Log In</button></Link>
        </div>

    </div>

  )
}
