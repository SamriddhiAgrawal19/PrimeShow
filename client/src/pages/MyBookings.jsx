import React, { useState, useEffect } from "react";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import timeFormat from "../lib/timeFormat";
import dateFormat from "../lib/DateFormat";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, getToken } = useAppContext();

  const getMyBookings = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-32 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className="text-lg font-semibold mb-6">My Bookings</h1>

      {bookings.length > 0 ? (
        bookings.map((item, index) => {
          const movie = item.show?.movie;
          const showDate = item.show?.showDateTime;
          const bookedSeats = item.bookedSeats || [];
          const amount = item.amount || "—";
          const isPaid = item.isPaid || false;

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between bg-primary/10 rounded-lg mt-4 p-3 max-w-3xl"
            >
              {/* Movie Poster */}
              <img
                src={movie?.poster_path || "/placeholder.jpg"}
                alt={movie?.title || "Untitled"}
                className="md:max-w-48 aspect-video h-auto object-cover object-bottom rounded"
              />

              {/* Booking Details */}
              <div className="flex flex-col p-4 flex-1">
                <p className="text-lg font-semibold">{movie?.title || "Untitled"}</p>
                <p className="text-gray-400 text-sm">
                  {timeFormat(movie?.runtime || 0)}
                </p>
                <p className="text-gray-400 text-sm mt-auto">
                  {showDate ? dateFormat(showDate) : "N/A"}
                </p>
                <div className="text-sm mt-2">
                  <p>
                    <span className="text-gray-400">Total tickets: </span>
                    {bookedSeats.length}
                  </p>
                  <p>
                    <span className="text-gray-400">Seat numbers: </span>
                    {bookedSeats.join(", ") || "N/A"}
                  </p>
                </div>
              </div>

              {/* Price + Payment */}
              <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                <div className="flex items-center gap-4">
                  <p className="font-semibold">
                    {currency}
                    {amount}
                  </p>
                  {!isPaid && (
                    <Link to = {item.paymentLink}className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
                      Pay Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-400 mt-4">No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookings;
