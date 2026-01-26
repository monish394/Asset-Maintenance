import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-400 text-gray-300 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Mk Assert</h2>
          <p className="text-sm">
            Building innovative solutions for your business.  
            <br />
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a  className="hover:text-white transition">Home</a>
            </li>
            <li>
              <a  className="hover:text-white transition">Assets</a>
            </li>
            <li>
              <a  className="hover:text-white transition">About</a>
            </li>
            <li>
              <a  className="hover:text-white transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:info@mkassert.com" className="hover:text-white transition">info@mkassert.com</a></li>
            <li>Phone: <a href="tel:+1234567890" className="hover:text-white transition">+1 234 567 890</a></li>
            <li>Address: 123 Main St, City, Country</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            {/* Facebook */}
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11 9.95v-7.05h-2v-2.9h2V9.35c0-2 1.2-3.1 3-3.1.85 0 1.7.15 1.7.15v1.9h-1c-1 0-1.3.63-1.3 1.27v1.54h2.2l-.35 2.9h-1.85V22A10 10 0 0022 12z" />
              </svg>
            </a>

            {/* Twitter */}
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.95-2.48 9.03 9.03 0 01-2.83 1.08A4.52 4.52 0 0016.5 2c-2.48 0-4.5 2.01-4.5 4.5 0 .35.04.7.11 1.03A12.94 12.94 0 013 4.1s-4 9 5 13a13 13 0 01-7 2c9 5 20 0 20-11.5 0-.17 0-.33-.01-.5A9.18 9.18 0 0023 3z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.52 0-10 4.48-10 10a9.99 9.99 0 006.84 9.57v-6.78h-2v-2.79h2v-2.13c0-2.1 1.25-3.26 3.15-3.26.91 0 1.85.16 1.85.16v2.03h-1.04c-1.03 0-1.35.64-1.35 1.29v1.91h2.3l-.37 2.79h-1.93v6.78A9.99 9.99 0 0022 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
