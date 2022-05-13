import {Router} from 'express'
import {loginAPIController, registerAPIController} from './controllers.js'


const router = new Router()


// Authentication pages
//// Sign in
router.get('/login', loginAPIController.get)
router.post('/login', loginAPIController.post)
//// Sign up
router.get('/register', registerAPIController.get)
router.post('/register', registerAPIController.post)


export default router
