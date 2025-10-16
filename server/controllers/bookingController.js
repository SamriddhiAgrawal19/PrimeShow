
import Show from "../models/Show.js";
import Booking from "../models/bookings.js";


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

export const createBooking = async (req, res) => {
  try {
    const auth = req.auth(); // ✅ call as function
    const userId = auth.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { showId, selectedSeats } = req.body;

    if (!showId || !selectedSeats?.length) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    // Check if show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      bookedSeats: selectedSeats,
    });

    return res.json({ success: true, booking });
  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

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

    