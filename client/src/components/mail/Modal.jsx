import React from 'react'
import './MailCreate.css'


export default class Modal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: props.active,
        }
    }
    render() {
        return(
            <div className={this.props.active ? 'background active' : 'background'} onClick={() => {
                this.props.unsetActive()
            }}>
                <div className={'content'} onClick={(event) => {
                    event.stopPropagation()
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}