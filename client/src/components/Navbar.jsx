import { MenuIcon, SearchIcon, XIcon, TicketPlus, LogIn } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false); 
  const { user } = useUser();
  const { axios, getToken } = useAppContext();
  const [hasFavourites, setHasFavourites] = useState(false);
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const loginButtonRef = useRef(null);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginButtonRef.current && !loginButtonRef.current.contains(event.target)) {
        setLoginMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkFavourites = async () => {
      if (!user) return;
      try {
        const token = await getToken();
        const { data } = await axios.get("/api/user/favourites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasFavourites(data.success && data.movies.length > 0);
      } catch (err) {
        console.error(err);
      }
    };
    checkFavourites();
  }, [user]);

  const handleAdminLogin = () => {
    setLoginMenuOpen(false); 
    openSignIn({ afterSignInUrl: "/admin" });
  };

  const handleUserLogin = () => {
    setLoginMenuOpen(false); 
    openSignIn({ afterSignInUrl: "/" });
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <div>
        <Link to="/" className="max-md:flex-1">
          <img src={assets.logo1} alt="QuickShow" className="w-36 h-auto" />
        </Link>
      </div>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border md:ml-52 border-gray-300/20 overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
        />
        <Link to="/" onClick={() => { scrollTo(0, 0); setMenuOpen(false); }}>Home</Link>
        <Link to="/movies" onClick={() => { scrollTo(0, 0); setMenuOpen(false); }}>Movies</Link>
        <Link to="/" onClick={() => { scrollTo(0, 0); setMenuOpen(false); }}>Theatres</Link>
        <Link to="/" onClick={() => { scrollTo(0, 0); setMenuOpen(false); }}>Releases</Link>
        {hasFavourites && (
          <Link to="/favourite" onClick={() => { scrollTo(0, 0); setMenuOpen(false); }}>
            Favourites
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
        {!user ? (
          <div ref={loginButtonRef} className="relative">
            <button
              onClick={() => setLoginMenuOpen(!loginMenuOpen)}
              className="flex items-center gap-2 px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
            {loginMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-10 overflow-hidden">
                <button
                  onClick={handleUserLogin}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login as User
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login as Admin
                </button>
              </div>
            )}
          </div>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        onClick={() => setMenuOpen(true)}
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
      />
    </div>
  );
};

export default Navbar;