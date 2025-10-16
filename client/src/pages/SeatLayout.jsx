import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ClockIcon, ArrowRight } from "lucide-react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { toast } from "react-hot-toast";
import isoTimeFormat from "../components/isoTimeFormat";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "@clerk/clerk-react";

const SeatLayout = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const { getToken } = useAuth(); // ✅ Hook inside component

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch show details
  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/shows/${id}`);
      if (data.success) {
        setShow({
          movie: data.movieId,
          dateTime: data.dateTime,
        });
      } else {
        toast.error("Show not found");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch show");
      setLoading(false);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast.error("Please select a time first");

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast.error("You can only select up to 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  // Handle booking
  const handleBooking = async () => {
    if (!selectedTime) return toast.error("Please select a show time");
    if (selectedSeats.length === 0) return toast.error("Please select at least one seat");

    try {
      const token = await getToken({ template: "default" }); // get Clerk token
      const { data } = await axios.post(
        "/api/booking/create",
        {
          showId: selectedTime.showId,
          selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Booking created successfully!");
        navigate("/my-bookings");
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  // Render seats
  const renderSeats = (row, start, end) => (
    <div key={`${row}-${start}`} className="flex gap-2">
      {Array.from({ length: end - start + 1 }, (_, i) => {
        const seatId = `${row}${start + i}`;
        const isSelected = selectedSeats.includes(seatId);

        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            className={`h-8 w-8 rounded border border-primary/60 cursor-pointer flex items-center justify-center text-sm font-medium
              ${isSelected ? "bg-primary text-white" : "text-gray-400 bg-transparent hover:bg-primary/20 hover:text-white"}`}
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );

  if (loading) return <Loading />;
  if (!show)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Show not found
      </div>
    );

  return (
  <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 md:pt-32 text-white">
    {/* Sidebar - Timings */}
    <div className="w-full md:w-60 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-20">
      <p className="text-lg font-semibold px-6">Available Timings</p>
      <div className="mt-5 space-y-2">
        {show.dateTime?.find((d) => d.date === date)?.times?.length > 0 ? (
          show.dateTime
            .find((d) => d.date === date)
            .times.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedTime({
                    ...item,
                    showId: show.movie._id,
                  })
                }
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition-all ${
                  selectedTime?.time === item.time
                    ? "bg-primary text-white font-semibold"
                    : "hover:bg-primary/20 text-gray-300"
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))
        ) : (
          <p className="text-sm text-gray-400 px-6">No timings available for this date</p>
        )}
      </div>
    </div>

    {/* Seat Layout */}
    <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle bottom="0" right="0" />
      <h1 className="text-2xl font-semibold mb-4">Select Your Seats</h1>
      <img src={assets.screenImage} alt="screen" />
      <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

      <div className="flex flex-col items-center text-gray">
        {/* Rows */}
        <div className="flex flex-col gap-2 mb-12">
          {renderSeats("A", 1, 9)}
          {renderSeats("B", 1, 9)}
        </div>

        <div className="flex flex-col gap-2 mb-12">
          <div className="flex gap-16">
            {renderSeats("C", 1, 9)}
            {renderSeats("E", 1, 9)}
          </div>
          <div className="flex gap-16">
            {renderSeats("D", 1, 9)}
            {renderSeats("F", 1, 9)}
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-12">
          <div className="flex gap-16">
            {renderSeats("G", 1, 9)}
            {renderSeats("I", 1, 9)}
          </div>
          <div className="flex gap-16">
            {renderSeats("H", 1, 9)}
            {renderSeats("J", 1, 9)}
          </div>
        </div>

        <button
          onClick={handleBooking}
          className="flex items-center gap-2 bg-primary px-6 py-3 rounded-full text-white font-semibold mt-8 hover:bg-primary/90 transition"
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

};

export default SeatLayout;
