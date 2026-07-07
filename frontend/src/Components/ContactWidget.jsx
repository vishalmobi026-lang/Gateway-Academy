import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Lottie from "lottie-react";
import catAnimation from "../assets/game/cat.json";
import ToastNotification from "./ToastNotification";

const LottieComponent = Lottie.default || Lottie;

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [toastConfig, setToastConfig] = useState({ visible: false, type: "success", message: "" });
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setToastConfig({ visible: true, type: "error", message: "Please fill in your Name and Phone Number." });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/enquiries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: formData.name,
          phone: formData.phone,
          email: formData.email || "N/A",
          message: "Widget Enquiry",
          source: "widget"
        })
      });

      if (!response.ok) throw new Error("Failed to submit");

      setToastConfig({ visible: true, type: "success", message: "Your enquiry has been sent successfully!" });
      setFormData({ name: "", phone: "", email: "" });
    } catch (error) {
      console.error(error);
      setToastConfig({ visible: true, type: "error", message: "Failed to send enquiry. Please try again." });
    }
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("contactWidgetState", { detail: isOpen }));
  }, [isOpen]);

  // Footer observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setShowWidget(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footer = document.querySelector("footer");
    if (footer) observer.observe(footer);

    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, []);

  return (
    <>
  
 <AnimatePresence>
        {!isOpen && showWidget && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-8 right-8 z-[90] w-14 sm:w-16 h-14 sm:h-16 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-300 bg-white"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            style={{ willChange: "transform, opacity" }}
          >
            {/* Tooltip 'Need Help?' */}
            <div className="absolute -top-12 sm:-top-14 right-[-4px] bg-white text-slate-800 text-[11px] sm:text-xs font-bold font-primary tracking-wide px-3.5 sm:px-4 py-2 rounded-2xl shadow-[0_8px_20px_rgba(15,23,42,0.15)] border border-slate-200 whitespace-nowrap pointer-events-none flex items-center gap-2 animate-[bounce_3s_infinite]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              Need help?
              {/* Tail pointing down */}
              <div className="absolute -bottom-[5px] right-6 w-2.5 h-2.5 bg-white border-b border-r border-slate-200 rotate-45 rounded-[2px]" />
            </div>

            <img 
              src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9f6.svg" 
              alt="Yarn Ball" 
              className="absolute inset-0 w-full h-full object-contain scale-[1.2]" 
            />
            <LottieComponent animationData={catAnimation} loop={true} className="w-full h-full scale-[1.8] relative z-10 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {isOpen && showWidget && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-[380px] max-w-[calc(100vw-2rem)] max-h-[85vh] z-[1001] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col border border-slate-200"
            >
              {/* Top Header Section */}
              <div className="bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] p-6 pb-8 sm:p-8 sm:pb-10 relative shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="inline-block px-3 py-1 bg-white/20 border border-white/30 rounded-full text-white text-[9px] font-black tracking-widest mb-3 sm:mb-5 uppercase shadow-sm">
                  Gateway Support
                </div>
                <h3 className="text-white text-2xl sm:text-[28px] font-black font-primary mb-2 sm:mb-3 leading-tight">Start your enquiry</h3>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed pr-4 font-medium">
                  Share your details and our team will contact you soon.
                </p>
              </div>

              {/* Form Section */}
              <div className="p-6 pt-5 sm:p-8 sm:pt-6 bg-white flex-1 relative overflow-y-auto">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-2 focus:ring-[#1a3af5]/20" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-2 focus:ring-[#1a3af5]/20" 
                    />
                  </div>

                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-2 focus:ring-[#1a3af5]/20" 
                    />
                  </div>

                  <button type="submit" className="mt-2 w-full py-3.5 sm:py-4 bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] text-white font-black rounded-xl shadow-[0_8px_20px_rgba(26,58,245,0.25)] hover:shadow-[0_12px_24px_rgba(6,182,212,0.35)] transition-all hover:-translate-y-0.5 hover:scale-[1.02] text-sm tracking-widest uppercase">
                    Send Enquiry
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ToastNotification 
        type={toastConfig.type} 
        message={toastConfig.message} 
        visible={toastConfig.visible} 
        onClose={() => setToastConfig({ ...toastConfig, visible: false })} 
      />
    </>
  );
}
