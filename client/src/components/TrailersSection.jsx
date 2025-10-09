import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  // ✅ Convert to proper embed format if needed
  const getEmbedUrl = (url) => {
    if (url.includes("embed/")) return url;
    if (url.includes("watch?v="))
      return url.replace("watch?v=", "embed/") + "?autoplay=1&mute=1";
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1&mute=1";
    return url + "?autoplay=1&mute=1";
  };

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-black text-white overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto mb-6">
        Trailers
      </p>

      {/* Blur Effect */}
      <div className="absolute -top-20 -right-20 w-48 h-48 z-10 pointer-events-none">
        <BlurCircle />
      </div>

      {/* ✅ Video Player */}
      <div className="relative max-w-[960px] mx-auto mt-6">
        <div className="relative pt-[56.25%] w-full rounded-lg overflow-hidden shadow-2xl">
          <iframe
            key={currentTrailer.videoUrl}
            className="absolute top-0 left-0 w-full h-full"
            src={getEmbedUrl(currentTrailer.videoUrl)}
            title="YouTube trailer player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* ✅ Trailer Thumbnails */}
      <div className="flex flex-wrap justify-center gap-12 mt-10 max-w-[960px] mx-auto">
        {dummyTrailers.map((trailer, index) => (
          <div
            key={index}
            onClick={() => setCurrentTrailer(trailer)}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
              currentTrailer.videoUrl === trailer.videoUrl
                ? "ring-4 ring-blue-500"
                : "ring-2 ring-transparent"
            }`}
          >
            <img
              src={trailer.image}
              alt={`Trailer ${index + 1}`}
              className="w-40 h-24 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-medium">
              ▶ Play
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
