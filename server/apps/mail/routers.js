import {Router} from 'express'
import authMiddleware from '../auth/middleware.js'


const router = new Router()


// Applying authentication middleware to restrict access
router.use(authMiddleware)

// Mail pages
////...


export default router