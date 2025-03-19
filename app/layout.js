"use client";
import { useState } from "react";
import { Outfit } from "next/font/google";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
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
          <div className="mx-auto max-w-5xl px-4 text-center">
            <nav className="mb-4 flex justify-center space-x-6 text-gray-700 font-medium">
              <Link href="/" className="hover:text-gray-900 transition">Home</Link>
              <Link href="/about" className="hover:text-gray-900 transition">About</Link>
              <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
            </nav>
            <h2 className="text-sm text-gray-600">Doctor Appointment System</h2>
            <p className="text-sm text-gray-500">&copy; 2025 @VARSHITH REDDY. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
