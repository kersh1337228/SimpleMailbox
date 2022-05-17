import {Router} from 'express'
import authAPIController from './controllers.js'
import authMiddleware from './middleware.js'


const router = new Router()


// Authentication pages
router.post('/login', authAPIController.login)  // Sign in
router.post('/register', authAPIController.register)  // Sign up
router.delete('/delete', authMiddleware, authAPIController.delete)  // Account delete


export default router
