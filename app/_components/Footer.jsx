import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-8 mt-auto">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Navigation and Social Links */}
          <div>
            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-start space-x-4 mb-6 text-gray-700">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
              <Link href="/services" className="hover:text-gray-900 transition-colors">Services</Link>
              <Link href="/faq" className="hover:text-gray-900 transition-colors">FAQs</Link>
              <Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>
              <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            </nav>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              {[
                { Icon: FaFacebook, href: "#", color: "text-blue-600" },
                { Icon: FaTwitter, href: "#", color: "text-blue-400" },
                { Icon: FaLinkedin, href: "#", color: "text-blue-700" },
                { Icon: FaInstagram, href: "#", color: "text-pink-500" },
                { Icon: FaYoutube, href: "#", color: "text-red-600" }
              ].map(({ Icon, href, color }, index) => (
                <Link 
                  key={index} 
                  href={href} 
                  className={`text-gray-600 hover:${color} transition-colors`}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>

            {/* Contact Information */}
            <div className="text-sm text-gray-600 mb-6">
              <p>Email: contact@yourcompany.com</p>
              <p>Phone: +123 456 7890</p>
              <p>Address: 123 Business Street, City, Country</p>
            </div>

            {/* Legal Links */}
            <nav className="flex space-x-4 text-gray-600 text-sm">
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">
                Terms & Conditions
              </Link>
            </nav>
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

        {/* Copyright */}
        <p className="text-center text-sm text-gray-500 mt-8">
          &copy; 2025 @varshith reddy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;