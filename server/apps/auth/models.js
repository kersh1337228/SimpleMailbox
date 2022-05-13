import mongoose from 'mongoose'


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
    }
})


export default mongoose.model('User', User)
