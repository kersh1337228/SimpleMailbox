import React from 'react'
import Navbar from './Navbar'
import Account from '../auth/Account'
import './Header.css'


// Header component containing navigation bar and fancy background
export default function Header() {
    if (localStorage.getItem('token')) { // Authorized user pages list
        const tabs = [
            {
                name: 'Home',
                link: '/',
            },
            {
                name: 'Mail',
                link: '/mail/list',
            },
        ]
        return(
            <header>
                <Navbar tabs={tabs}>
                    <Account />
                </Navbar>
            </header>
        )
    } else {  // Unauthorized user pages list
        const tabs = [
            {
                name: 'Home',
                link: '/',
            },
            {
                name: 'Sign in',
                link: '/login',
            },
            {
                name: 'Sign up',
                link: '/register',
            },
        ]
        return (
            <header>
                <Navbar tabs={tabs} />
            </header>
        )
    }
}
