import React from 'react'
import Modal from './Modal'
import './MailList.css'


// Email list component containing send, delete, check,
// forward, reply, filter and sort methods
export default class MailList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mail: { // Current user's email list
                list: [],  // All
                selected: [] // Checkbox-selected
            },
            sort: { // Email list sort information
                field: 'date',
                invert: false,
            },
            modalActive: false,  // Modal window active state
            modalContent: null,  // Modal window content
            text: '',  // Form textarea tag text default value
            errors: {},  // Form errors
        }
        // Form textarea tag reference (forward and reply autofill)
        this.textArea = React.createRef()
        // Methods binding
        this.unsetActive = this.unsetActive.bind(this)
        this.sendEmail = this.sendEmail.bind(this)
        this.delete = this.delete.bind(this)
        this.check = this.check.bind(this)
        this.forward = this.forward.bind(this)
        this.reply = this.reply.bind(this)
        this.filter = this.filter.bind(this)
        this.sort = this.sort.bind(this)
    }

    unsetActive(value) { // Modal window setState
        try {  // Trying to get form textArea current value
            this.setState({modalActive: value, text: this.textArea.current.value})
        } catch (error) {
            this.setState({modalActive: value})
        }
    }

    async componentDidMount() {  // Initial request (all mail list)
        document.title = 'Mail'
        const request = await fetch('http://localhost:5000/mail/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        const response = await request.json()
        if (!request.ok) {  // Signing out
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.reload()
            } else {
                this.setState({errors: response.errors})
            }
        } else {
            try {  // Textarea initial size correction
                this.textArea.current.style.height = (this.textArea.current.scrollHeight * 0.95) + 'px';
            } catch (error) {}  // Setting mail list requested
            let mail = this.state.mail
            mail.list = response
            this.setState({mail})
        }
    }

    async sendEmail(event) {  // email sending request
        event.preventDefault()  // preventing form from automatic sending
        const request = await fetch('http://localhost:5000/mail/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },  // form data serialization
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        if (!request.ok) {  // signing out
            if (response === 'TokenError') {
                localStorage.clear()
            } else {
                this.setState({errors: response.errors})
            }
        } else {
            window.location.reload()
        }
    }

    async delete() {  // deleting all emails selected (delete request)
        const request = await fetch(`http://localhost:5000/mail/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },  // emails with checkbox checked
            body: JSON.stringify(this.state.mail.selected)
        })
        const response = await request.json()
        if (!request.ok) {  // signing out
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.reload()
            } else {
                this.setState({errors: response.errors})
            }
        } else {  // refreshing email list
            let mail = this.state.mail
            mail.list = mail.list.filter(email => !mail.selected.includes(email))
            mail.selected = []
            this.setState({mail})
        }
    }

    async check(letter, callback) {  // viewing letter unseen
        if (!letter.checked) {
            const request = await fetch(`http://localhost:5000/mail/check`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },  // letter serialization
                body: JSON.stringify(letter)
            })
            const response = await request.json()
            if (!request.ok) {  // signing out
                if (response === 'TokenError') {
                    localStorage.clear()
                    window.location.reload()
                } else {
                    this.setState({errors: response.errors})
                }
            } else {  // refreshing check data
                let mail = this.state.mail
                mail.list[mail.list.indexOf(letter)].checked = true
                try {mail.selected[mail.selected.indexOf(letter)].checked = true} catch (error) {}
                this.setState({mail}, callback)
            }
        } else callback()
    }

    forward(letter) {  // creates forward email structure (text)
        const text = `Forwarded email\n\nFrom:   ${letter.sender.username}\nTo:     ${letter.recipient.username}\nTitle:  ${letter.title}\nDate:   ${new Date(letter.sending_time).toLocaleString()}\n\n${letter.text}`
        this.setState({text: null}, () => {  // form textarea size correction
            this.setState({text: text, modalActive: true, modalContent: null}, () => {
                const event = document.createEvent('HTMLEvents')
                event.initEvent('input', true, true)
                this.textArea.current.dispatchEvent(event)
            })
        })
    }

    reply(letter) {  // creates reply email structure (recipient, text)
        const text = `Reply to email\n\nFrom:   ${letter.sender.username}\nTo:     ${letter.recipient.username}\nTitle:  ${letter.title}\nDate:   ${new Date(letter.sending_time).toLocaleString()}\n\n`
        this.setState({text: null}, () => {  // form textarea size correction
            this.setState({text: text, modalActive: true, modalContent: null}, () => {
                const event = document.createEvent('HTMLEvents')
                event.initEvent('input', true, true)
                this.textArea.current.dispatchEvent(event)
                this.textArea.current.parentElement.recipient_username.value = letter.sender.username
            })
        })
    }

    async filter(event) {  // filtering message list (all|received|sent)
        const request = await fetch(`http://localhost:5000/mail/list/${event.target.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        const response = await request.json()
        if (!request.ok) {  // signing out
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.reload()
            } else {
                this.setState({errors: response.errors})
            }
        } else {  // refreshing email list
            let mail = this.state.mail
            mail.list = response
            this.setState({mail})
        }
    }

    sort(event) {  // sorting message list based on sort field chosen and invert state
        const parameter = event.target.parentElement.innerHTML.split(' ')[0].toLowerCase()
        let [state, sortCallback] = [this.state, () => {}]
        switch (parameter) {
            case 'date':  // date field sort
                sortCallback = (a, b) => {
                    if (state.sort.invert) {
                        return new Date(a.sending_time) < new Date(b.sending_time) ?
                            1 : new Date(a.sending_time) > new Date(b.sending_time) ? -1 : 0
                    } else {
                        return new Date(a.sending_time) > new Date(b.sending_time) ?
                            1 : new Date(a.sending_time) < new Date(b.sending_time) ? -1 : 0
                    }
                }
                break
            case 'title':  // title field sort
                sortCallback = (a, b) => {
                    if (state.sort.invert) {
                        return a.title < b.title ? 1 : a.title > b.title ? -1 : 0
                    } else {
                        return a.title > b.title ? 1 : a.title < b.title ? -1 : 0
                    }
                }
                break
            default:
                sortCallback = (a, b) => {  // sender|recipient field sort
                    if (state.sort.invert) {
                        return a[parameter].username < b[parameter].username ?
                            1 : a[parameter].username > b[parameter].username ? -1 : 0
                    } else {
                        return a[parameter].username > b[parameter].username ?
                            1 : a[parameter].username < b[parameter].username ? -1 : 0
                    }
                }
        }
        state.mail.list = state.mail.list.sort(sortCallback)
        state.sort = {  // applying changes
            field: parameter,
            invert: !state.sort.invert
        }
        this.setState(state)
    }

    textSize(event) {  // automatic textarea size correction
        event.target.style.height = 'auto';
        event.target.style.height = (event.target.scrollHeight * 0.95) + 'px';
    }

    render() {
        return(
            <div className={'mail_list_component'}>
                <Modal active={this.state.modalActive} unsetActive={this.unsetActive}>
                    {this.state.modalContent ? this.state.modalContent :
                        <form onSubmit={this.sendEmail} className={'mail_create_form'}>
                            {this.state.errors.recipient ? <ul className={'errors_list'}>
                                {this.state.errors.recipient.map(
                                    error => <li key={error}>{error}</li>
                                )}
                            </ul> : null}
                            <input required type={'text'} name={'recipient_username'} placeholder={'Recipient'} />
                            <input type={'text'} name={'title'} placeholder={'Title'} />
                            <textarea required name={'text'} ref={this.textArea} placeholder={'Text'} key={this.state.text}
                              defaultValue={this.state.text} onPaste={this.textSize} onInput={this.textSize}></textarea>
                            <button type={'submit'}>Send</button>
                        </form>}
                </Modal>
                <ul className={'tool_panel_upper'}>
                    <li><button onClick={() => {
                        this.setState({modalActive: true, modalContent: null})
                    }}>Write an email</button></li>
                    <li><ul className={'filter_list'}>
                        <li>
                            <input id={'filter_all'} value={'all'} name={'filter'} type={'radio'}
                                   defaultChecked={'true'} onChange={this.filter}/>
                            <label htmlFor={'filter_all'}>All</label>
                        </li>
                        <li>
                            <input id={'filter_received'} value={'received'} name={'filter'} type={'radio'}
                                   onChange={this.filter}/>
                            <label htmlFor={'filter_received'}>Received</label>
                        </li>
                        <li>
                            <input id={'filter_sent'} value={'sent'} name={'filter'} type={'radio'}
                                   onChange={this.filter}/>
                            <label htmlFor={'filter_sent'}>Sent</label>
                        </li>
                    </ul></li>
                    {this.state.mail.selected.length ?
                        <li className={'delete_button'}><button onClick={this.delete}>Delete</button></li> : null}
                </ul>
                {this.state.mail.list.length ?
                <ul className={'mail_box'}>
                    <li><ul className={'mail_list_header'}>
                        <li><input type={'checkbox'}
                           checked={this.state.mail.list.every(element => this.state.mail.selected.includes(element))}
                           onChange={(event) => {
                               let mail = this.state.mail
                               if (event.target.checked) {
                                   mail.selected = mail.list.slice()
                               } else {
                                   mail.selected = []
                               }
                               this.setState({mail: mail})
                        }} /></li><li></li><li></li>
                        <li>Sender <span onClick={this.sort}>
                            {this.state.sort.field === 'sender' ? this.state.sort.invert ? <>▴</> : <>▾</> : <>▾</>}
                        </span></li>
                        <li>Recipient <span onClick={this.sort}>
                            {this.state.sort.field === 'recipient' ? this.state.sort.invert ? <>▴</> : <>▾</> : <>▾</>}
                        </span></li>
                        <li>Title <span onClick={this.sort}>
                            {this.state.sort.field === 'title' ? this.state.sort.invert ? <>▴</> : <>▾</> : <>▾</>}
                        </span></li>
                        <li className={'letter_date'}>Date <span onClick={this.sort}>
                            {this.state.sort.field === 'date' ? this.state.sort.invert ? <>▴</> : <>▾</> : <>▾</>}
                        </span></li>
                    </ul></li>
                    <li className={'mail_list'}><ul>{this.state.mail.list.map(
                        letter => <li key={letter._id}>
                            <ul className={localStorage.username !== letter.recipient.username ?
                                'mail_list_letter' : letter.checked ? 'mail_list_letter' : 'mail_list_letter unchecked'} onClick={() => {
                                this.check(letter, () => {
                                    this.setState({modalActive: true, modalContent: (
                                            <div className={'mail_detail'}>
                                                <h2>{letter.title}</h2>
                                                <div>From: {letter.sender.username}</div>
                                                <div>To: {letter.recipient.username}</div>
                                                <div>Date: {new Date(letter.sending_time).toLocaleString()}</div>
                                                <div className={'letter_text'}>{letter.text}</div>
                                            </div>
                                        )})
                                })
                            }}>
                                <li className={'letter_check'}>
                                    <input type={'checkbox'} checked={this.state.mail.selected.includes(letter)}
                                   onChange={(event) => {
                                       let mail = this.state.mail
                                       if (event.target.checked) {
                                           mail.selected.push(letter)
                                       } else {
                                           mail.selected.splice([mail.selected.indexOf(letter)], 1)
                                       }
                                       this.setState({mail: mail})
                                   }} onClick={event => {event.stopPropagation()}}/></li>
                                <li><button onClick={event => {
                                    event.stopPropagation()
                                    this.forward(letter)
                                }}>Forward</button></li>
                                <li>{localStorage.username !== letter.sender.username ?
                                <button onClick={event => {
                                    event.stopPropagation()
                                    this.reply(letter)
                                }}>Reply</button> : null}</li>
                                <li>{letter.sender.username}</li>
                                <li>{letter.recipient.username}</li>
                                <li>{letter.title}</li>
                                <li className={'letter_date'}>{new Date(letter.sending_time).toLocaleString()}</li>
                            </ul>
                        </li>
                    )}</ul></li>
                </ul> : <span>No emails yet</span>}
            </div>
        )
    }
}
