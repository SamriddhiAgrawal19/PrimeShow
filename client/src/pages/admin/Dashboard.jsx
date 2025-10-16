import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  UserIcon,
  StarIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import dateFormat from "../../lib/DateFormat";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const { axios , getToken } = useAppContext();
  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeShows: [],
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

 const fetchDashboardData = async () => {
  try {
    const token = await getToken();
    const { data: dashboardRes } = await axios.get('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { data: moviesRes } = await axios.get("/api/shows/now-playing");

    if (dashboardRes?.success && moviesRes?.success) {
      setDashboard({
        totalRevenue: dashboardRes.dashboardData?.totalRevenue || 0,
        totalBookings: dashboardRes.dashboardData?.totalBookings || 0,
        totalUsers: dashboardRes.dashboardData?.totalUser || 0,
        activeShows: moviesRes.movies || [], // now playing movies
      });
    }
    setLoading(false);
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    setLoading(false);
  }
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
    { title: "Total Bookings", value: dashboard.totalBookings, icon: ChartLineIcon },
    { title: "Active Shows", value: dashboard.activeShows.length, icon: PlayCircleIcon },
    { title: "Total Users", value: dashboard.totalUsers, icon: UserIcon },
  ];

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />
      <BlurCircle top="-80px" left="-60px" size="250px" color="rgba(255,255,255,0.04)" />
      <BlurCircle bottom="-100px" right="-80px" size="200px" color="rgba(255,255,255,0.03)" />

      <div className="relative mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {dashboardCards.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-6 py-5 bg-primary/10 border border-primary/40 rounded-xl text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300 relative overflow-hidden"
            >
              {index === 0 && <BlurCircle top="-10px" right="-10px" size="80px" color="rgba(255,255,255,0.03)" />}
              <div>
                <h1 className="text-sm opacity-90">{item.title}</h1>
                <p className="text-xl font-semibold mt-1">{item.value}</p>
              </div>
              <item.icon className="w-7 h-7 text-white" />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 text-lg font-semibold text-white relative z-10">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-5 max-w-5xl">
        <BlurCircle top="-40px" left="-30px" size="150px" color="rgba(255,255,255,0.02)" />
        <BlurCircle bottom="-30px" right="-50px" size="120px" color="rgba(255,255,255,0.02)" />

        {dashboard.activeShows.map((show, index) => (
          <div
            key={index}
            className="w-60 rounded-xl overflow-hidden pb-3 bg-primary/20 border border-primary/40 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-md relative"
          >
            <img
              src={show.poster_path || "/placeholder.jpg"}
              alt={show.title}
              className="w-full object-cover h-65 brightness-50 hover:brightness-100 transition-all duration-300"
            />
            <p className="font-semibold p-2 truncate text-white">{show.title}</p>

            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-bold text-white">{currency} {show.showPrice || 0}</p>
              <p className="flex items-center gap-1 text-sm text-gray-300 mt-1 pr-1">
                <StarIcon className="w-4 h-4 fill-primary text-primary" />
                {show.vote_average?.toFixed(1) || "N/A"}
              </p>
            </div>

            {show.showDateTime && (
              <p className="px-2 pt-2 text-sm text-gray-300">{dateFormat(show.showDateTime)}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
