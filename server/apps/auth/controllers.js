import User from './models.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


function generateAccessToken(username, id) {
    const payload = {username, id}
    return jwt.sign(
        payload,
        'very_secret_key',
        {expiresIn: '1h'}
    )
}


export class loginAPIController {
    // Trying to get user instance by data sent
    static async post(request, response) {
        try {
            const {username, password} = request.body
            const user = await User.findOne({username: username})
            if (!user) {
                return response.status(400).json({
                    errors: {
                        username: ['No user with such username found']
                    }
                })
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return response.status(400).json({
                    errors: {
                        password: ['Wrong password']
                    }
                })
            }
            return response.status(200).json({
                token: generateAccessToken(user.username, user._id)
            })
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }
}


export class registerAPIController {
    // Creating new user instance
    static async post(request, response) {
        try {
            const {username, password} = request.body
            const user = new User({
                username: username,
                password: bcrypt.hashSync(password, 3),
            })
            await user.save()
            return response.status(201).json('Registered')
        } catch (error) {
            console.log(error.message)
            if (error.message.includes('E11000 duplicate key error collection:')) {
                return response.status(400).json({
                    errors: {
                        username: ['User with this username already exists']
                    }
                })
            } else {
                return response.status(500).json({
                    message: 'Request error'
                })
            }
        }
    }
}
