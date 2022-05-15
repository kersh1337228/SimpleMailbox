import Email from './models.js'
import User from '../auth/models.js'


export default class mailApiController {
    static async list(request, response) {
        try {
            const user = await User.findOne({username: request.user.username})
            response.status(200).json(await user.get_emails())
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }

    static async create(request, response) {
        try {
            const {recipient_username, title, text} = request.body
            const sender = await User.findOne({username: request.user.username})
            const recipient = await User.findOne({username: recipient_username})
            if (!recipient) {
                return response.status(400).json({
                    errors: {
                        recipient: ['No recipient with such name found']
                    }
                })
            }
            if (sender._id === recipient._id) {
                return response.status(400).json({
                    errors: {
                        recipient: ['You can not send emails to yourself']
                    }
                })
            }
            const email = new Email({
                sender: sender._id,
                recipient: recipient._id,
                title: title,
                text: text,
            })
            await email.save(async (error, savedEmail) => {
                sender.emails.push(savedEmail)
                await sender.save()
                recipient.emails.push(savedEmail)
                await recipient.save()
            })
            return response.status(201).json(email)
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }

    static async delete(request, response) {
        try {
            const user = await User.findOne({username: request.user.username})
            const emails = request.body
            user.emails = user.emails.filter(email => !(emails.map(email => email._id)).includes(email.valueOf()))
            await user.save(async () => {
                await Email.check_consistency()
            })
            response.status(200).json(await user.get_emails())
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }

    static async check(request, response) {
        try {
            const user = await User.findOne({username: request.user.username})
            const email = await Email.findById(request.body._id)
            if (user._id !== request.body.sender._id) {
                email.checked = true
                await email.save()
            }
            response.status(200).json(await user.get_emails())
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }
}
