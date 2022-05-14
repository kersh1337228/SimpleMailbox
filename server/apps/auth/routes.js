import {Router} from 'express'
import {loginAPIController, registerAPIController} from './controllers.js'


const router = new Router()


// Authentication pages
router.post('/login', loginAPIController.post)  // Sign in
router.post('/register', registerAPIController.post)  // Sign up


export default router
