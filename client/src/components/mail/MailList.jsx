import React from 'react'
import Modal from "./Modal";
import MailDetail from "./MailDetail";


export default class MailList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mail: {
                list: [],
                selected: []
            },
            modalActive: false,
            modalContent: null,
            text: '',
            errors: {},
        }
        // Methods binding
        this.unsetActive = this.unsetActive.bind(this)
        this.sendEmail = this.sendEmail.bind(this)
        this.delete = this.delete.bind(this)
        this.check = this.check.bind(this)
        this.forward = this.forward.bind(this)
    }

    unsetActive() {
        this.setState({modalActive: false})
    }

    async componentDidMount() {
        const request = await fetch('http://localhost:5000/mail/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
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
            let mail = this.state.mail
            mail.list = response
            this.setState({mail})
        }
    }

    async sendEmail(event) {
        event.preventDefault()
        const request = await fetch('http://localhost:5000/mail/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        if (!request.ok) {
            if (response === 'TokenError') {
                localStorage.clear()
            } else {
                this.setState({errors: response.errors})
            }
        } else {
            window.location.reload()
        }
    }

    async delete() {
        const request = await fetch(`http://localhost:5000/mail/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(this.state.mail.selected)
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
            let mail = this.state.mail
            mail.list = response
            this.setState({mail})
        }
    }

    async check(letter) {
        const request = await fetch(`http://localhost:5000/mail/check`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(letter)
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
            let mail = this.state.mail
            mail.list = response
            this.setState({mail})
        }
    }

    forward(letter) {
        const text = `Forwarded message\n\nFrom:   ${letter.sender.username}\nTo:     ${letter.recipient.username}\nTitle:  ${letter.title}\nDate:   ${new Date(letter.sending_time).toLocaleString()}\n\n${letter.text}`
        this.setState({text: null}, () => {
            this.setState({text: text, modalActive: true, modalContent: null})
        })
    }

    render() {
        return(
            <div>
                <button onClick={() => {this.setState({modalActive: true, modalContent: null})}}>
                    Write an email</button>
                <Modal active={this.state.modalActive} unsetActive={this.unsetActive}>
                    {this.state.modalContent ? this.state.modalContent :
                        <form onSubmit={this.sendEmail}>
                            {this.state.errors.recipient ? <ul>
                                {this.state.errors.recipient.map(
                                    error => <li key={error}>{error}</li>
                                )}
                            </ul> : null}
                            <input required type={'text'} name={'recipient_username'} />
                            <input type={'text'} name={'title'} />
                            <textarea required name={'text'} key={this.state.text}
                              defaultValue={this.state.text} onChange={event => {
                                  this.setState({text: event.target.value})
                              }
                            }></textarea>
                            <button type={'submit'}>Send</button>
                        </form>}
                </Modal>
                {this.state.mail.list.length ? <>
                <div className={'tool_panel_upper'}>
                    <input type={'checkbox'}
                           checked={this.state.mail.list.every((element) => this.state.mail.selected.includes(element))}
                           onChange={(event) => {
                                let mail = this.state.mail
                                if (event.target.checked) {
                                    mail.selected = mail.list.slice()
                                } else {
                                    mail.selected = []
                                }
                                this.setState({mail: mail})
                            }} />
                    {this.state.mail.selected.length ?
                        <button onClick={this.delete}>Delete</button> : null}
                </div>
                <ul className={'mail_list'}>
                    {this.state.mail.list.map(
                        letter => <li key={letter._id}>
                            <ul className={localStorage.getItem('username') !== letter.recipient.username ?
                                'mail_list_letter' : letter.checked ? 'mail_list_letter' : 'mail_list_letter unchecked'} onClick={() => {
                                this.check(letter)
                                this.setState({modalActive: true, modalContent: (<MailDetail letter={letter} />)})
                            }}>
                                <li><input type={'checkbox'} checked={this.state.mail.selected.includes(letter)}
                                   onChange={(event) => {
                                       let mail = this.state.mail
                                       if (event.target.checked) {
                                           mail.selected.push(letter)
                                       } else {
                                           mail.selected.splice([mail.selected.indexOf(letter)], 1)
                                       }
                                       this.setState({mail: mail})
                                   }}/></li>
                                <li><button onClick={event => {this.forward(letter)}}>Forward</button></li>
                                <li>From: {letter.sender.username}</li>
                                <li>To: {letter.recipient.username}</li>
                                <li>Title: {letter.title}</li>
                                <li>Date: {new Date(letter.sending_time).toLocaleString()}</li>
                            </ul>
                        </li>
                    )}
                </ul> </> : <span>No emails yet</span>}
            </div>
        )
    }
}
