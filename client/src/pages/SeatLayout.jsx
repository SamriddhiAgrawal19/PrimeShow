import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData, assets } from "../assets/assets";
import { ClockIcon, ArrowRight } from "lucide-react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { toast } from "react-hot-toast";
import isoTimeFormat from "../components/isoTimeFormat";

const SeatLayout = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const getShow = async () => {
    const foundShow = dummyShowsData.find((show) => show._id === id);
    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData,
      });
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first");
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select up to 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
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

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 md:pt-32 text-white">
      {/* Sidebar - Timings */}
      <div className="w-full md:w-60 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-20">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-2">
          {show.dateTime[date]?.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition-all ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white font-semibold"
                  : "hover:bg-primary/20 text-gray-300"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
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
          
          {/* A and B Rows */}
          <div className="flex flex-col gap-2 mb-12">
            {renderSeats('A', 1, 9)}
            {renderSeats('B', 1, 9)}
          </div>

          {/* C, D, E, F Rows */}
          <div className="flex flex-col gap-2 mb-12">
            <div className="flex gap-16">
              {renderSeats('C', 1, 9)}
              {renderSeats('E', 1, 9)}
            </div>
            <div className="flex gap-16">
              {renderSeats('D', 1, 9)}
              {renderSeats('F', 1, 9)}
            </div>
          </div>

          {/* G, H, I, J Rows */}
          <div className="flex flex-col gap-2 mb-12">
            <div className="flex gap-16">
              {renderSeats('G', 1, 9)}
              {renderSeats('I', 1, 9)}
            </div>
            <div className="flex gap-16">
              {renderSeats('H', 1, 9)}
              {renderSeats('J', 1, 9)}
            </div> 
          </div>

          {/* Proceed to Checkout Button */}
          <button
            onClick={() => navigate("/my-bookings")}
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
