import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";

const Favourite = () => {
  const { axios, getToken } = useAppContext();
  const [favourites, setFavourites] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  const fetchFavourites = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setFavourites(data.movies || []);
      else toast.error("Failed to fetch favourite movies");
    } catch (err) {
      console.error("Error fetching favourites:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (movieId) => {
    setSelected((prev) => ({ ...prev, [movieId]: !prev[movieId] }));
  };

  const handleRemoveSelected = async () => {
    const selectedIds = Object.keys(selected).filter((id) => selected[id]);
    if (!selectedIds.length) return;

    setRemoving(true);
    try {
      const token = await getToken();
      await Promise.all(
        selectedIds.map((movieId) =>
          axios.post(
            "/api/user/remove-favourite",
            { movieId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      toast.success("Selected movies removed from favourites");
      setFavourites((prev) => prev.filter((m) => !selectedIds.includes(m._id)));
      setSelected({});
      setSelectMode(false);
    } catch (err) {
      console.error("Error removing favourites:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setRemoving(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  if (loading) return <Loading />;
  if (!favourites.length)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
      </div>
    );

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" right="50px" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-medium">Your Favourite Movies</h1>
        <button
          onClick={() => setSelectMode(!selectMode)}
          className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dull transition"
        >
          {selectMode ? "Cancel" : "Select Movies"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map((movie) => (
          <div key={movie._id} className="relative group">
            {selectMode && (
              <input
                type="checkbox"
                checked={!!selected[movie._id]}
                onChange={() => handleSelect(movie._id)}
                className="absolute top-3 left-3 w-6 h-6 rounded bg-primary text-white accent-white z-10"
              />
            )}
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {selectMode && Object.values(selected).some(Boolean) && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRemoveSelected}
            disabled={removing}
            className="px-6 py-2 bg-primary hover:bg-primary-dull text-white font-medium rounded-md transition"
          >
            {removing ? "Removing..." : "Remove Selected"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Favourite;
