import React from 'react'
import {Link} from 'react-router-dom'
import './Register.css'


// Sign up form and register request method
export default class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errors: {}  // form errors
        }  // method binding
        this.register = this.register.bind(this)
    }

    async register(event) {  // register request
        event.preventDefault()  // preventing automatic form sending
        const request = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },  // form data serialization
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        if (!request.ok) {
            this.setState({errors: response.errors})
        } else {  // redirecting to sign in form page
            window.location.href = '/login'
        }
    }

    componentDidMount() {
        document.title = 'Sign up'
    }

    render() {
        return(
            <form onSubmit={this.register} className={'sign_form'}>
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
                <input required type={'password'} name={'password'} placeholder={'Password'} onChange={event => {
                    if (!event.target.value) {
                        this.setState({errors: {password_repeat: null}})
                    }
                }}/>
                {this.state.errors.password_repeat ? <ul className={'errors_list'}>
                    {this.state.errors.password_repeat.map(
                        error => <li key={error}>{error}</li>
                    )}
                </ul> : null}
                <input required type={'password'} name={'password_repeat'} placeholder={'Repeat the password'}
                       onChange={event => {
                           if (event.target.value !== event.target.parentElement.children.password.value) {
                               this.setState({errors: {password_repeat: ['Passwords do not match']}})
                           } else {
                               this.setState({errors: {password_repeat: null}})
                           }
                       }}/>
                <button type={'submit'}>Sign up</button>
                <span>Already have an account?
                    <Link to={'/login'} className={'relocate_link'}> Sign in</Link>
                </span>
            </form>
        )
    }
}
