
import Show from "../models/Show.js";
import Booking from "../models/bookings.js";
import Stripe from "stripe";
import dotenv from 'dotenv'
dotenv.config()



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
    const auth = req.auth();
    const userId = auth.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { showId, selectedSeats, amount } = req.body;

    if (!showId || !selectedSeats?.length) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    
    const show = await Show.findById(showId).populate("movieId");
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

  
    const booking = await Booking.create({
      user: userId,
      show: showId,
      bookedSeats: selectedSeats,
      amount: Number(amount),
    });

    
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: show.movie?.title || "Movie Ticket",
          },
          unit_amount: Math.floor(Number(amount)) * 100, 
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${process.env.FRONTEND_URL}/loading/my-bookings`,
      cancel_url: `${process.env.FRONTEND_URL}/my-bookings`,
      line_items,
      mode: "payment",
      metadata: {
        bookingId: booking._id.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // ✅ fixed Date.now()
    });

    booking.paymentLink = session.url;
    await booking.save();

    return res.json({ success: true, url: session.url });
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

    