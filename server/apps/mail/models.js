import mongoose from 'mongoose'
import User from "../auth/models.js";


// Email model schema
const Email = new mongoose.Schema({
    sender: {  // creates (User model instance)
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    recipient: {  // gets (User model instance)
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: false,
        default: ''
    },
    text: {
        type: String,
        required: true,
    },
    checked: {  // Email viewed indicator
        type: Boolean,
        default: false,
    },
    sending_time: {  // model instance time creation
        type: Date,
        default: Date.now()
    },
})


// If no user store email then deleting Email model instance
Email.statics.check_consistency = async function() {
    const emails = await this.model('Email').find({}) // Getting all Email model instances
    emails.forEach(async email => {  // Getting email sender and recipient (User model instances)
        const [sender, recipient] = [
            await User.findById(email.sender),
            await User.findById(email.recipient)
        ]  // Email database consistency validation
        if (!(sender.emails.includes(new mongoose.Types.ObjectId(email._id))) &&
            !(recipient.emails.includes(new mongoose.Types.ObjectId(email._id)))) {
            await this.model('Email').findByIdAndRemove(email._id)
        }
    })
}


export default mongoose.model('Email', Email)
