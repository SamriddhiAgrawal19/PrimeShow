import express from "express";
import { getUserBookings, updateFavourite , getFavourites } from "../controllers/UserBookings.js";
import { requireAuth } from "@clerk/express";

const userRouter = express.Router();

userRouter.get('/bookings' , requireAuth(), getUserBookings);
userRouter.get('/update-favourite' , updateFavourite)
userRouter.get('/favourites' , getFavourites)
export default userRouter;