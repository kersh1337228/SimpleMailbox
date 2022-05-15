import React from 'react'


export default class MailDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return(
            <div className={'mail_detail'}>
                <h2>{this.props.letter.title}</h2>
                <div>From: {this.props.letter.sender.username}</div>
                <div>To: {this.props.letter.recipient.username}</div>
                <div>Date: {new Date(this.props.letter.sending_time).toLocaleString()}</div>
                <p>{this.props.letter.text}</p>
            </div>
        )
    }
}
