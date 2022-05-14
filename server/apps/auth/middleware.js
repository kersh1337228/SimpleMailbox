import jwt from 'jsonwebtoken'


export default function authMiddleware(request, response, next) {
    console.log('MIDDLEWARE')
    if (request.method === 'OPTIONS') next()
    try {
        const token = request.headers.authorization.split(' ')[1]
        if (!token) {
            throw Error('No authorization token')
        } else {
            console.log(jwt.verify(token, 'very_secret_key'))
            // request.user = jwt.verify(token, 'very_secret_key')
        }
        next()
    } catch (error) {
        console.log(error)
        throw error
    }
}
