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
            <li onClick={()=>{setMenu("note_taker")}}><Link style={{textDecoration: 'none'}} to='/note_taker'>Note Taker{menu==="note_taker" ? <hr/> : <></>}</Link></li>
            <li onClick={()=>{setMenu("flashcard")}}><Link style={{textDecoration: 'none'}} to='/flashcard'>Flashcard{menu==="flashcard" ? <hr/> : <></>}</Link></li>
            <li onClick={()=>{setMenu("files")}}><Link style={{textDecoration: 'none'}} to='/files'>Files{menu==="files" ? <hr/> : <></>}</Link></li>
        </ul>

        <div className='login'>
            <Link to='/login'><button>Log In</button></Link>
        </div>

    </div>

  )
}
