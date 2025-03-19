"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Doctor details
const doctorsData = [
  { id: 1, name: "Dr. Aarav Mehta", specialization: "Cardiologist", experience: "15+ years", education: "MBBS, MD (Cardiology) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080437/f3iw2tfcvve32tn3uzwo.webp" },
  { id: 2, name: "Dr. Sophia Rao", specialization: "Dermatologist", experience: "10+ years", education: "MBBS, MD (Dermatology) - Manipal University", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080751/kp9c1nxmqvsq8pq06z3q.avif" },
  { id: 3, name: "Dr. Rohan Sharma", specialization: "Orthopedic", experience: "12+ years", education: "MBBS, MS (Orthopedics) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081519/r9mxynyo58o1mytudule.jpg" },
  { id: 4, name: "Dr. Karan Patel", specialization: "Neurologist", experience: "18+ years", education: "MBBS, DM (Neurology) - CMC Vellore", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081036/fvgq0koechd7hzfbyjru.webp" },
  { id: 5, name: "Dr. Rajiv Menon", specialization: "Otology", experience: "14+ years", education: "MBBS, MS (ENT) - JIPMER", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081889/zd3xhyvxh93kwojkw6xp.jpg" },
  { id: 6, name: "Dr. Meera Das", specialization: "General Doctor", experience: "8+ years", education: "MBBS - Government Medical College", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741081738/ibcppbgwkbjbs6ptkn8o.avif" },
  { id: 7, name: "Dr. Ananya Singh", specialization: "Surgeon", experience: "20+ years", education: "MBBS, MS (General Surgery) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523656/dxlgqsswqc3lgorzgp6c.jpg" },
  { id: 8, name: "Dr. Vikram Rao", specialization: "Psychotropic", experience: "16+ years", education: "MBBS, MD (Psychiatry) - NIMHANS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523821/uyrj8muyinx6wgzazcxj.jpg" },
  { id: 9, name: "Dr. Neha Kapoor", specialization: "Eye Specialist", experience: "11+ years", education: "MBBS, MS (Ophthalmology) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741523909/mhrsf70idkxavirlwk0c.jpg" }
];

// Specializations categories
const specializations = [
  "All", "Cardiologist", "Dermatologist", "Orthopedic", "Neurologist",
  "Otology", "General Doctor", "Surgeon", "Psychotropic", "Eye Specialist"
];

const DoctorsList = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Filter doctors based on selected specialization
  const filteredDoctors = selectedSpecialization === "All"
    ? doctorsData
    : doctorsData.filter(doc => doc.specialization === selectedSpecialization);

  return (
    <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto py-8 px-4">
      
      {/* Sidebar */}
      <aside className="md:w-1/4 mb-6 md:mb-0">
        <button 
          className="md:hidden w-full bg-blue-500 text-white py-2 rounded-lg mb-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Hide Specializations" : "Show Specializations"}
        </button>

        <div className={`md:block ${menuOpen ? "block" : "hidden"} bg-gray-100 p-4 rounded-lg`}>
          <h3 className="text-lg font-bold mb-3">Specializations</h3>
          {specializations.map(spec => (
            <button
              key={spec}
              className={`block w-full p-2 text-left rounded-lg transition ${
                selectedSpecialization === spec ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
              onClick={() => {
                setSelectedSpecialization(spec);
                setMenuOpen(false);
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </aside>

      {/* Doctor List */}
      <section className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => router.push(`/details/${doctor.id}`)}

              >
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 text-lg">No doctors found.</p>
        )}
      </section>
    </div>
  );
};

export default DoctorsList;