import React from "react";
import { Link } from "react-router-dom";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";
function Contact() {
  return (
    <div>
      <NavBarBasic/>
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-6 relative">

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-10 mt-12">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">Contact Us</h1>
        <p className="text-gray-700 mb-4">
          Have questions, feedback, or need support? Reach out to us!
        </p>

        <div className="space-y-4 text-gray-700">
          <p>
            Email: <span className="text-purple-700">AutoHub@gmail.com</span>
          </p>
          <p>Phone: +91 6382624622</p>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-600">Send us a message</h2>
        <form className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <button
            type="submit"
            className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default Contact;
