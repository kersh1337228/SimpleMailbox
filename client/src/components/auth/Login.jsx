import React from 'react'


export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    login(event) {
        event.preventDefault()
        console.log({
            username: event.target.username.value,
            password: event.target.password.value
        })
    }

    render() {
        return(
            <form onSubmit={this.login}>
                <input type={'text'} name={'username'} placeholder={'username'}/>
                <input type={'password'} name={'password'} placeholder={'password'}/>
                <button type={'submit'}>Sign in</button>
            </form>
        )
    }
}
