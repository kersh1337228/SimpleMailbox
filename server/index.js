import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import authRouter from './apps/auth/routes.js'


const __dirname = path.resolve()
const PORT = process.env.PORT || 3000
const app = express()


// Applying middleware
app.use(express.static(path.join(__dirname, '../client/static')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Specifying applications urls
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../client/templates/index.html'))
})
app.use(authRouter)


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
