import React from 'react'


export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errors: {}
        }
        this.login = this.login.bind(this)
    }

    async login(event) {
        event.preventDefault()
        const request = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        if (!request.ok) {
            this.setState({errors: response.errors})
        } else {
            localStorage.setItem('token', response.token)
        }
    }

    render() {
        return(
            <form onSubmit={this.login}>
                {this.state.errors.username ? <ul>
                    {this.state.errors.username.map(
                        error => <li key={error}>{error}</li>
                    )}
                </ul> : null}
                <input required type={'text'} name={'username'} placeholder={'Username'}/>
                {this.state.errors.password ? <ul>
                    {this.state.errors.password.map(
                        error => <li key={error}>{error}</li>
                    )}
                </ul> : null}
                <input required type={'password'} name={'password'} placeholder={'Password'}/>
                <button type={'submit'}>Sign in</button>
                <span>Do not have an account? <a href={'/register'}>Sign up</a></span>
            </form>
        )
    }
}
