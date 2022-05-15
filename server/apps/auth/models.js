import mongoose from 'mongoose'
import Email from "../mail/models.js";


const User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        unique: false,
        required: true,
    },
    emails: [{
        type: mongoose.Types.ObjectId,
        ref: 'Email',
        default: [],
    }],
})


User.methods.get_emails = function() {
    return Promise.all(this.emails.map(async email_id => {
        const email = await Email.findById(email_id)
        email.sender = await this.model('User').findById(email.sender)
        email.recipient = await this.model('User').findById(email.recipient)
        return email
    }))
}


export default mongoose.model('User', User)
