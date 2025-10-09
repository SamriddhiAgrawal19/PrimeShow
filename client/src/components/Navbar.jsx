import { MenuIcon, SearchIcon, XIcon,TicketPlus } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const{user} = useUser();
  const{openSignIn} = useClerk();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      {/* Logo */}
      <div>
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo1} alt="QuickShow" className="w-36 h-auto" />
      </Link>
      </div>

      {/* Menu Links */}
      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium 
        max-md:text-lg z-50 flex flex-col md:flex-row items-center 
        max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen 
        md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 
        md:border md:ml-52 border-gray-300/20 overflow-hidden transition-all duration-300 ${menuOpen ? 'max-md:w-full' :'max-md:w-0'}`}>
        {/* Close Button for Mobile */}
        <XIcon
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
        />
        <Link to="/" onClick={() => {scrollTo(0,0) , setMenuOpen(false)}}>Home</Link>
        <Link to="/movies" onClick={() => {scrollTo(0,0) , setMenuOpen(false)}}>Movies</Link>
        <Link to="/theatres" onClick={() => {scrollTo(0,0) , setMenuOpen(false)}}>Theatres</Link>
        <Link to="/releases" onClick={() => {scrollTo(0,0) , setMenuOpen(false)}}>Releases</Link>
        <Link to="/favourite" onClick={() => {scrollTo(0,0) , setMenuOpen(false)} }>Favourites</Link>
      </div>

      {/* Right Side (Search + Login) */}
      <div className="flex items-center gap-4 ml-auto">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
        {!user ? ( 
          <button onClick={() => openSignIn()} className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer">
            Login
          </button>
        ) : (
          <UserButton >
            <UserButton.MenuItems>
              <UserButton.Action label = "My Bookings" labelIcon = {<TicketPlus width = {15} />} onClick={() => {navigate('/my-bookings')}} />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <MenuIcon
        onClick={() => setMenuOpen(true)}
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
      />
    </div>
  );
};

export default Navbar;
