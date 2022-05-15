import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRouter from './apps/auth/routes.js'
import mailRouter from './apps/mail/routers.js'


const PORT = process.env.PORT || 5000
const app = express()


// Applying middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Specifying applications urls
app.use('/auth', authRouter)
app.use('/mail', mailRouter)


const init = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://user:123@cluster0.e5tre.mongodb.net/simplemailbox',
            {}
        )
        app.listen(PORT, () => {
            console.log(`Running server on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}


init()
