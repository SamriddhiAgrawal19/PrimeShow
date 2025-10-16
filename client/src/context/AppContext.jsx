import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favouriteMovies, setFavouriteMovies] = useState([]);

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
  try {
    const token = await getToken();
    
    console.log("Frontend token:", token);

    const { data } = await axios.get("/api/admin/is-admin", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setIsAdmin(data.isAdmin);
  } catch (err) {
    console.log("fetchIsAdmin error:", err.message);
  }
};


  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/shows/all");
      if (data.success) setShows(data.shows);
    } catch (err) {
      console.log("fetchShows error:", err.message);
    }
  };

  const fetchFavouriteMovies = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const { data } = await axios.get("/api/user/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setFavouriteMovies(data.movies);
    } catch (err) {
      if (!err.message.includes("A valid resource ID is required")) {
        toast.error(err.message);
      }
      console.log("fetchFavouriteMovies error:", err.message);
    }
  };

  useEffect(() => { fetchShows(); }, []);
  useEffect(() => { if (user) { fetchIsAdmin(); fetchFavouriteMovies(); } }, [user]);

  const value = { axios, fetchIsAdmin, user, getToken, isAdmin, shows, favouriteMovies, fetchFavouriteMovies };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
export const useAppContext = () => useContext(AppContext);
export { AppContext };
