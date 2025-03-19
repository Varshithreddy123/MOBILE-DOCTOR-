"use client";
import React, { useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import DoctorsList from "./_components/DoctorsList";

// ✅ Memoized Doctor List to Prevent Unnecessary Re-renders
const MemoizedDoctorsList = React.memo(DoctorsList, (prevProps, nextProps) => {
  return prevProps.selectedCategory === nextProps.selectedCategory;
});

export default function DoctorCategories() {
  const scrollRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Updated Category Data with New Image Links
  const allCategories = useMemo(
    () => [
      {
        title: "Dermatologist",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080751/kp9c1nxmqvsq8pq06z3q.avif",
      },
      {
        title: "Cardiologist",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080437/f3iw2tfcvve32tn3uzwo.webp",
      },
      {
        title: "Orthopedic",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081519/r9mxynyo58o1mytudule.jpg",
      },
      {
        title: "Neurologist",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081036/fvgq0koechd7hzfbyjru.webp",
      },
      {
        title: "Otology",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081889/zd3xhyvxh93kwojkw6xp.jpg",
      },
      {
        title: "General Doctor",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081738/ibcppbgwkbjbs6ptkn8o.avif",
      },
      {
        title: "Surgeon",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523656/dxlgqsswqc3lgorzgp6c.jpg",
      },
      {
        title: "Psychotropic",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523821/uyrj8muyinx6wgzazcxj.jpg",
      },
      {
        title: "Eye Specialist",
        image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523909/mhrsf70idkxavirlwk0c.jpg",
      },
    ],
    []
  );

  // ✅ Filter and Memoize Displayed Categories
  const displayedCategories = useMemo(() => {
    return searchTerm
      ? allCategories.filter((category) =>
          category.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allCategories.slice(0, 4);
  }, [searchTerm, allCategories]);

  // ✅ Optimized Scroll Function
  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="relative px-6 py-10 max-w-screen-lg mx-auto">
      {/* ✅ Search Bar */}
      <div className="mb-6 flex items-center bg-white border border-gray-300 rounded-lg p-2 shadow-md">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full p-2 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Scrollable Categories */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition z-10"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-blue-600" />
        </button>

        {/* ✅ Category List */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-hidden scroll-smooth p-4 bg-gray-50 rounded-lg snap-x snap-mandatory whitespace-nowrap"
        >
          {displayedCategories.length > 0 ? (
            displayedCategories.map((category, index) => (
              <Link key={index} href={`/search/${category.title.toLowerCase().replace(/ /g, "-")}`} passHref>
                <div className="min-w-[140px] md:min-w-[160px] lg:min-w-[180px] flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition snap-center cursor-pointer">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <p className="mt-2 text-sm font-semibold text-gray-700 text-center">
                    {category.title}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">No categories found</p>
          )}
        </div>

        {/* Right Scroll Button */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition z-10"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-blue-600" />
        </button>
      </div>

      {/* ✅ Optimized Doctors List */}
      <MemoizedDoctorsList selectedCategory={searchTerm} />
    </div>
  );
}
