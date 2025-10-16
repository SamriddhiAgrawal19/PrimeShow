import express from "express";
import { getUserBookings, updateFavourite , getFavourites , addFavourite, removeFavourite} from "../controllers/UserBookings.js";
import { requireAuth } from "@clerk/express";

const userRouter = express.Router();

userRouter.get('/bookings' , requireAuth(), getUserBookings);
userRouter.post('/add-favourites' , addFavourite)

userRouter.get('/update-favourite' , updateFavourite)
userRouter.get('/favourites' , getFavourites)
userRouter.post('/remove-favourite' , removeFavourite)

export default userRouter;