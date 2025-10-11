import React, { useEffect, useState } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import dateFormat from '../../lib/DateFormat';
import BlurCircle from '../../components/BlurCircle';

const Listshows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      // Simulating API data
      setShows([
        {
          movie: dummyShowsData[0],
          showDateTime: "2023-10-10T18:30:00Z",
          showPrice: 150,
          occupiedSeats: {
            A1: "user1",
            A2: "user2",
            B1: "user3",
            B2: "user4",
            C1: "user5",
            C2: "user6",
          },
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shows:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllShows();
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />

      {/* Container with blur circles */}
      <div className="relative max-w-4xl mt-6 mx-auto overflow-x-auto">
        {/* Decorative Blur Circles */}
        <BlurCircle top="-20px" left="-20px" />
        <BlurCircle bottom="-20px" right="-20px" />

        <table className="w-full border-collapse rounded-md overflow-hidden relative z-10">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie name</th>
              <th className="p-2 font-medium">Show time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {shows.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 hover:bg-primary/10 text-white bg-primary/8"
              >
                <td className="p-2 pl-5 flex items-center gap-3">
                  {item.movie.title}
                </td>
                <td className="p-2">{dateFormat(item.showDateTime)}</td>
                <td className="p-2">{Object.keys(item.occupiedSeats).length}</td>
                <td className="p-2">
                  {currency}{" "}
                  {Object.keys(item.occupiedSeats).length * item.showPrice}
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

export default Listshows;
