import React from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'


// Navigation bar used in Header component
const Navbar = (props) => {
    return(
        <nav><ul>
            {props.tabs.map(tab => <li key={tab.name}>
                <NavLink className={'nav_link'} to={tab.link}>{tab.name}</NavLink>
            </li>)}
        </ul>
            {props.children}
        </nav>
    )
}


export default Navbar
