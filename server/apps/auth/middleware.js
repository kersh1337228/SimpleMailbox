import jwt from 'jsonwebtoken'


export default function authMiddleware(request, response, next) {
    if (request.method === 'OPTIONS') next()
    try {
        const token = request.headers.authorization.split(' ')[1]
        if (!token) {
            throw Error('No authorization token')
        } else {
            request.user = jwt.verify(token, 'very_secret_key')
        }
        next()
    } catch (error) {
        console.log(error)
        response.status(400).json('TokenError')
    }
}
