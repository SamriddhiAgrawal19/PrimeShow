import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UserIcon,
  StarIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { dummyDashboardData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import dateFormat from "../../lib/DateFormat";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeShows: [],
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const data = dummyDashboardData;
    setDashboard({
      totalRevenue: data.totalRevenue,
      totalBookings: data.totalBookings,
      totalUsers: data.totalUser || 0, // fixed key
      activeShows: data.activeShows || [],
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dashboardCards = [
    {
      title: "Total Revenue",
      value: `${currency} ${dashboard.totalRevenue}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Total Bookings",
      value: dashboard.totalBookings,
      icon: ChartLineIcon,
    },
    {
      title: "Active Shows",
      value: dashboard.activeShows.length,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: UserIcon,
    },
  ];

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {/* Dashboard Summary Cards */}
      <div className="relative mt-8">
        <BlurCircle top="-100px" left="0" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {dashboardCards.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-6 py-5 bg-primary/10 border border-primary/40 rounded-xl text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300"
            >
              <div>
                <h1 className="text-sm opacity-90">{item.title}</h1>
                <p className="text-xl font-semibold mt-1">{item.value}</p>
              </div>
              <item.icon className="w-7 h-7 text-white" />
            </div>
          ))}
        </div>
      </div>

      {/* Active Shows Section */}
      <p className="mt-12 text-lg font-semibold text-white">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-5 max-w-5xl">
        {dashboard.activeShows.map((show, index) => (
          <div
            key={index}
            className="w-60 rounded-xl overflow-hidden pb-3 bg-primary/20 border border-primary/40 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-md text-white"
          >
            <img
              src={show.movie.poster_path || "/placeholder.jpg"}
              alt={show.movie.title}
              className="w-full object-cover h-65"
            />
            <p className="font-semibold p-2 truncate">{show.movie.title}</p>

            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-bold">
                {currency} {show.showPrice}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-300 mt-1 pr-1">
                <StarIcon className="w-4 h-4 fill-primary text-primary" />
                {show.movie.vote_average?.toFixed(1) || "N/A"}
              </p>
            </div>

            <p className="px-2 pt-2 text-sm text-gray-300">
              {dateFormat(show.showDateTime)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
