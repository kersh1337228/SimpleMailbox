import React from 'react'
import {Route, BrowserRouter, Routes} from 'react-router-dom'
import Login from './auth/Login'


export default function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<h1>Main page</h1>} />
                <Route path={'/login'} element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}
