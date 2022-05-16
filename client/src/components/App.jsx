import React from 'react'
import {Route, BrowserRouter, Routes, Navigate} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import Account from './auth/Account'
import MailList from './mail/MailList'
import './App.css'


export default function App() {
    if (localStorage.getItem('token')) {
        return(
            <BrowserRouter>
                <Account />
                <Routes>
                    <Route exact path={'/mail/list'} element={<MailList />} />
                    <Route path={'*'} element={<Navigate to={'/mail/list'} />} />
                </Routes>
            </BrowserRouter>
        )
    } else {
        return(
            <BrowserRouter>
                <Routes>
                    <Route exact path={'/'} element={<h1>Main page</h1>} />
                    <Route exact path={'/login'} element={<Login />} />
                    <Route exact path={'/register'} element={<Register />} />
                    <Route path={'*'} element={<Navigate to={'/'} />} />
                </Routes>
            </BrowserRouter>
        )
    }
}
