import React from "react";
import { Link } from "react-router-dom";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";

export default function About() {
  return (
    <div>
      <NavBarBasic />
      <div className="min-h-screen bg-[#FAFAFA] py-20 px-6 relative">
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-12 border border-gray-100">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-6 text-center">
            About AutoHub
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6 text-justify">
            AutoHub is your trusted destination for exploring, comparing, and purchasing cars. 
            Inspired by industry leaders yet tailored for modern users, AutoHub blends technology 
            with automotive passion to deliver a transparent and seamless car-buying experience.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-purple-600 mb-3">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To revolutionize car buying and selling by offering accurate insights, verified 
                dealer connections, and an intuitive browsing experience. We aim to empower every 
                customer to make informed and confident automotive decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-600 mb-3">
                 Why Choose AutoHub?
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                <li>Comprehensive car reviews and detailed specifications.</li>
                <li>Advanced filters for a personalized search experience.</li>
                <li>Trusted dealer network ensuring safe and reliable transactions.</li>
                <li>Seamless user interface designed for convenience and clarity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-600 mb-3">
                 Our Vision
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To be more than just a marketplace — AutoHub strives to become a community for 
                car enthusiasts, where trust, innovation, and passion for automobiles drive the future.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
