import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import logopng from "../assets/logo.png"

const Home = () => {
  // const navigate=useNavigate()
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  useEffect(() => {
    const sections = document.querySelectorAll("[data-animate]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((section) => observer.observe(section));
  }, []);

  return (
    <div id="top" className="min-h-screen bg-gray-50 text-gray-900">
     <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-6">
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
         <a href="#top"><img 
                  style={{ cursor: "pointer" }}
                
                  src={logopng}
                  alt="Logo"
                  className="h-13 w-auto ml-4"
                />
                </a>
              
        {/* <span className="text-xl font-semibold tracking-tight text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors">
          <a href="#top">Asset Maintenance</a>
        </span> */}
      </div>

      <div className="hidden md:flex items-center gap-8 text-base font-medium text-gray-700">
        {["Features", "Workflow", "Documentation", "Contact"].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="relative hover:text-indigo-600 transition-colors duration-200 
                       after:content-[''] after:block after:w-0 after:h-0.5 after:bg-indigo-600 
                       after:rounded after:transition-all after:duration-300 hover:after:w-full"
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/login"
          className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-all duration-200"
        >
          Login
        </a>
      </div>
    </nav>
  </div>
</header>

      <section
        className="relative bg-gradient-to-br from-indigo-50 via-white to-white py-24 opacity-0"
        data-animate
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6">
            Intelligent Asset & Maintenance Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            A centralized enterprise platform designed to manage assets,
            automate preventive maintenance, streamline service requests, and
            provide real-time operational visibility through role-based
            dashboards.
          </p>
          <div className="flex justify-center gap-4 mb-16">
            <a  href="/register" className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 hover:scale-105 transform transition-all duration-200 cursor-pointer">
              Get Started
            </a>
            <a href="#features" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
              Explore Features
            </a>
          </div>
          <div className="rounded-xl bg-white shadow-xl border p-6 max-w-4xl mx-auto grid grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <p className="text-gray-500">Total Assets</p>
              <p className="text-2xl font-bold text-indigo-600">50+</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <p className="text-gray-500">Active Requests</p>
              <p className="text-2xl font-bold text-green-600">20</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <p className="text-gray-500">SLA Compliance</p>
              <p className="text-2xl font-bold text-yellow-600">88%</p>
            </div>
          </div>
        </div>
      </section>

    <section
  id="features"
  className="py-20 bg-white font-sans"
  data-animate
>
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
      Core Capabilities
    </h2>

    <div className="grid md:grid-cols-2 gap-10">
      {[
        "Asset Lifecycle Management",
        "Preventive Maintenance Scheduling",
        "Service Request Tracking",
        "Role-Based Dashboards",
        "Real-Time Status Monitoring",
        "Analytics & Reporting",
        "Nearby Asset Access",
      ].map((feature, index) => (
        <div
          key={index}
          className="flex items-start gap-4 opacity-0 translate-y-6 transform transition-all duration-500"
          style={{
            animation: "fadeIn 0.6s ease-out forwards",
            animationDelay: `${index * 200}ms`,
          }}
        >
          <div className="flex-shrink-0 mt-1">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{feature}</p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Improve operational efficiency with centralized tools and real-time insights.
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      <section id="workflow" className="py-20 bg-gray-50 opacity-0" data-animate>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Operational Workflow
            </h2>
            <p className="mt-4 text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
              A structured workflow designed to ensure accountability, efficiency, and transparency throughout the asset lifecycle.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Asset Registration",
                description: "Administrators register and categorize assets while defining ownership and maintenance parameters.",
              },
              {
                title: "Asset Assignment",
                description: "Assets are allocated to users or departments, ensuring full traceability and responsibility tracking.",
              },
              {
                title: "Service Request Submission",
                description: "Users submit maintenance requests with complete transparency and real-time tracking capabilities.",
              },
              {
                title: "Technician Resolution",
                description: "Technicians review, update, and resolve requests while maintaining comprehensive service logs.",
              },
              {
                title: "Performance Reporting",
                description: "Leadership teams access dashboards and analytics to monitor compliance and operational performance.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 md:p-4 rounded-xl shadow-sm border text-center flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg opacity-0"
                data-animate
              >
                <div className="w-10 h-10 mb-4 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-md text-sm">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="documentation" className="py-28 bg-white opacity-0" data-animate>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">System Documentation</h2>
          <div className="text-gray-700 text-sm leading-relaxed space-y-6">
            <p>
              The Asset Maintenance Management System is a secure, role-based enterprise platform built to centralize asset lifecycle management, streamline maintenance workflows, and enhance operational oversight.
            </p>
            <p>
              Real-time dashboards provide visibility into asset utilization, service status, and compliance metrics, ensuring informed decision-making.
            </p>
            <p>
              Designed using RESTful architecture and protected middleware for secured routes, the system prioritizes data integrity, scalability, and operational efficiency across all modules.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-28 bg-gray-50 opacity-0" data-animate>
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-10">Get in Touch</h2>
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 md:p-8 rounded-xl shadow-sm border space-y-4 text-left transform transition-all duration-300 hover:scale-105"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                  <input type="email" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input type="text" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="3" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"/>
              </div>
              <button type="submit" disabled={loading} className={`w-full py-3 rounded-md font-semibold transition text-sm ${loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          ) : (
            <div className="bg-white p-10 rounded-xl shadow-sm border text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-2xl font-bold">✓</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your demo request has been submitted successfully. Our team will get back to you soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-white border-t text-gray-600">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow">AM</div>
              <span className="text-lg font-semibold tracking-tight">Asset Maintenance</span>
            </div>
            <p className="text-sm text-gray-500">
              Intelligent platform to streamline asset lifecycle management and maintenance workflows.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Features","Workflow","Documentation","Contact"].map((link) => (
                <li key={link}><a href={`#${link.toLowerCase()}`} className="hover:text-indigo-600 transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Contact</h4>
            <p className="text-sm mb-2">Email: <a href="mailto:support@assetmaintenance.com" className="hover:text-indigo-600 transition-colors">support@assetmaintenance.com</a></p>
            <p className="text-sm mb-2">Phone: <a href="tel:+1234567890" className="hover:text-indigo-600 transition-colors">+1 (234) 567-890</a></p>
            <p className="text-sm">Address: 123 Enterprise St, City, Country</p>
          </div>
          <div className="col-span-full mt-6 text-center text-sm text-gray-400">© {new Date().getFullYear()} Asset Maintenance System. All rights reserved.</div>
        </div>
      </footer>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Home;
