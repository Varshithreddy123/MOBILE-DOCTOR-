import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-8 mt-auto">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 gap-6">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center space-x-4 md:space-x-6 text-gray-700">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link href="/services" className="hover:text-gray-900 transition-colors">Services</Link>
            <Link href="/faq" className="hover:text-gray-900 transition-colors">FAQs</Link>
            <Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
          </nav>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4">
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
          <div className="text-center text-sm text-gray-600">
            <p>Email: contact@yourcompany.com | Phone: +123 456 7890</p>
          </div>

          {/* Legal Links */}
          <nav className="flex justify-center space-x-4 text-gray-600 text-sm">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              Terms & Conditions
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 @varshith reddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;