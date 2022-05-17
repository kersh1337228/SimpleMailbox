import React from 'react'
import './Home.css'


// Fancy homepage component
export default function Home() {
    document.title = 'Home'
    return(
        <div className={'home_component'}>
            <h1>Rediscover email for yourself</h1>
            <div>Check this out right now</div>
            <h5>Why should you try it?</h5>
            <ul>
                <li>- Quick start and easy to use</li>
                <li>- No unnecessary functions</li>
                <li>- Modern minimalistic user interface</li>
            </ul>
        </div>
    )
}
