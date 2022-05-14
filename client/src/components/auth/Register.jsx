import React from 'react'


export default class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errors: {}
        }
        this.register = this.register.bind(this)
    }

    async register(event) {
        event.preventDefault()
        const request = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        if (!request.ok) {
            this.setState({errors: response.errors})
        } else {
            window.location.href = '/login'
        }
    }

    render() {
        return(
            <form onSubmit={this.register}>
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
                {this.state.errors.password_repeat ? <ul>
                    {this.state.errors.password_repeat.map(
                        error => <li key={error}>{error}</li>
                    )}
                </ul> : null}
                <input required type={'password'} name={'password_repeat'} placeholder={'Repeat the password'}
                       onChange={(event) => {
                           if (event.target.value !== event.target.parentElement.children.password.value) {
                               this.setState({errors: {password_repeat: ['Passwords do not match']}})
                           } else {
                               this.setState({errors: {password_repeat: []}})
                           }
                       }}/>
                <button type={'submit'}>Sign up</button>
                <span>Already have an account? <a href={'/login'}>Sign in</a></span>
            </form>
        )
    }
}
