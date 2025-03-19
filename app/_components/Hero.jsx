"use client";
import { useState } from "react";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Hero = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    issue: "",  // ✅ Fixed field name from "items" to "issue"
    contact: "",
    doctor: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!formData.name || !formData.age || !formData.address || !formData.issue || !formData.contact || !formData.doctor) {
      setMessage({ type: "error", text: "❌ Please fill all fields." });
      return;
    }

    if (isNaN(formData.contact) || formData.contact.length < 10) {
      setMessage({ type: "error", text: "❌ Please enter a valid contact number." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/storePatientData/delhivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to book home delivery.");
      }

      setMessage({ type: "success", text: "✅ Home delivery booked successfully!" });
      setFormData({ name: "", age: "", address: "", issue: "", contact: "", doctor: "" }); // ✅ Fixed field reset
    } catch (error) {
      setMessage({ type: "error", text: "❌ Error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          
          {/* Left: Image */}
          <div className="relative w-full h-[400px] md:h-[500px]">
            <Image
              src="/doctor.png"
              fill
              className="rounded-3xl shadow-lg border-4 border-blue-500 object-cover"
              alt="Doctor Consultation"
              priority
            />
          </div>

          {/* Right: Text Content */}
          <div className="max-w-lg">
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              Get Your <span className="text-blue-600">Order</span> Delivered to Your <span className="text-blue-600">Home</span>
            </h2>
            <p className="mt-4 text-gray-700">
               Easily book home delivery services for medicines and healthcare products at your doorstep. 
                
             <strong className="text-red-600">NOTE:</strong> Please ensure the details are entered properly to get it fast.
           </p>


            {/* Home Delivery Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="age"
                placeholder="Enter Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="issue"  // ✅ Fixed field name
                placeholder="Enter Issue"
                value={formData.issue}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="contact"
                placeholder="Enter Contact Number"
                value={formData.contact}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="doctor"
                placeholder="Enter Doctor Name"
                value={formData.doctor}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </form>

            {/* Message Display */}
            {message && (
              <p className={`mt-4 text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
