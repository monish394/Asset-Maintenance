import { useState } from "react";
import logopng from "../assets/logo.png"
import axios from "../config/api";
import { motion } from "framer-motion";
import {
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
  HiOutlineCode,
  HiOutlineMail
} from "react-icons/hi";

const PublicHome = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/enquiry", formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({ firstName: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  // Fixed Animation Variants - Smooth & No Stuck
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div id="top" className="min-h-screen bg-gray-50 text-slate-800 selection:bg-indigo-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .card-shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
      `}</style>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-between py-3.5">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex items-center gap-2"
            >
              <a href="#top" className="hover:opacity-90 transition-opacity">
                <img src={logopng} alt="Logo" className="h-8 w-auto" />
              </a>
            </motion.div>

            <div className="hidden md:flex items-center gap-8 text-[12px] font-semibold text-slate-500 tracking-wider uppercase">
              {["Features", "Workflow", "Docs", "Contact"].map((link, i) => (
                <motion.a 
                  key={link} 
                  href={`#${link.toLowerCase()}`} 
                  className="hover:text-indigo-600 transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                >
                  {link}
                </motion.a>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <a href="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all">
                Sign In
              </a>
              <a href="/register" className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-all">
                Register
              </a>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* ── Hero Section ── */}
      <section className="relative pt-16 pb-24 border-b border-slate-100 bg-white">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto px-6 text-center"
        >
          <motion.div 
            variants={staggerItem}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-6"
          >
            Enterprise Asset Management
          </motion.div>

          <motion.h1 
            variants={staggerItem}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-3xl mx-auto leading-tight"
          >
            Streamline Your Organization's <span className="text-indigo-600">Assets & Maintenance</span>
          </motion.h1>

          <motion.p 
            variants={staggerItem}
            className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          >
            A unified platform for lifecycle tracking, preventive scheduling, and data-driven visibility for modern enterprises.
          </motion.p>

          <motion.div 
            variants={staggerItem}
            className="flex flex-col sm:flex-row justify-center gap-3 mb-20"
          >
            <a href="/register" className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-sm">
              Get Started <HiOutlineArrowRight />
            </a>
            <a href="#features" className="px-8 py-3.5 bg-white border border-slate-200 font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-all text-sm">
              Explore Features
            </a>
          </motion.div>

          {/* ── Stats Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { label: "Total Assets", value: "50+", icon: HiOutlineCube },
              { label: "Active Requests", value: "20", icon: HiOutlineClipboardList },
              { label: "Compliance", value: "99%", icon: HiOutlineChartBar },
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                className="bg-white border border-slate-200 p-6 rounded-xl transition-all hover:border-indigo-300 hover:shadow-md text-left flex items-center gap-5"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Feature Section ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">Capabilities</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Built for Enterprise Scale</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { title: "Lifecycle Tracking", desc: "Monitor every asset from acquisition to disposal with full historical audit logs.", icon: HiOutlineCube },
              { title: "Preventive Maintenance", desc: "Automate scheduling to minimize equipment downtime and extend asset life.", icon: HiOutlineLightningBolt },
              { title: "Centralized Service Hub", desc: "Unified ticketing for staff and technicians with real-time status updates.", icon: HiOutlineClipboardList },
              { title: "Role-Based Access", desc: "Granular permissions for administrators, staff, and service technicians.", icon: HiOutlineUserGroup },
              { title: "Decision Analytics", desc: "Visual reports on utilization trends and maintenance performance metrics.", icon: HiOutlineChartBar },
              { title: "Governance & Security", desc: "Industry-standard data protection and full organizational compliance.", icon: HiOutlineShieldCheck },
            ].map((f, i) => (
              <motion.div 
                key={i} 
                className="group"
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <f.icon size={18} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section id="workflow" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl mb-16"
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">Workflow</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Structured Asset Operations</h3>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Inventory", step: "01", desc: "Digitalize and tag physical items." },
              { title: "Allocation", step: "02", desc: "Assign to departments or users." },
              { title: "Monitoring", step: "03", desc: "Real-time issue reporting." },
              { title: "Resolution", step: "04", desc: "Technician verification." },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="bg-white p-6 rounded-xl border border-slate-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <span className="text-[10px] font-bold text-indigo-600 mb-4 block">STEP {item.step}</span>
                <h5 className="font-bold text-slate-900 mb-2 truncate">{item.title}</h5>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Docs ── */}
      <section id="docs" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl mb-16"
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">Documentation</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Resources & Guides</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Getting Started", desc: "Quick setup guide to deploy and configure your platform.", icon: HiOutlineBookOpen },
              { title: "API Reference", desc: "Complete REST API documentation for integrations.", icon: HiOutlineCode },
              { title: "Best Practices", desc: "Industry standards for optimal asset management.", icon: HiOutlineDocumentText },
            ].map((doc, i) => (
              <motion.a
                key={i}
                href="#"
                className="group bg-gray-50 p-6 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                  <doc.icon size={18} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">{doc.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{doc.desc}</p>
                <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  Read More <HiOutlineArrowRight size={12} />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-4">Contact</h2>
            <h3 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">Request a Professional Demo</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Learn how our platform can integrate with your existing infrastructure to optimize maintenance schedules.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <HiOutlineMail className="text-indigo-600" size={18} />
                <span className="text-sm font-semibold tracking-tight">enterprise@assetmaint.com</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-white p-7 rounded-xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Message</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-indigo-600 outline-none resize-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest">
                  {loading ? "Processing..." : "Submit Inquiry"}
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-green-50 p-10 rounded-xl text-center border border-green-100"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <HiOutlineShieldCheck size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">Inquiry Received</h4>
                <p className="text-slate-500 text-xs font-medium">We'll contact you shortly.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white py-12 border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-[10px]">AM</div>
            <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">AssetMaintenance</span>
          </motion.div>
          
          <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {["Terms", "Privacy", "Security", "Support"].map((l, i) => (
              <motion.a 
                key={l} 
                href="#" 
                className="hover:text-indigo-600 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05, ease: "easeOut" }}
              >
                {l}
              </motion.a>
            ))}
          </div>
          
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-[11px] font-bold text-slate-400 tracking-wider"
          >
            © {new Date().getFullYear()} REFINED FOR ENTERPRISE
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
};

export default PublicHome;