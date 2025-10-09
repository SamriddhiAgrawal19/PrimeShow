import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { dummyShowsData } from "../assets/assets";

const FeaturedSection = () => {
  const navigate = useNavigate();

  return (
    // FIX APPLIED: Removed '-mt-16' and added 'pt-20' for a large, clear separation gap.
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 overflow-visible pt-20 bg-black text-white"> 
      
      {/* Header Row */}
      <div className="relative flex items-center justify-between pt-12 pb-6">
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>

        {/* View All + Blur Circle */}
        <div className="relative flex items-center">
          
          {/* Blur Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 z-0 pointer-events-none">
            <BlurCircle />
          </div>

          {/* Button */}
          <button
            onClick={() => navigate("/movies")}
            className="relative z-10 group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
          >
            View All
            <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Movie Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {dummyShowsData.slice(0, 8).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;