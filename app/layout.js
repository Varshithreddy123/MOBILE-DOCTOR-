"use client";
import { useState } from "react";
import { Outfit } from "next/font/google";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null); // Placeholder for authentication logic

  return (
    <html lang="en">
      <Head>
        <title>Doctor Appointment System</title>
        <meta name="description" content="Book appointments with top specialists easily." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={`${outfit.variable} bg-gray-100 font-sans flex flex-col min-h-screen`}>
        {/* Wrap entire app with SessionProvider */}
        <SessionProvider>
          {/* Header Section */}
          <Header />
          <Hero />

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8 flex-grow">
            {children}
          </main>

          {/* Book Now Section */}
          <section className="bg-blue-500 text-white text-center py-10">
            <h2 className="text-2xl font-bold">Book an Appointment</h2>
            <p className="mt-2 text-lg">Schedule your appointment with our top specialists today.</p>
            <button
              onClick={() => router.push("/book-appointment")}
              className="mt-4 px-6 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
            >
              Book Now
            </button>
          </section>

          {/* Footer Section */}
          <footer className="bg-gray-200 py-8 mt-auto border-t border-gray-300">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Navigation and Contact Info */}
                <div>
                  <nav className="mb-6 flex justify-start space-x-6 text-gray-700 font-medium">
                    <Link href="/" className="hover:text-gray-900 transition">Home</Link>
                    <Link href="/about" className="hover:text-gray-900 transition">About</Link>
                    <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
                  </nav>

                  <div className="text-sm text-gray-600 mb-6">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <p>Email: support@docappointment.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Address: 123 Medical Center Dr, Wellness City</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>&copy; 2025 @VARSHITH REDDY. All rights reserved.</p>
                  </div>
                </div>

                {/* Right Column - Google Maps Embed */}
                <div>
                  <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a47df06b185%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1697889675846!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}