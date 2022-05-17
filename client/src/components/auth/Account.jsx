import React from 'react'
import Modal from '../mail/Modal'
import './Account.css'


export default class Account extends React.Component{
    constructor(props) {
        super(props)
        this.setActive = this.setActive.bind(this)
        this.account_delete = this.account_delete.bind(this)
        this.delete_confirm = this.delete_confirm.bind(this)
        this.delete_cancel = this.delete_cancel.bind(this)
        this.state = {
            active: false,
            deleteButton: (
                <button className={'account_delete'} onClick={this.account_delete}>
                    Delete an account
                </button>
            )
        }
    }

    setActive(value) {
        if (value) {
            this.setState({active: value})
        } else {
            this.setState({active: value, deleteButton: (
                <button className={'account_delete'} onClick={this.account_delete}>
                    Delete an account
                </button>
            )})
        }
    }

    account_delete() {
        this.setState({deleteButton: (
            <div className={'account_delete_solution'}>
                <button onClick={this.delete_cancel} className={'account_delete_cancel'}>
                    Cancel
                </button>
                <button onClick={this.delete_confirm} className={'account_delete_confirm'}>
                    Delete
                </button>
            </div>
        )})
    }

    async delete_confirm() {
        const request = await fetch(`http://localhost:5000/auth/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        const response = await request.json()
        if (!request.ok) {
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.reload()
            } else {
                this.setState({errors: response.errors})
            }
        } else {
            localStorage.clear()
            window.location.reload()
        }
    }

    delete_cancel() {
        this.setState({deleteButton: (
            <button className={'account_delete'} onClick={this.account_delete}>
                Delete an account
            </button>
        )})
    }

    render() {
        const username = localStorage.getItem('username')
        return(
            <div className={'account'}>
                <div onClick={() => {this.setActive(true)}} className={'account_nav'}>
                    Current account: {username}
                </div>
                <Modal active={this.state.active} unsetActive={this.setActive}>
                    <div className={'account_container'}>
                        <h1>Current account: {username}</h1>
                        <button onClick={() => {
                            localStorage.clear()
                            window.location.reload()
                        }}>Sign out</button>
                        {this.state.deleteButton}
                    </div>
                </Modal>
            </div>
        )
    }
}
