import { useState, useEffect } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { useNavigate, Link, useLocation } from "react-router-dom"
import axios from "../config/api"
import { toast } from "sonner"
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaUserTag, FaArrowLeft, FaCheckCircle } from "react-icons/fa"
import { motion } from "framer-motion"
import regBg from "../assets/registration_bg.png"

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "user",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isFromGoogle, setIsFromGoogle] = useState(false)

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        name: location.state.name || prev.name,
        email: location.state.email || prev.email,
      }))
      setIsFromGoogle(true)
      toast.info("Google info pre-filled — please fill in mobile & address to continue")
    }
  }, [location.state])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      setError("All fields are required.")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("/usersregister", formData)

      if (response.data?.err) {
        setError(response.data.err)
        setLoading(false)
        return
      }

      toast.success("Account created successfully!")

      setTimeout(() => {
        setLoading(false)
        navigate("/login")
      }, 1500)
    } catch (err) {
      const serverMessage = err?.response?.data?.error || "Unable to complete registration. Please try again."
      setError(String(serverMessage).replace(/"/g, ""))
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("/google-login", {
        credential: credentialResponse.credential,
      })

      if (response.data.isNewUser) {
        setFormData((prev) => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
        }))
        setIsFromGoogle(true)
        toast.info("Google info pre-filled — please fill in mobile & address to continue.")
        return
      }

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("role", response.data.role)
      sessionStorage.setItem("token", response.data.token)
      sessionStorage.setItem("role", response.data.role)
      toast.success("Welcome back!", { duration: 1000 })

      setTimeout(() => {
        const role = response.data.role
        if (role === "admin") navigate("/admin", { replace: true })
        else if (role === "user") navigate("/user", { replace: true })
        else if (role === "technician")
          navigate("/technician/home", { replace: true })
        else navigate("/dashboard", { replace: true })
      }, 1000)
    } catch (err) {
      console.error(err)
      toast.error("Google login failed")
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 selection:bg-indigo-100 selection:text-indigo-700" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        .bg-zoom {
          animation: subtle-zoom 20s infinite alternate ease-in-out;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col flex-[0.8] relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={regBg}
            alt="Registration Background"
            className="w-full h-full object-cover bg-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-indigo-900/40" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-16 text-white">
          {/* Removed desktop-only Home link to fix mobile visibility */}

          <div className="mt-auto max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl"
            >
              <div className="h-1 w-12 bg-indigo-500 rounded-full mb-8" />
              <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">
                Elevating <span className="text-indigo-400">Asset</span> Management.
              </h2>
              <p className="text-lg text-slate-300 font-medium mb-10 leading-relaxed">
                Join our ecosystem and streamline your organization's maintenance workflows with precision and ease.
              </p>

              <div className="space-y-6">
                {[
                  "Smart Asset Lifecycle Monitoring",
                  "Predictive Maintenance Scheduling",
                  "Real-time Collaboration & Reporting"
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                      <FaCheckCircle size={12} />
                    </div>
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-auto pt-16">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Enterprise Grade Infrastructure</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-white py-12 relative overflow-y-auto"
      >
        <Link to="/home" className="absolute top-8 left-12 flex items-center gap-2 text-slate-700 hover:text-indigo-600 text-[11px] font-bold uppercase tracking-[0.2em] transition-all group">
          <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="max-w-md w-full mx-auto mt-20">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Create Account</h1>
            <p className="text-slate-500 text-sm font-medium">Empower your team with professional maintenance tools.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {isFromGoogle && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-3"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Your Google account was verified! Please fill in your <strong>mobile number</strong> and <strong>address</strong> to complete registration.</span>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 font-bold text-xs flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <FaUser size={12} />
                  </div>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <FaEnvelope size={12} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={isFromGoogle ? undefined : handleChange}
                    readOnly={isFromGoogle}
                    placeholder="name@company.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium placeholder:text-slate-300 ${isFromGoogle
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 cursor-not-allowed"
                      : "bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50"
                      }`}
                    required
                  />
                  {isFromGoogle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded-full">
                      Google
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <FaLock size={12} />
                  </div>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact No</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <FaPhone size={12} />
                  </div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Portal Role</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 pointer-events-none transition-colors z-10">
                    <FaUserTag size={12} />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-bold text-slate-600 appearance-none cursor-pointer relative z-0"
                  >
                    <option value="user">Internal Staff</option>
                    <option value="technician">Service Technician</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Location</label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <FaMapMarkerAlt size={12} />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="HQ / Branch Office"
                    rows={1}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-medium placeholder:text-slate-300 resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:bg-indigo-400 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Professional Account"
              )}
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-white px-2 text-slate-400 font-bold tracking-tighter">Registration via Social</span>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error("Google Registration Failed")
                }}
                useOneTap
                theme="outline"
                shape="pill"
                width="100%"
              />
            </div>
          </div>

          <p className="text-center mt-10 text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em]">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 ml-1">
              Sign In Instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

