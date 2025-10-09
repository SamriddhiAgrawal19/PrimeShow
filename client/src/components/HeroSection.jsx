import React from "react";
import { CalendarIcon, ClockIcon, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const movieData = {
      titlePart1: "Guardians",
      titlePart2: "of the Galaxy",
      genres: ["Action", "Adventure", "Sci-Fi"],
      year: "2023",
      duration: "2h 30m",
      description: "A group of intergalactic misfits unite to face a cosmic threat that could destroy the universe. Humor, action, and heart collide in this epic finale to the Guardians saga.",
  };

  return (
    <div
      className="relative flex items-center h-screen bg-cover bg-center px-6 md:px-20"
      style={{
        backgroundImage: "url('/backgroundImage.png')", 
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Bottom Fade - Strong fade from bottom up */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent z-10"></div>

      {/* Content */}
      <div className="relative flex flex-col gap-4 text-left text-white max-w-xl z-20">
        
        {/* Logo - Smaller and positioned closer to the title */}
        <img
          src={assets.marvelLogo} 
          alt="Marvel Studios Logo"
          className="h-8 md:h-10 object-contain w-fit mb-4" 
        />

        {/* Movie Title - Split across two lines and less bold */}
        <div className="flex flex-col gap-0">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-none drop-shadow-lg">
            {movieData.titlePart1}
          </h1>
          {/* FIX APPLIED HERE: Changed tracking-tight to tracking-wide for more horizontal space, and kept mt-1 */}
          <h2 className="text-4xl md:text-5xl font-medium tracking-wide leading-tight drop-shadow-lg mt-1"> 
            {movieData.titlePart2}
          </h2>
        </div>
        
        {/* Metadata Block - Simplified and compact */}
        <div className="flex flex-wrap items-center gap-4 text-gray-300 text-base md:text-lg tracking-wide mt-2">
          {/* Genres separated by pipes */}
          <span className="font-medium">
            {movieData.genres.join(' | ')}
          </span>
          
          {/* Year and Duration */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <span>{movieData.year}</span>
          </div>

          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <span>{movieData.duration}</span>
          </div>
        </div>


        {/* Description - Standard size, white text */}
        <p className="text-base md:text-lg text-white max-w-xl leading-relaxed mt-4 opacity-90">
          {movieData.description}
        </p>

        {/* Explore Button - Reverted to your specified class name style */}
        <button
          onClick={() => navigate("/movies")}
          className="px-4 py-2 bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer mt-6 w-fit"
        >
          Explore Movies 
        </button>
      </div>
    </div>
  );
};

export default HeroSection;