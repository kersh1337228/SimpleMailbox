import mongoose from 'mongoose'
import Email from "../mail/models.js";


// User model schema
const User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {  // Stores password's hash (Blowfish cipher)
        type: String,
        unique: false,
        required: true,
    },
    emails: [{  // Email model list (received, sent)
        type: mongoose.Types.ObjectId,
        ref: 'Email',
        default: [],
    }],
})


// Getting Email model instances stored in user model's emails field
User.methods.get_emails = async function(filter='all') {
    let emails = await Promise.all(this.emails.map(async email_id => {
        const email = await Email.findById(email_id)
        email.sender = await this.model('User').findById(email.sender)
        email.recipient = await this.model('User').findById(email.recipient)
        return email
    })) // Translating id into model instance (serialization)
    switch (filter) {
        case 'received':  // Current user is recipient
            emails = emails.filter(email => email.recipient.equals(this._id))
            break
        case 'sent':  // Current user is sender
            emails = emails.filter(email => email.sender.equals(this._id))
            break
    }  // Sorting emails by date starting with new ones
    return emails.sort((a, b) => {
        return new Date(a.sending_time) < new Date(b.sending_time) ?
            1 : new Date(a.sending_time) > new Date(b.sending_time) ? -1 : 0
    })
}


export default mongoose.model('User', User)
