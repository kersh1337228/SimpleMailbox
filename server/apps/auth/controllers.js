import User from './models.js'
import bcrypt from 'bcryptjs'
import path from 'path'


export class loginAPIController {

    static async get(request, response) {
        try {
            return response.json('Login page')
        } catch (error) {
            console.log(error)
            return response.status(400).json({
                message: error
            })
        }
    }

    static async post(request, response) {
        try {
            const {username, password} = request.body
            const user = new User({
                username: username,
                password: bcrypt.hashSync(password, 3),
            })
            await user.save()
            return response.status(201).json(user)
        } catch (error) {
            console.log(error)
            return response.status(400).json({
                message: error
            })
        }
    }
}


export class registerAPIController {
    static async get(request, response) {
        try {

        } catch (error) {
            console.log(error)
            return response.status(400).json({
                message: error
            })
        }
    }

    static async post(request, response) {
        try {

        } catch (error) {
            console.log(error)
            return response.status(400).json({
                message: error
            })
        }
    }
}
