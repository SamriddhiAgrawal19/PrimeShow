import { clerkClient } from "@clerk/express";
import Booking from "../models/bookings.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const addFavourite = async(req, res)=>{
    try{
        const {movieId} = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    if(!user.privateMetadata.favourites){
        user.privateMetadata.favourites = []
    }
    if(!user.privateMetadata.favourites.includes(movieId)){
        user.privateMetadata.favourites.push(movieId);
    }
    await clerkClient.users.updateUserMetadata(userId , {privateMetaData})
    res.json({success : true , message : "Favourites added successfully"});

    }catch(err){
        console.log(err.message);
    }
    

}

export const updateFavourite = async(req, res)=>{
    try{
        const {movieId} = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    if(!user.privateMetadata.favourites){
        user.privateMetadata.favourites = []
    }
    if(!user.privateMetadata.favourites.includes(movieId)){
        user.privateMetadata.favourites.push(movieId);
    }else{
        user.privateMetadata.favourites = user.privateMetadata.favourites.filter(item => item!== movieId);
    }
    await clerkClient.users.updateUserMetadata(userId , {privateMetaData})
    res.json({success : true , message : "Favourites updated successfully"});

    }catch(err){
        console.log(err.message);
    }
    

}

export const getFavourites = async(req, res) =>{
    try{
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favourites = user.privateMetadata.favourites;

        const movies = await Movie.find({_id : {$in : favourites}})
        res.json({success : true , movies});

    }catch(err){
        console.log(err.message);
        res.json({success : false , message : err.message});
    }
}