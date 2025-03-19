"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";

export default function CategorySearchPage() {
  const [doctors, setDoctors] = useState([]);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Function to fetch doctor data
  function getDoctorData() {
    return [
      { id: 1, name: "Dr. Aarav Mehta", specialization: "Cardiologist", experience: "15+ years", education: "MBBS, MD (Cardiology) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080437/f3iw2tfcvve32tn3uzwo.webp" },
      { id: 2, name: "Dr. Sophia Rao", specialization: "Dermatologist", experience: "10+ years", education: "MBBS, MD (Dermatology) - Manipal University", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080751/kp9c1nxmqvsq8pq06z3q.avif" },
      { id: 9, name: "Dr. Priya Sharma", specialization: "Dermatologist", experience: "12+ years", education: "MBBS, MD (Dermatology) - KEM Hospital", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523909/mhrsf70idkxavirlwk0c.jpg" },
      { id: 3, name: "Dr. Rohan Sharma", specialization: "Orthopedic", experience: "12+ years", education: "MBBS, MS (Orthopedics) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081519/r9mxynyo58o1mytudule.jpg" },
      { id: 4, name: "Dr. Karan Patel", specialization: "Neurologist", experience: "18+ years", education: "MBBS, DM (Neurology) - CMC Vellore", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081036/fvgq0koechd7hzfbyjru.webp" },
      { id: 5, name: "Dr. Rajiv Menon", specialization: "Otology", experience: "14+ years", education: "MBBS, MS (ENT) - JIPMER", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081889/zd3xhyvxh93kwojkw6xp.jpg" },
      { id: 6, name: "Dr. Meera Das", specialization: "General Doctor", experience: "8+ years", education: "MBBS - Government Medical College", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081738/ibcppbgwkbjbs6ptkn8o.avif" },
      { id: 7, name: "Dr. Ananya Singh", specialization: "Surgeon", experience: "20+ years", education: "MBBS, MS (General Surgery) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523656/dxlgqsswqc3lgorzgp6c.jpg" },
      { id: 8, name: "Dr. Vikram Rao", specialization: "Psychotropic", experience: "16+ years", education: "MBBS, MD (Psychiatry) - NIMHANS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523821/uyrj8muyinx6wgzazcxj.jpg" },
      { id: 10, name: "Dr. Neha Kapoor", specialization: "Eye Specialist", experience: "11+ years", education: "MBBS, MS (Ophthalmology) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523909/mhrsf70idkxavirlwk0c.jpg" },
      { id: 11, name: "Dr. Anjali Desai", specialization: "Dermatologist", experience: "9+ years", education: "MBBS, MD (Dermatology) - PGIMER", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080751/kp9c1nxmqvsq8pq06z3q.avif" }
    ];
  }

  useEffect(() => {
    // Extract category from URL pathname
    const path = window.location.pathname;
    const extractedCategory = path.split('/').pop().replace(/-/g, ' ');
    
    // Convert to title case for display
    const formattedCategory = extractedCategory
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    setCategory(formattedCategory);
    
    // Filter doctors based on category
    const allDoctors = getDoctorData();
    const filteredDoctors = allDoctors.filter(
      doc => doc.specialization.toLowerCase() === formattedCategory.toLowerCase()
    );
    
    setDoctors(filteredDoctors);
  }, []);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.education.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push('/')}
          className="mr-4 flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {category} Specialists
        </h1>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex items-center bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder={`Search ${category} doctors...`}
          className="w-full p-2 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Found {filteredDoctors.length} {category} specialists
        </p>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition">
              <Image 
                src={doctor.image} 
                alt={doctor.name} 
                width={300} 
                height={300} 
                className="w-full h-48 object-cover rounded-md" 
                unoptimized 
              />
              <h3 className="mt-3 text-lg font-semibold text-gray-800 text-center">{doctor.name}</h3>
              <p className="text-xs font-medium text-center bg-blue-50 text-blue-700 py-1 px-3 rounded-full mt-2">
                {doctor.specialization}
              </p>
              <p className="text-sm font-bold text-yellow-700 bg-yellow-100 py-1 px-2 rounded-md text-center mt-2">
                ⏳ {doctor.experience}
              </p>
              <p className="text-xs text-gray-500 text-center mt-1 italic">
                🎓 {doctor.education}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-sm"
                  onClick={() => router.push(`/details/${doctor.id}`)}
                >
                  View Profile
                </button>
                <button
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition text-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500 text-lg">No {category} specialists found.</p>
            <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Return to homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}