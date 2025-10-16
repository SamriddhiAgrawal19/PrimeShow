import express from 'express'
import { protectAdmin } from '../middleware/auth.js'
import { isAdmin , getDashboardData , getAllBookings , getAllShows} from '../controllers/AdminController.js'


const AdminRouter = express.Router()
AdminRouter.get('/is-admin' , isAdmin)
AdminRouter.get('/dashboard', protectAdmin, isAdmin, getDashboardData)
AdminRouter.get('/all-shows', protectAdmin, isAdmin, getAllShows)
AdminRouter.get('/all-bookings', protectAdmin, isAdmin, getAllBookings)

export default AdminRouter
