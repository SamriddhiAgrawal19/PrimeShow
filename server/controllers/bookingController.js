import Booking from "../models/Booking.js";
import Show from "../models/Show.js";


const checkSeatsAvailability = async (showId, selectedSeats) => {
    try{
        const showData = await Show.findById(showId);
        if(!showData){
            return false;
        }
        const occupiedSeats = showData.occupiedSeats || {};
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
    }catch(err){
        console.error("checkSeatsAvailability error:", err);
        return false;
    }
}

export const createBooking = async(req , res)=>{
    try{
        const {userId} = req.auth;
        const {showId, selectedSeats } = req.body;
        const {origin} = req.headers;
        if(!showId || !selectedSeats || selectedSeats.length === 0){
            return res.status(400).json({ message: "showId and selectedSeats are required" });
        }
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if(!isAvailable){
            return res.status(400).json({ message: "Selected seats are not available" });
        }
        const showData = await Show.findById(showId).populate('movie');
        const booking = new Booking({
            user: userId,
            show: showId,
            bookedSeats: selectedSeats,
            amount: showData.showPrice * selectedSeats.length,
        });
        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })
        showData.markModified('occupiedSeats');
        await showData.save();

        //Stripe payment integration can be added here
        res.json({success : true , message : "Seats booked successfully"});
        
        res.status(201).json({ message: "Booking created successfully", booking });
    }catch(err){
        console.error("createBooking error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getOccupiedSeats = async(req , res)=>{
    try{
        const {showId} = req.params;
        const showData = await Show.findById(showId);
        const occupiedSeats = Object.keys(showData.occupiedSeats || {});
        res.json({success : true , occupiedSeats});
    }catch(err){
        console.error("getOccupiedSeats error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

    