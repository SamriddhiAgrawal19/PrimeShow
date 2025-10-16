import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ArrowRight } from "lucide-react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const { id, date, time } = useParams();
  const navigate = useNavigate();
  const { axios, getToken } = useAppContext();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/shows/${id}`);
      if (data.success) {
        setShow({
          _id: data.movie._id,
          movie: data.movie,
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

  const handleSeatClick = (seatId) => {
    if (!seatId) return;

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast.error("You can only select up to 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
  if (!selectedSeats.length) return toast.error("Select at least one seat");

  if (!show?.dateTime?.length) return toast.error("No shows available");

  const selectedShow = show.dateTime
    .flatMap((d) => d.times.map((t) => ({ ...t, date: d.date })))
    .find(
      (t) =>
        t.date === date &&
        new Date(t.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) === time
    );

  if (!selectedShow) return toast.error("Invalid show");

  try {
    const token = await getToken();
    const { data } = await axios.post(
      "/api/booking/create",
      {
        showId: selectedShow.showId,
        selectedSeats,
        date,
        time,
        amount: selectedShow.showPrice * selectedSeats.length,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data.success) {
      toast.success("Booking created successfully!");
      navigate("/my-bookings");
    }
  } catch (err) {
    console.error("Booking error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Booking failed");
  }
};


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
    <div className="flex flex-col px-6 md:px-16 lg:px-40 py-20 md:pt-32 text-white">
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle bottom="0" right="0" />

      <h1 className="text-2xl font-semibold mb-4">Select Your Seats</h1>
      <img src={assets.screenImage} alt="screen" />
      <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>

      <div className="flex flex-col items-center text-gray">
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
  );
};

export default SeatLayout;
