import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import dateFormat from '../../lib/DateFormat';
import BlurCircle from '../../components/BlurCircle';
import { useAppContext } from '../../context/AppContext';

const Listshows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { axios } = useAppContext();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/shows/all");
      if (data.success) {
        const formattedShows = data.shows.flatMap((movieGroup) =>
          movieGroup.shows.map((show) => ({
            movie: movieGroup.movie || {},
            showDateTime: show.showDateTime || new Date(),
            showPrice: show.showPrice || 0,
            occupiedSeats: show.occupiedSeats || {},
          }))
        );
        setShows(formattedShows);
      }
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

      <div className="relative max-w-4xl mt-6 mx-auto overflow-x-auto">
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
            {shows.map((item, index) => {
              const totalBookings = Object.keys(item.occupiedSeats || {}).length;
              const earnings = totalBookings * (item.showPrice || 0);

              return (
                <tr
                  key={index}
                  className="border-b border-primary/20 hover:bg-primary/10 text-white bg-primary/8"
                >
                  <td className="p-2 pl-5 flex items-center gap-3">
                    {item.movie.title || "N/A"}
                  </td>
                  <td className="p-2">{dateFormat(item.showDateTime)}</td>
                  <td className="p-2">{totalBookings}</td>
                  <td className="p-2">
                    {currency} {earnings}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Listshows;
