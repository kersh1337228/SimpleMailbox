import React from 'react'
import './Modal.css'


// Modal window (popup) component (container)
export default class Modal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: props.active,  // window active state
        }
    }
    render() {
        return(
            <div className={this.props.active ? 'background active' : 'background'} onClick={() => {
                this.props.unsetActive(false)
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
