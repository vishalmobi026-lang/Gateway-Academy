import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed. Please check your credentials.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      window.dispatchEvent(new Event("storage"));
      
      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.15, duration: 0.5 }
    })
  };

  const shakeVariants = {
    error: { 
      x: [-10, 10, -10, 10, 0], 
      transition: { duration: 0.4 } 
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-100">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[150px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-[450px] px-6"
      >
        <motion.div 
          animate={error ? "error" : ""} 
          variants={shakeVariants}
          className="bg-white p-10 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] border border-slate-100"
        >
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">
              Admin Portal
            </h1>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
              Gateway Academy Enterprise
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div 
              custom={1}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300"
                placeholder="Enter admin ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </motion.div>

            <motion.div 
              custom={2}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  Password
                </label>
                <button 
                  type="button"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.button
              custom={3}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              disabled={isLoading}
              className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] ${
                isLoading 
                  ? "bg-slate-300 cursor-not-allowed opacity-80" 
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  <span>Authenticating</span>
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-xs font-medium">
              Having trouble logging in? <a href="#" className="text-blue-600 font-bold hover:underline">Contact Support</a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}