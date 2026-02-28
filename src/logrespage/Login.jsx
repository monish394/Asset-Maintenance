import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import axios from "../config/api";
import { toast } from "sonner";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import logBg from "../assets/login_bg.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [clienterr, setClienterr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setClienterr("");

    if (!email || !password) {
      setClienterr("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/userslogin", { email, password });

      if (res.data?.err) {
        setClienterr(res.data.err || "Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      if (remember) localStorage.setItem("rememberEmail", email);

      toast.success("Welcome back!", { duration: 1000 });

      setTimeout(() => {
        setLoading(false);
        const role = res.data.role;
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "user") navigate("/user", { replace: true });
        else if (role === "technician") navigate("/technician/home", { replace: true });
        else navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      console.error(err);
      setClienterr("Invalid email or password.");
      toast.error("Login failed", { duration: 2000 });
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("/google-login", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.role);
      toast.success("Welcome back!", { duration: 1000 });

      setTimeout(() => {
        const role = res.data.role;
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "user") navigate("/user", { replace: true });
        else if (role === "technician")
          navigate("/technician/home", { replace: true });
        else navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <style>{`
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
        className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-white relative overflow-hidden"
      >
        <Link to="/home" className="absolute top-12 left-12 flex items-center gap-2 text-slate-700 hover:text-indigo-600 text-[11px] font-bold uppercase tracking-[0.2em] transition-all group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Homee
        </Link>

        <div className="max-w-md w-full mx-auto mt-15">
          <div className="mb-12">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">Sign In</h1>
            <p className="text-slate-500 text-sm font-medium">Access your enterprise asset management portal.</p>
          </div>

          {clienterr && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-xs font-bold"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              {clienterr}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <FaEnvelope size={14} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Password</label>
                <button type="button" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">Lost Access?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <FaLock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-200 rounded-md bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                    <svg className={`w-3 h-3 text-white ${remember ? 'block' : 'hidden'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">Remember this device</span>
              </label>
            </div>

            {/* Fixed: Changed py-4 to py-3, text-xs to text-sm for better proportion */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all disabled:bg-indigo-400 flex items-center justify-center gap-2 text-sm mt-8"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FaShieldAlt size={12} />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 font-bold">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
                useOneTap
                theme="outline"
                shape="pill"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-16 text-center border-t border-slate-100 pt-10">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em]">
              Authorized personnel only.{" "}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={logBg}
            alt="Professional Workspace"
            className="absolute inset-0 w-full h-full object-cover bg-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/60 to-indigo-900/40" />
        </div>

        <div className="relative z-20 flex flex-col h-full justify-center p-24 text-white max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="backdrop-blur-md bg-white/5 border border-white/10 p-12 rounded-3xl shadow-2xl"
          >
            <div className="w-12 h-1 bg-indigo-500 rounded-full mb-10" />
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">
              Precision in every <span className="text-indigo-400">Asset</span>.
            </h2>
            <p className="text-base text-slate-300 font-medium leading-relaxed mb-12">
              Our enterprise solution provides the granular control needed to maintain peak operational efficiency across your entire lifecycle.
            </p>

            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300">
              <span className="flex items-center gap-2 underline underline-offset-8">Secure</span>
              <span className="flex items-center gap-2 underline underline-offset-8">Robust</span>
              <span className="flex items-center gap-2 underline underline-offset-8">Scalable</span>
            </div>
          </motion.div>

          <div className="mt-auto">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Core Infrastructure v.2.4.0</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}