import React from 'react'
import {Link} from 'react-router-dom'


// Sign in form and login request method
export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errors: {}  // form errors
        }  // method binding
        this.login = this.login.bind(this)
    }

    async login(event) {  // login request
        event.preventDefault()  // preventing automatic form sending
        const request = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },  // form data serialization
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        if (!request.ok) {
            this.setState({errors: response.errors})
        } else {  // Signing in
            localStorage.setItem('token', response.token)
            localStorage.setItem('username', response.username)
            window.location.reload()
        }
    }

    render() {
        return(
            <form onSubmit={this.login} className={'sign_form'}>
                {this.state.errors.username ? <ul className={'errors_list'}>
                    {this.state.errors.username.map(
                        error => <li key={error}>{error}</li>
                    )}
                </ul> : null}
                <input required type={'text'} name={'username'} placeholder={'Username'}/>
                {this.state.errors.password ? <ul className={'errors_list'}>
                    {this.state.errors.password.map(
                        error => <li key={error}>{error}</li>
                    )}
                </ul> : null}
                <input required type={'password'} name={'password'} placeholder={'Password'}/>
                <button type={'submit'}>Sign in</button>
                <span>Do not have an account?
                    <Link to={'/register'} className={'relocate_link'}> Sign up</Link>
                </span>
            </form>
        )
    }
}
