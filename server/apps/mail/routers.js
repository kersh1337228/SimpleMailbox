import {Router} from 'express'
import authMiddleware from '../auth/middleware.js'
import mailApiController from './controllers.js'


const router = new Router()


// Applying authentication middleware to restrict access
router.use(authMiddleware)

// Mail pages
router.get('/list', mailApiController.list)
router.post('/create', mailApiController.create)
router.delete('/delete', mailApiController.delete)
router.patch('/check', mailApiController.check)


export default router