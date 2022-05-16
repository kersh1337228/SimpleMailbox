import React, {useState} from 'react'
import Modal from '../mail/Modal'
import './Account.css'


const Account = () => {
    const [active, setActive] = useState(false)
    const username = localStorage.getItem('username')
    return(
        <div className={'account'}>
            <h3 onClick={() => {setActive(true)}}>Current account: {username}</h3>
            <Modal active={active} unsetActive={setActive}>
                <h1>Current account: {username}</h1>
                <button onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                }}>Sign out</button>
            </Modal>
        </div>
    )
}


export default Account
