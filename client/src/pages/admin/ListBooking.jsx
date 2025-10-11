import React, { useEffect, useState } from 'react';
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import dateFormat from '../../lib/DateFormat';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';

const ListBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    setBookings(dummyBookingData);
    setLoading(false);
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Bookings" />

      <div className="relative max-w-5xl mt-6 mx-auto overflow-x-auto p-4 rounded-md bg-black/30 border border-gray-700">
        {/* Decorative Blur Circles */}
        <BlurCircle top="-20px" left="-20px" />
        <BlurCircle bottom="-20px" right="-20px" />

        <table className="w-full border-collapse rounded-md overflow-hidden relative z-10">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 hover:bg-primary/10 text-white bg-primary/8 transition-colors duration-200"
              >
                <td className="p-2 pl-5">
                  {item.user.firstName} {item.user.name}
                </td>
                <td className="p-2">{item.show.movie.title}</td>
                <td className="p-2">{dateFormat(item.show.showDateTime)}</td>
                <td className="p-2">
                  {Object.keys(item.bookedSeats)
                    .map((seat) => item.bookedSeats[seat])
                    .join(", ")}
                </td>
                <td className="p-2">
                  {currency} {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListBooking;
