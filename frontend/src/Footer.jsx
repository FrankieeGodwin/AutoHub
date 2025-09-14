import React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import logo from "./assets/logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + About */}
        <div>
          <img src={logo} alt="AutoHub Logo" className="h-12 mb-4" />
          <p className="text-sm text-gray-600">
            AutoHub – your trusted platform for buying, selling, and discovering cars with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/PrivacyPolicy" className="hover:text-purple-700">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/TermsConditions" className="hover:text-purple-700">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/About" className="hover:text-purple-700">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/Contact" className="hover:text-purple-700">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-purple-700">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-700">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-700">
              <Linkedin size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-3">AutoHub@gmail.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} AutoHub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
