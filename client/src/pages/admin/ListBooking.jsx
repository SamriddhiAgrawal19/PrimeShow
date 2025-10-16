import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import dateFormat from '../../lib/DateFormat';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { useAppContext } from '../../context/AppContext';

const ListBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { axios, getToken } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/admin/all-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Bookings" />

      <div className="relative max-w-5xl mt-6 mx-auto overflow-x-auto p-4 rounded-md bg-black/30 border border-gray-700">
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
            {Array.isArray(bookings) && bookings.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 hover:bg-primary/10 text-white bg-primary/8 transition-colors duration-200"
              >
                <td className="p-2 pl-5">
                  {item.user?.firstName} {item.user?.name}
                </td>
                <td className="p-2">{item.show?.movie?.title}</td>
                <td className="p-2">{dateFormat(item.show?.showDateTime)}</td>
                <td className="p-2">
                  {item.bookedSeats
                    ? Object.keys(item.bookedSeats)
                        .map((seat) => item.bookedSeats[seat])
                        .join(", ")
                    : "-"}
                </td>
                <td className="p-2">
                  {currency} {item.amount || 0}
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
