import React from 'react'
import {Route, BrowserRouter, Routes, Navigate} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import MailList from "./mail/MailList";


export default function App() {
    const isAuthenticated = localStorage.getItem('token')
    if (isAuthenticated) {
        return(
            <BrowserRouter>
                <Routes>
                    <Route exact path={'/mail/list'} element={<MailList />} />
                    <Route exact path={'/mail/detail/:id'} element={<h1>Mail detail page</h1>} />
                    <Route exact path={'/mail/create'} element={<h1>Mail create page</h1>} />
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
