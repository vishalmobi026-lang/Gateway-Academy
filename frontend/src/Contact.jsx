import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import ToastNotification from "./Components/ToastNotification";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const slideLeft = {
  hidden: {
    opacity: 0,
    x: -120,
    rotate: -5,
  },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
};

const slideRight = {
  hidden: {
    opacity: 0,
    x: 120,
    rotate: 5,
  },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
};

const zoomReveal = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

export default function Contact() {
  const [toastConfig, setToastConfig] = useState({ visible: false, type: "success", message: "" });
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setToastConfig({ visible: true, type: "error", message: "Please fill in your Name, Phone Number, and Message." });
      return;
    }

    try {
      const response = await fetch("https://gateway-academy.onrender.com/enquiries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: formData.name,
          phone: formData.phone,
          email: formData.email || "N/A",
          message: formData.message,
          source: "contact_page"
        })
      });

      if (!response.ok) throw new Error("Failed to submit");

      setToastConfig({ visible: true, type: "success", message: "Your message has been sent successfully!" });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setToastConfig({ visible: true, type: "error", message: "Failed to send message. Please try again later." });
    }
  };

  return (
    <div className="pt-32 md:pt-20 min-h-screen bg-slate-50 relative overflow-hidden">

      {/* Animated Background Orb */}
      <motion.div
        animate={isMobile ? {} : {
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={isMobile ? {} : {
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className={`absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[160px] opacity-20 bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-purple-500/30 pointer-events-none ${isMobile ? 'animate-orb-2' : ''}`}
      />

      {/* Hero */}
      <motion.div
        variants={zoomReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center py-10 sm:py-16 px-5 relative overflow-hidden bg-white border-t border-slate-200"
      >
        <div className="absolute rounded-full blur-[80px] pointer-events-none opacity-10 bg-[radial-gradient(circle,#06b6d4,transparent)] w-[600px] h-[600px] top-0 left-1/2 -translate-x-1/2" />

        <h1 className="font-primary text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-slate-900 mb-6 relative z-10">
          Contact <span className="text-shimmer">Us</span>
        </h1>

        <p className="text-slate-600 text-lg max-w-2xl mx-auto relative z-10">
          We'd love to hear from you. Reach out to us for admissions,
          course details, or any other queries.
        </p>
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-5 py-10 sm:py-16 pt-0 sm:pt-0 grid md:grid-cols-2 gap-10 md:gap-16">

        {/* Contact Information */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="font-primary font-bold text-3xl text-slate-900 mb-8">
            Get In Touch
          </h2>

          <div className="flex flex-col gap-6">

            {/* Location */}
            <motion.div
              whileHover={isMobile ? {} : {
                y: -12,
                scale: 1.05,
                rotateX: 8,
                rotateY: 8,
              }}
              transition={isMobile ? {} : {
                type: "spring",
                stiffness: 300,
              }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#06b6d4]/50 transition-all shadow-sm hover:shadow-xl"
            >
              <motion.div
                animate={isMobile ? {} : { y: [0, -8, 0] }}
                transition={isMobile ? {} : {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-12 h-12 rounded-xl bg-[#1a3af5]/10 flex items-center justify-center text-[#1a3af5] text-xl shrink-0"
              >
                <FaMapMarkerAlt />
              </motion.div>

              <a
  href="https://maps.google.com/?q=Monday+Market+Thingal+Nagar+Manoj+Medical+Backside+Kanniyakumari+629802"
  target="_blank"
  rel="noopener noreferrer"
  className="block cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
>
  <div>
    <h4 className="font-bold text-slate-900 mb-1">
      Our Location
    </h4>

    <p className="text-slate-600 text-sm leading-relaxed">
      Monday Market Thingal Nagar
      <br />
      Manoj Medical Backside
      <br />
      Kanniyakumari - 629802, Tamil Nadu
    </p>
  </div>
</a>
            </motion.div>

            {/* Phone */}
            <motion.div
              whileHover={isMobile ? {} : {
                y: -12,
                scale: 1.05,
                rotateX: 8,
                rotateY: 8,
              }}
              transition={isMobile ? {} : {
                type: "spring",
                stiffness: 300,
              }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#f59e0b]/50 transition-all shadow-sm hover:shadow-xl"
            >
              <motion.div
                animate={isMobile ? {} : { y: [0, -8, 0] }}
                transition={isMobile ? {} : {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b] text-xl shrink-0"
              >
                <FaPhoneAlt />
              </motion.div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  Call Us
                </h4>

                <p className="text-slate-600 text-sm">
                  08511350499
                </p>
              </div>
            </motion.div>
                        {/* WhatsApp */}
            <motion.div
              whileHover={isMobile ? {} : {
                y: -12,
                scale: 1.05,
                rotateX: 8,
                rotateY: 8,
              }}
              transition={isMobile ? {} : {
                type: "spring",
                stiffness: 300,
              }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-green-50 border border-green-200 hover:border-green-400 transition-all shadow-sm hover:shadow-xl"
            >
              <motion.div
                animate={isMobile ? {} : { y: [0, -8, 0] }}
                transition={isMobile ? {} : {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-12 h-12 rounded-xl bg-[#25d366]/20 flex items-center justify-center text-[#16a34a] text-xl shrink-0"
              >
                <FaWhatsapp />
              </motion.div>

              <div>
                <h4 className="font-bold text-[#16a34a] mb-1">
                  WhatsApp
                </h4>

                <a
                  href="https://wa.me/918511350499"
                  className="text-slate-600 text-sm hover:text-[#16a34a]"
                >
                  Message us directly
                </a>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative rounded-[28px] p-[1px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
        >
          <div className="bg-white rounded-[28px] p-6 sm:p-8 h-full">

            <h3 className="font-primary font-bold text-2xl text-slate-900 mb-6">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 text-sm transition-all shadow-sm outline-none focus:border-[#06b6d4] focus:ring-4 focus:ring-[#06b6d4]/10"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 text-sm transition-all shadow-sm outline-none focus:border-[#06b6d4] focus:ring-4 focus:ring-[#06b6d4]/10"
              />

              <input
                type="email"
                placeholder="Email Address (Optional)"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 text-sm transition-all shadow-sm outline-none focus:border-[#06b6d4] focus:ring-4 focus:ring-[#06b6d4]/10"
              />

              <textarea
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 text-sm transition-all shadow-sm outline-none focus:border-[#06b6d4] focus:ring-4 focus:ring-[#06b6d4]/10 resize-none"
              />

              <motion.button
                whileHover={isMobile ? {} : {
                  scale: 1.05,
                  y: -4,
                }}
                whileTap={isMobile ? {} : {
                  scale: 0.95,
                }}
                transition={isMobile ? {} : {
                  type: "spring",
                  stiffness: 400,
                }}
                type="submit"
                className="inline-flex justify-center items-center gap-2 w-full py-4 rounded-xl bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] text-white font-primary font-bold text-[1rem] border-none cursor-pointer shadow-[0_4px_24px_rgba(26,58,245,0.25)] hover:shadow-[0_8px_32px_rgba(6,182,212,0.35)] mt-2"
              >
                Submit Message
              </motion.button>

            </form>

          </div>
        </motion.div>

      </div>

      <ToastNotification 
        type={toastConfig.type} 
        message={toastConfig.message} 
        visible={toastConfig.visible} 
        onClose={() => setToastConfig({ ...toastConfig, visible: false })} 
      />
    </div>
  );
}