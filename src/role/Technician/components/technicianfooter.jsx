import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function TechnicianFooter() {
  return (
    <footer className="bg-gray-400 text-gray-300 py-10 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Tech Maintenance</h2>
          <p className="text-sm">
            Helping technicians manage tasks efficiently.<br />
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope /> 
              <a href="mailto:support@techportal.com" className="hover:text-white transition">
                support@techportal.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> 
              <a href="tel:+1234567890" className="hover:text-white transition">
                +1 234 567 890
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> 
              123 Tech Park, City, Country
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/technician/home" className="hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link to="/technician/assignedrequest" className="hover:text-white transition">Assigned Request</Link>
            </li>
            <li>
              <Link to="/technician/requestdetails" className="hover:text-white transition">Request Details</Link>
            </li>
            <li>
              <Link to="/technician/service" className="hover:text-white transition">Service</Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
