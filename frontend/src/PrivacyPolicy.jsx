import React from "react";
import { Link } from "react-router-dom";
import NavBarBasic from "./NavBarBasic";
import Footer from "./Footer";
export default function PrivacyPolicy() {
  return (
    <div>
    <NavBarBasic/>
    <div className="min-h-screen text-gray-800 bg-white px-6 py-12 lg:px-24 lg:py-16">
      <div className="mb-8">
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-600">Last updated on: <strong>03/02/2025</strong></p>

        <p className="leading-relaxed">
          At AutoHub (“we”, “us”, “our”) and its affiliates, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you access our platform, use our services, or visit our website.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Personal Information</strong>: name, email address, contact number, etc., when you register with us or otherwise voluntarily provide such information.</li>
            <li><strong>Usage Information</strong>: your search history, interactions with the Platform, pages viewed, features used, etc.</li>
            <li><strong>Device & Technical Information</strong>: IP address, browser type, operating system, device identifiers, connection information, etc.</li>
            <li><strong>Preferences</strong>: language, location, settings, etc.</li>
            <li><strong>Third-Party Data</strong>: from social media or partners, if you use such features.</li>
            <li><strong>Cookies & Similar Technologies</strong>: cookies, pixels, beacons to improve functionality and analytics.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
          <p className="leading-relaxed text-gray-700">
            We use your information for various purposes including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>To provide, maintain, and improve our services and features.</li>
            <li>To personalize your experience and show content relevant to your preferences.</li>
            <li>To communicate with you, including answering inquiries, sending updates, or notifying about changes.</li>
            <li>To safeguard our platform and prevent fraud, abuse, or other unlawful uses.</li>
            <li>To comply with legal obligations and enforce our terms of service.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">3. Sharing & Disclosure</h2>
          <p className="leading-relaxed text-gray-700">
            We may share or disclose your personal information under the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>With service providers, vendors, or contractors who assist in delivering our services.</li>
            <li>With business partners or affiliates for legitimate business purposes.</li>
            <li>With law enforcement, government authorities or as required by law.</li>
            <li>With your consent or as otherwise disclosed at the time of collection.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">4. Security</h2>
          <p className="leading-relaxed text-gray-700">
            We implement reasonable technical, administrative, and physical safeguards to protect your information from unauthorized access, use, or disclosure. However, no system is fully immune to security threats, and while we strive to protect your data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">5. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>The right to access, update, or correct your personal information.</li>
            <li>The right to request deletion of your personal information (subject to applicable laws).</li>
            <li>The right to withdraw consent where applicable.</li>
            <li>The right to object to or limit certain processing activities.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">6. Changes to This Privacy Policy</h2>
          <p className="leading-relaxed text-gray-700">
            We may update this Privacy Policy from time to time. If we make changes, we will post the revised policy on this page with a new “Effective Date”. Your continued use of our services after any change indicates your acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">7. Contact Us</h2>
          <p className="leading-relaxed text-gray-700">
            If you have any questions about this Privacy Policy or how we handle your information, please reach out to:
          </p>
          <ul className="list-inside space-y-1 text-gray-700">
            <li><strong>Data Protection Officer / Grievance Officer:</strong> Mr. Frank Godwin Raj P / Mr. Sathish B</li>
            <li><strong>Email:</strong> compliance@autohub.com</li>
            <li><strong>Address:</strong> Your Address Here</li>
          </ul>
        </section>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
