import express from 'express'
import { protectAdmin } from '../middleware/auth.js'
import { isAdmin , getDashboardData , getAllBookings , getAllShows} from '../controllers/AdminController.js'


const AdminRouter = express.Router()
AdminRouter.get('/is-admin' , isAdmin)
AdminRouter.get('/dashboard', getDashboardData)
AdminRouter.get('/all-shows',  getAllShows)
AdminRouter.get('/all-bookings' , getAllBookings)

export default AdminRouter
