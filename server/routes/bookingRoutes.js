import express from 'express';
import { confirmBookingPayment, createBooking , getOccupiedSeats } from '../controllers/bookingController.js';
import { requireAuth } from "@clerk/express";

const bookingRouter = express.Router();
bookingRouter.post('/create', requireAuth(), createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post('/confirm-payment' , confirmBookingPayment)
export default bookingRouter;