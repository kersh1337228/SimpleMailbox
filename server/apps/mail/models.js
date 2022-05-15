import mongoose from 'mongoose'
import User from "../auth/models.js";


const Email = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    recipient: {
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
    checked: {
        type: Boolean,
        default: false,
    },
    sending_time: {
        type: Date,
        default: Date.now()
    },
})


Email.statics.check_consistency = async function() {
    const emails = await this.model('Email').find({})
    emails.forEach(async email => {
        const [sender, recipient] = [
            await User.findById(email.sender),
            await User.findById(email.recipient)
        ]
        if (!(sender.emails.includes(new mongoose.Types.ObjectId(email._id))) &&
            !(recipient.emails.includes(new mongoose.Types.ObjectId(email._id)))) {
            await this.model('Email').findByIdAndRemove(email._id)
        }
    })
}


export default mongoose.model('Email', Email)
