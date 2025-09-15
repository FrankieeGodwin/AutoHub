import React from "react";
import { Link } from "react-router-dom";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";

export default function TermsConditions() {
  return (
    <div>
      <NavBarBasic />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-20 px-6 relative">
        

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-12 border border-gray-100">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-6 text-center">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6 text-justify">
            Welcome to AutoHub. By accessing or using our platform, you acknowledge 
            and agree to the following Terms & Conditions. We recommend reviewing them 
            carefully to understand your rights and responsibilities when engaging 
            with our services.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-purple-600 mb-2">
                1. Use of Platform
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You may explore, search, and compare vehicles solely for personal 
                purposes. Any form of commercial misuse, automated data scraping, or 
                unauthorized reproduction of content is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-600 mb-2">
                2. Dealer Listings
              </h2>
              <p className="text-gray-700 leading-relaxed">
                AutoHub facilitates listings from verified dealers to enhance trust 
                and transparency. However, we are not liable for the outcome of 
                individual negotiations or transactions between buyers and sellers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-600 mb-2">
                3. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                While we make every effort to ensure the accuracy of information, 
                AutoHub does not warrant complete correctness of vehicle details, 
                specifications, or pricing. Users are advised to independently verify 
                critical information before making decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-600 mb-2">
                4. Updates to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms & Conditions from time to time to reflect 
                changes in business practices, legal requirements, or platform 
                functionality. Continued use of AutoHub signifies acceptance of the 
                revised terms.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
