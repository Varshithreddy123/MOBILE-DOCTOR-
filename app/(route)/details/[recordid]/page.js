"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import './DOC.css';  // Importing DOC.css from current directory
import { FaFacebook, FaTwitter, FaLinkedin, FaShare, FaThumbsUp, FaStar } from "react-icons/fa";
import BookAppointment from "@/app/(route)/search/_components/BookAppointment";


// Function to fetch doctor data
function getDoctorData() {
  // This would normally be an API call or import from a data file
  return [
    { id: 10, name: "Dr. Aarava Mehta", specialization: "Cardiologist", experience: "doctor not available", education: "MBBS, MD (Cardiology) - AIIMS", image: "https://res.cloudinary.com/dfpw0itu3/image/upload/v1741080437/f3iw2tfcvve32tn3uzwo.webp" },
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
}

// Function to get a specific doctor by ID
function getDoctorById(id) {
  const doctors = getDoctorData();
  return doctors.find(doc => doc.id === id) || null;
}

// Function to get suggested doctors with the same specialization
function getSuggestedDoctors(currentDoctor, limit = 3) {
  if (!currentDoctor) return [];
  
  const doctors = getDoctorData();
  return doctors
    .filter(doc => doc.specialization === currentDoctor.specialization && doc.id !== currentDoctor.id)
    .slice(0, limit);
}

// Function to save reviews to localStorage
function saveReviews(doctorId, reviews) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`doctor_reviews_${doctorId}`, JSON.stringify(reviews));
  }
}

// Function to load reviews from localStorage
function loadReviews(doctorId) {
  if (typeof window !== "undefined") {
    const savedReviews = localStorage.getItem(`doctor_reviews_${doctorId}`);
    return savedReviews ? JSON.parse(savedReviews) : [];
  }
  return [];
}

// Function to save like status and count
function saveLikeStatus(doctorId, liked, count) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`doctor_like_${doctorId}`, JSON.stringify({ liked, count }));
  }
}

// Function to load like status and count
function loadLikeStatus(doctorId) {
  if (typeof window !== "undefined") {
    const savedLike = localStorage.getItem(`doctor_like_${doctorId}`);
    return savedLike ? JSON.parse(savedLike) : { liked: false, count: 42 };
  }
  return { liked: false, count: 42 };
}

export default function DoctorDetailsPage() {
  const [doctor, setDoctor] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [activeTab, setActiveTab] = useState('Document');
  const [suggestedDoctors, setSuggestedDoctors] = useState([]);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [address, setAddress] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const tabs = ['Document', 'Both', 'Canvas'];
  const router = useRouter();
  
  // Get recordId from URL and fetch doctor data
  useEffect(() => {
    // Extract recordId from URL pathname
    const path = window.location.pathname;
    const id = parseInt(path.split('/').pop(), 10);
    setRecordId(id);
    
    // Get doctor data by ID
    const selectedDoctor = getDoctorById(id);
    if (selectedDoctor) {
      setDoctor(selectedDoctor);
      
      // Get suggested doctors
      const related = getSuggestedDoctors(selectedDoctor);
      setSuggestedDoctors(related);

      // Load saved reviews for this doctor
      const savedReviews = loadReviews(id);
      // Only use mock data if there are no saved reviews
      if (savedReviews.length > 0) {
        setReviews(savedReviews);
      } else {
        // Mock reviews data as fallback
        setReviews([
          { id: 1, name: "Rahul Gupta", rating: 5, comment: "Excellent doctor! Very knowledgeable and caring.", date: "March 10, 2025" },
          { id: 2, name: "Priya Sharma", rating: 4, comment: "Great experience overall. Waiting time was a bit long.", date: "March 5, 2025" }
        ]);
      }

      // Load saved like status
      const { liked: savedLiked, count: savedCount } = loadLikeStatus(id);
      setLiked(savedLiked);
      setLikeCount(savedCount);
    }
  }, []);

  // Save reviews whenever they change
  useEffect(() => {
    if (recordId && reviews.length > 0) {
      saveReviews(recordId, reviews);
    }
  }, [reviews, recordId]);

  // Save like status whenever it changes
  useEffect(() => {
    if (recordId) {
      saveLikeStatus(recordId, liked, likeCount);
    }
  }, [liked, likeCount, recordId]);
  
  const handleBookAppointment = () => {
    if (doctor) {
      // Ensure we use consistent parameter naming throughout the application
      // Use 'specialization' as the route parameter name instead of mixing 'category' and 'cnames'
      router.push(`/search/specialization/${doctor.specialization.toLowerCase().replace(/\s+/g, "-")}`);
    }
  };

  const handleViewAllDoctors = () => {
    setShowAllDoctors(!showAllDoctors);
  };

  const handleDoctorClick = (id) => {
    // Ensure a consistent route parameter name for doctor details as well
    router.push(`/details/${id}`);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewText.trim() && rating > 0) {
      const newReview = {
        id: Date.now(), // Use timestamp as ID for uniqueness
        name: "Anonymous User", // In a real app, you'd use the logged-in user's name
        rating: rating,
        comment: reviewText,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      
      setReviews([newReview, ...reviews]);
      setReviewText("");
      setRating(0);
    }
  };

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleShare = () => {
    // In a real application, this would open a share dialog
    alert("Share functionality would open sharing options here");
  };

  // Save address in localStorage when it changes
  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    if (typeof window !== "undefined" && recordId) {
      localStorage.setItem(`doctor_address_${recordId}`, newAddress);
    }
  };

  // Load address from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && recordId) {
      const savedAddress = localStorage.getItem(`doctor_address_${recordId}`);
      if (savedAddress) {
        setAddress(savedAddress);
      }
    }
  }, [recordId]);

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading doctor details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4">
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 mr-2 ${activeTab === tab 
              ? 'bg-blue-500 text-white rounded-t-lg' 
              : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Main Content Container */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side Content */}
          <div className="md:w-2/3 p-6">
            {/* Top Section with Photo and Doctor Info */}
            <div className="flex flex-col md:flex-row mb-8">
              {/* Photo Container */}
              <div className="md:w-1/3 mb-4 md:mb-0">
                <Image 
                  src={doctor.image} 
                  alt={doctor.name} 
                  width={300} 
                  height={300} 
                  className="w-full h-56 object-cover rounded-lg shadow-md" 
                  unoptimized 
                />

                {/* Like and Share Buttons */}
                <div className="flex justify-between mt-3">
                  <button 
                    className={`flex items-center px-4 py-2 rounded-md ${liked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'} hover:bg-blue-50 transition`}
                    onClick={handleLike}
                  >
                    <FaThumbsUp className="mr-2" /> {likeCount}
                  </button>
                  <button 
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    onClick={handleShare}
                  >
                    <FaShare className="mr-2" /> Share
                  </button>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-center space-x-4 mt-3">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    <FaFacebook size={24} />
                  </a>
                  <a href="#" className="text-blue-400 hover:text-blue-600">
                    <FaTwitter size={24} />
                  </a>
                  <a href="#" className="text-blue-700 hover:text-blue-900">
                    <FaLinkedin size={24} />
                  </a>
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="md:w-2/3 md:pl-6">
                <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
                <p className="inline-block bg-blue-50 text-blue-700 py-1 px-3 rounded-full mt-2 text-sm font-medium">
                  {doctor.specialization}
                </p>
                <p className="text-sm font-bold text-yellow-700 bg-yellow-100 py-1 px-2 rounded-md mt-2 inline-block">
                  ⏳ {doctor.experience}
                </p>
                <p className="text-gray-600 mt-2">
                  🎓 {doctor.education}
                </p>
                <div className="mt-4">
                  <p className="text-gray-700 font-semibold mb-1">Address</p>
                  <input 
                    type="text" 
                    placeholder="Enter your address" 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 mb-4"
                    value={address}
                    onChange={handleAddressChange}
                  />

                  <div><BookAppointment/></div>
                </div>
              </div>
            </div>
            
            {/* Description Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About Doctor</h2>
              <p className="text-gray-600">
                {doctor.name} is a highly experienced {doctor.specialization.toLowerCase()} with {doctor.experience} of practice. 
                They have completed their {doctor.education} and are known for providing excellent care to patients.
                The doctor specializes in diagnosing and treating various conditions related to {doctor.specialization.toLowerCase()} health.
              </p>
              
              {/* Additional Information */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Services</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Comprehensive {doctor.specialization} consultation</li>
                  <li>Advanced diagnostic procedures</li>
                  <li>Treatment planning and management</li>
                  <li>Follow-up care and monitoring</li>
                </ul>
              </div>
              
              {/* Availability */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
                <table className="w-full text-sm text-gray-600">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Monday</td>
                      <td className="py-2">9:00 AM - 5:00 PM</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Wednesday</td>
                      <td className="py-2">10:00 AM - 6:00 PM</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Friday</td>
                      <td className="py-2">8:00 AM - 2:00 PM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Review Section */}
            <div className="border-t mt-6 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Patient Reviews</h2>
              
              {/* Add Review Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                  {/* Star Rating */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Your Rating</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl text-yellow-400 focus:outline-none"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <FaStar
                            className={
                              (hoverRating ? hoverRating >= star : rating >= star)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Review Text */}
                  <textarea
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 mb-3"
                    rows="3"
                    placeholder="Share your experience with this doctor..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  ></textarea>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    disabled={!rating || !reviewText.trim()}
                  >
                    Submit Review
                  </button>
                </form>
              </div>
              
              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{review.name}</p>
                          <div className="flex text-yellow-400 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={review.rating >= star ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                      
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Side - Doctor Suggestion List */}
          <div className="md:w-1/3 bg-gray-50 p-6 border-l">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Similar Doctors</h2>
            <div className="space-y-4">
              {suggestedDoctors.length > 0 ? (
                suggestedDoctors.map((doc) => (
                  <div key={doc.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <Image 
                        src={doc.image} 
                        alt={doc.name} 
                        width={50} 
                        height={50} 
                        className="w-12 h-12 rounded-full object-cover mr-3" 
                        unoptimized 
                        onClick={() => handleDoctorClick(doc.id)}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                        <p className="text-xs text-blue-600">{doc.specialization}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      🎓 {doc.education}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      ⏳ {doc.experience}
                    </p>
                    <button
                      className="mt-2 w-full bg-gray-200 text-gray-800 py-1 px-3 rounded-md text-sm hover:bg-gray-300 transition"
                      onClick={() => handleDoctorClick(doc.id)}
                    >
                      View Profile
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No similar doctors found.</p>
              )}
            </div>
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              onClick={handleViewAllDoctors}
            >
              {showAllDoctors ? "Hide Suggestions" : "View All Suggestions"}
            </button>
            {showAllDoctors && (
              <div className="mt-4 space-y-4">
                {getDoctorData().map((doc) => (
                  <div key={doc.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <Image 
                        src={doc.image} 
                        alt={doc.name} 
                        width={50} 
                        height={50} 
                        className="w-12 h-12 rounded-full object-cover mr-3" 
                        unoptimized 
                        onClick={() => handleDoctorClick(doc.id)}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                        <p className="text-xs text-blue-600">{doc.specialization}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      🎓 {doc.education}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      ⏳ {doc.experience}
                    </p>
                    <button
                      className="mt-2 w-full bg-gray-200 text-gray-800 py-1 px-3 rounded-md text-sm hover:bg-gray-300 transition"
                      onClick={() => handleDoctorClick(doc.id)}
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}