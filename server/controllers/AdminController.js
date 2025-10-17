import User from "../models/User.js";
import Booking from "../models/bookings.js";
import Show from "../models/Show.js";


export const isAdmin = (req, res)=>{
    res.json({success : true , isAdmin : true});
}

export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });

    const activeShows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movieId')
      .sort({ showDateTime: 1 });

    const totalUsers = await User.countDocuments();

    const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.amount || 0), 0);

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue,
      totalUsers,
      activeShows,
    };

    return res.json({ success: true, dashboardData });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllShows = async(req, res)=>{
    try{
        const shows = (await Show.find({showDateTime : {$gte : new Date()}}).populate('movie')).sort({showDateTime : 1});
        res.json({success : true , shows});
    }catch(err){
        console.error(err);
        res.json({success : false , message : "Internal Server Error"});
    }
}

export const getAllBookings = async(req, res)=>{
    try{
        const bookings = await Booking.find({}).populate('user').populate({
            path : "show",
            populate : {path : "movie"}

        }).sort({createdAt : -1});
        res.json({success : true , bookings});
    }catch(err){
        console.error(err);
        res.json({success : false , message : "Internal Server Error"});
    }
}
