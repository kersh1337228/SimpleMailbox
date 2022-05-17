import mongoose from 'mongoose'
import Email from './models.js'
import User from '../auth/models.js'


export default class mailApiController {  // Email application controller
    // Returns list of all user emails (both sent and received)
    static async list(request, response) {  // GET
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
    // Returns list of user emails depending on filter option provided
    static async list_filtered(request, response) {  // GET
        try {
            const user = await User.findOne({username: request.user.username})
            const emails = await user.get_emails(request.params.filter)
            response.status(200).json(emails)
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }
    // Creating new Email model instance
    static async create(request, response) {  // POST
        try {
            const {recipient_username, title, text} = request.body
            const sender = await User.findOne({username: request.user.username})
            const recipient = await User.findOne({username: recipient_username})
            if (!recipient) {  // Validating recipient data
                return response.status(400).json({
                    errors: {
                        recipient: ['No recipient with such name found']
                    }
                })
            }  // No same email user and recipient validation
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
                // Adding newly created email to both
                // sender's and recipient's email lists
                sender.emails.push(savedEmail)
                recipient.emails.push(savedEmail)
                // Applying changes
                await sender.save()
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
    // Deleting email from user list
    static async delete(request, response) {  // DELETE
        try {
            const user = await User.findOne({username: request.user.username})
            const emails = request.body
            // Deleting email requested from user's email list
            user.emails = user.emails.filter(email => !(emails.map(email => email._id)).includes(email.valueOf()))
            await user.save(async () => {
                // If no user store email requested then
                // deleting Email model instance
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
    // Viewing newly sent email by recipient (checking)
    static async check(request, response) {  // PATCH
        try {
            const user = await User.findOne({username: request.user.username})
            const email = await Email.findById(request.body._id)
            // Sender can not check the letter validation
            if (!user._id.equals(new mongoose.Types.ObjectId(request.body.sender._id))) {
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
