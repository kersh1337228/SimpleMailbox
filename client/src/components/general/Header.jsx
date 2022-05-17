import React from 'react'
import Navbar from './Navbar'
import Account from '../auth/Account'
import './Header.css'


export default function Header() {
    if (localStorage.getItem('token')) {
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
    } else {
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
