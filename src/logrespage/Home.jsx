import { useState, useEffect, useRef } from "react";
import logopng from "../assets/logo.png"
import axios from "../config/api";
import { motion } from "framer-motion";
import { gsap } from "gsap";
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

const GsapHoverCard = ({ children, className, as: Component = motion.div, ...props }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1.02,
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
      ease: "power2.out",
      duration: 0.4,
      boxShadow: "0 15px 30px -10px rgba(79, 70, 229, 0.15)",
      zIndex: 50
    });

    const innerElements = cardRef.current.querySelectorAll('.hover-inner');
    if (innerElements.length) {
      gsap.to(innerElements, {
        z: 15,
        y: -2,
        x: ((x - centerX) / centerX) * -2,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      ease: "power3.out", // Changed to a smoother ease instead of elastic
      duration: 0.8,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 10
    });

    const innerElements = cardRef.current.querySelectorAll('.hover-inner');
    if (innerElements.length) {
      gsap.to(innerElements, {
        z: 0,
        y: 0,
        x: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }
  };

  return (
    <Component
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Component>
  );
};

const PublicHome = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", email: "", message: "" });
  const [stats, setStats] = useState({ totalAssets: 0, activeRequests: 0, compliance: 100 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/dashboardstats");
        const { totalAssets, undermaintance, pendingRequests, workingAssets } = res.data;
        const complianceRate = totalAssets > 0 ? Math.round((workingAssets / totalAssets) * 100) : 100;

        setStats({
          totalAssets: totalAssets,
          activeRequests: undermaintance + pendingRequests,
          compliance: complianceRate
        });
      } catch (err) {
        console.error("Failed to fetch home stats:", err);
      }
    };
    fetchStats();
  }, []);

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
    <div id="top" className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200 via-white to-indigo-50/60 text-slate-800 selection:bg-indigo-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .card-shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
      `}</style>


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
                <img src={logopng} alt="Logo" className="h-8 w-auto mix-blend-multiply" />
              </a>
            </motion.div>

            <div className="hidden md:flex items-center gap-8 text-[12px] font-semibold text-slate-500 tracking-wider uppercase">
              {["Features", "Workflow", "Docs", "Contact"].map((link, i) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="relative group hover:text-indigo-600 transition-colors py-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                >
                  {link}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
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


      <section className="relative pt-16 pb-24 border-b border-blue-100/50 bg-transparent">
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


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { label: "Total Assets", value: `${stats.totalAssets}+`, icon: HiOutlineCube },
              { label: "Active Requests", value: stats.activeRequests.toString(), icon: HiOutlineClipboardList },
              { label: "Compliance", value: `${stats.compliance}%`, icon: HiOutlineChartBar },
            ].map((stat, idx) => (
              <GsapHoverCard
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                className="bg-white border border-slate-200 p-6 rounded-xl transition-colors text-left flex items-center gap-5 cursor-default relative z-10"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 hover-inner shadow-sm bg-white">
                  <stat.icon size={20} />
                </div>
                <div className="hover-inner">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                </div>
              </GsapHoverCard>
            ))}
          </div>
        </motion.div>
      </section>


      <section id="features" className="py-24 bg-transparent">
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
              <GsapHoverCard
                key={i}
                className="group p-6 bg-white rounded-xl border border-transparent hover:border-slate-100 transition-colors cursor-default relative z-10"
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all hover-inner shadow-sm">
                  <f.icon size={18} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight hover-inner group-hover:text-indigo-600 transition-colors">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed hover-inner">{f.desc}</p>
              </GsapHoverCard>
            ))}
          </div>
        </div>
      </section>


      <section id="workflow" className="py-24 bg-blue-50/30">
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

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Asset Registration", step: "01", desc: "Digitally onboard assets with QR/barcode tagging for immediate active tracking." },
              { title: "Proactive Monitoring", step: "02", desc: "Track asset lifecycles and schedule preventive maintenance automatically." },
              { title: "Service Resolution", step: "03", desc: "Assign technicians, verify completed work, and log auditable compliance history." },
            ].map((item, i) => (
              <GsapHoverCard
                key={i}
                className="bg-white p-6 rounded-xl border border-slate-200 cursor-default relative z-10 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <span className="text-[10px] font-bold text-indigo-600 mb-4 block hover-inner">STEP {item.step}</span>
                <h5 className="font-bold text-slate-900 mb-2 truncate hover-inner">{item.title}</h5>
                <p className="text-slate-500 text-xs leading-relaxed hover-inner">{item.desc}</p>
              </GsapHoverCard>
            ))}
          </div>
        </div>
      </section>


      <section id="docs" className="py-24 bg-transparent">
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
              <GsapHoverCard
                key={i}
                as={motion.a}
                href="#"
                className="group bg-gray-50 p-6 rounded-xl border border-slate-200 transition-colors relative z-10 block h-full flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all hover-inner shadow-sm">
                  <doc.icon size={18} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-tight transition-colors hover-inner">{doc.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 hover-inner grow">{doc.desc}</p>
                <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover-inner mt-auto">
                  Read More <HiOutlineArrowRight size={12} />
                </span>
              </GsapHoverCard>
            ))}
          </div>
        </div>
      </section>


      <section id="contact" className="py-24 bg-indigo-50/30 border-t border-blue-100/30">
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


      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-transparent py-12 border-t border-blue-100/50"
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
                className="relative group hover:text-indigo-600 transition-colors py-1"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05, ease: "easeOut" }}
              >
                {l}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
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