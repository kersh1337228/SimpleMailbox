import {Router} from 'express'
import authAPIController from './controllers.js'


const router = new Router()


// Authentication pages
router.post('/login', authAPIController.login)  // Sign in
router.post('/register', authAPIController.register)  // Sign up


export default router
