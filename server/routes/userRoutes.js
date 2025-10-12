import express from "express";
import { getUserBookings, updateFavourite , getFavourites } from "../controllers/UserBookings.js";

const userRouter = express.Router();

userRouter.get('/bookings' , getUserBookings);
userRouter.get('/update-favourite' , updateFavourite)
userRouter.get('/favourites' , getFavourites)
export default userRouter;