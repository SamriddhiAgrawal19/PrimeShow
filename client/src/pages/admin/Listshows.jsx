import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import dateFormat from "../../lib/DateFormat";
import BlurCircle from "../../components/BlurCircle";
import { useAppContext } from "../../context/AppContext";

const Listshows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const { axios } = useAppContext();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllData = async () => {
    try {
      const showsRes = await axios.get("/api/admin/all-shows");
      if (!showsRes.data.success) throw new Error("Failed to fetch shows");

      const allShows = showsRes.data.shows;

      const bookingsRes = await axios.get("/api/admin/all-bookings");
      const allBookings = bookingsRes.data.success
        ? bookingsRes.data.bookings.filter(b => b.isPaid && b.show)
        : [];

      const showsWithData = await Promise.all(
        allShows.map(async (show) => {
          let movieTitle = "N/A";

          try {
            const movieRes = await axios.get(`/api/shows/${show.movieId}`);
            if (movieRes.data.success && movieRes.data.movie) {
              movieTitle = movieRes.data.movie.title;
            }
          } catch (err) {
            console.error("Error fetching movie title for show", show._id, err);
          }

          const relatedBookings = allBookings.filter(b => b.show._id === show._id);
          const totalBookings = relatedBookings.length;
          const totalEarnings = relatedBookings.reduce((acc, b) => acc + (b.amount || 0), 0);

          return {
            ...show,
            movieTitle,
            totalBookings,
            totalEarnings,
          };
        })
      );

      setShows(showsWithData);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  if (loading) return <Loading />;

  return (
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
            {shows.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/20 hover:bg-primary/10 text-white bg-primary/8"
              >
                <td className="p-2 pl-5 flex items-center gap-3">
                  {item.movieTitle}
                </td>
                <td className="p-2">{dateFormat(item.showDateTime)}</td>
                <td className="p-2">{item.totalBookings || 0}</td>
                <td className="p-2">
                  {currency} {item.totalEarnings || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Listshows;
