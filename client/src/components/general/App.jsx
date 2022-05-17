import React from 'react'
import {Route, BrowserRouter, Routes, Navigate} from 'react-router-dom'
import Login from '../auth/Login'
import Register from '../auth/Register'
import MailList from '../mail/MailList'
import Header from './Header'
import Home from './Home'
import './App.css'


export default function App() {
    if (localStorage.getItem('token')) {
        return(
            <BrowserRouter>
                <Header />
                <div id={'content_wrapper'}>
                    <div id={'content'}>
                        <Routes>
                            <Route exact path={'/'} element={<Home />} />
                            <Route exact path={'/mail/list'} element={<MailList />} />
                            <Route path={'*'} element={<Navigate to={'/mail/list'} />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        )
    } else {
        return(
            <BrowserRouter>
                <Header />
                <div id={'content_wrapper'}>
                    <div id={'content'}>
                        <Routes>
                            <Route exact path={'/'} element={<Home />} />
                            <Route exact path={'/login'} element={<Login />} />
                            <Route exact path={'/register'} element={<Register />} />
                            <Route path={'*'} element={<Navigate to={'/'} />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
