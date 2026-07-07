import { useNavigate } from "react-router-dom";
import { FaStar, FaArrowRight, FaPhoneAlt, FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const stats = [
  { number: "500+", label: "Students Enrolled" },
  { number: "4.9★", label: "Average Rating" },
  { number: "100%", label: "CBSE Curriculum" },
  { number: "2024", label: "Established" },
];

const highlights = [
  "Class X & XII Expert Coaching",
  "Railway & SSC Exam Prep",
  "English Medium Instruction",
  "Small Batch Sizes",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
};

export default function Hero1() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center">
      {/* Background orbs */}
      {!isMobile && (
        <>
          <div className="absolute rounded-full blur-[100px] pointer-events-none opacity-40 bg-[radial-gradient(circle,#1a3af5,transparent)] w-[600px] h-[600px] -top-[150px] -left-[150px] animate-float" />
          <div className="absolute rounded-full blur-[100px] pointer-events-none opacity-30 bg-[radial-gradient(circle,#06b6d4,transparent)] w-[400px] h-[400px] -bottom-[100px] -right-[80px] [animation:float_6s_ease-in-out_infinite_reverse]" />
          <div className="absolute rounded-full blur-[100px] pointer-events-none opacity-20 bg-[radial-gradient(circle,#f59e0b,transparent)] w-[300px] h-[300px] top-[40%] right-[20%]" />
        </>
      )}

      {/* Dot grid */}
      <div className="bg-dots absolute inset-0 opacity-40" />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 pt-36 md:pt-28 pb-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left">

        {/* ── LEFT COLUMN ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.72rem] font-semibold tracking-wider uppercase mb-5 bg-[#1a3af5]/10 border border-[#1a3af5]/20 text-[#1a3af5] mx-auto md:mx-0">
            <FaStar className="text-[#f59e0b] shrink-0" />
            Kanniyakumari's Premier Coaching Centre
          </motion.div>

          {/* Heading — clamp scales from mobile to desktop */}
          <motion.h1 variants={itemVariants} className="font-primary text-[clamp(2rem,8vw,4rem)] font-black leading-[1.1] text-slate-900 mb-5 tracking-[-0.03em]">
            Unlock Your{" "}
            <span className="text-shimmer">Academic</span>
            <br />
            <span className="text-slate-900">Potential With</span>
            <br />
            <span className="text-shimmer">Gateway Academy</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={itemVariants} className="text-[0.98rem] text-slate-600 leading-[1.8] mb-7 max-w-[480px] mx-auto md:mx-0">
            Expert coaching for Class X &amp; XI students with CBSE curriculum.
            We also prepare students for Railway &amp; SSC competitive exams — all in English medium.
          </motion.p>

          {/* Highlights */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-8 max-w-fit mx-auto md:mx-0 text-left">
            {highlights.map(h => (
              <div key={h} className="flex items-center gap-2.5 text-slate-700 text-[0.9rem] font-medium">
                <FaCheckCircle className="text-[#06b6d4] shrink-0" />
                {h}
              </div>
            ))}
          </motion.div>

          {/* CTA — full width on mobile, auto on sm+ */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center md:justify-start">
            <button
              onClick={() => navigate("/enroll")}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] text-white font-primary font-bold text-[0.95rem] border-none cursor-pointer transition-all duration-300 shadow-[0_4px_16px_rgba(26,58,245,0.25)] hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_24px_rgba(6,182,212,0.35)]"
            >
              Start Learning <FaArrowRight />
            </button>
            <div className="flex gap-3">
              <a
                href="tel:08511350499"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white text-slate-700 font-primary font-semibold text-[0.9rem] border border-slate-300 no-underline transition-all duration-300 hover:border-[#06b6d4] hover:text-[#06b6d4] hover:shadow-md"
              >
                <FaPhoneAlt /> Call
              </a>
              <a
                href="https://wa.me/918511350499"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#25d366]/10 border border-[#25d366]/30 text-[#16a34a] font-semibold text-[0.9rem] no-underline transition-all duration-300 hover:bg-[#25d366]/20"
              >
                <FaWhatsapp className="text-[1.05rem]" /> WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Mobile-only: compact stats grid below CTA */}
          <motion.div variants={itemVariants} className="sm:hidden grid grid-cols-2 gap-3 mt-8">
            {stats.map(s => (
              <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-3.5 text-center shadow-sm">
                <p className="font-primary font-black text-[1.2rem] text-shimmer">{s.number}</p>
                <p className="text-slate-500 text-[0.68rem] mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN — hidden on small phones, shown sm+ ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
          className="hidden sm:flex justify-center items-center"
        >
          <div className="relative w-full max-w-[400px] mt-6 mx-4">

            {/* Main floating card */}
            <div className="animate-float bg-white border border-slate-200 shadow-xl rounded-[28px] p-8 relative overflow-hidden text-left">
              <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(6,182,212,0.15),transparent)] rounded-full" />

              <div className="relative z-[1]">
                <div className="w-[80px] h-[80px] flex items-center justify-center mb-5">
                  <img src="/logo.png" alt="Gateway Academy Logo" className="w-full h-full object-contain" />
                </div>

                <h2 className="font-primary font-extrabold text-[1.5rem] text-slate-900 mb-1">
                  Gateway Academy
                </h2>
                <p className="text-slate-500 text-[0.82rem] mb-5 font-medium">
                  📍 Thingal Nagar, Kanniyakumari – 629802
                </p>

                {/* Rating */}
                <div className="inline-flex items-center gap-1.5 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-full px-4 py-1.5 mb-5">
                  {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className="text-[#f59e0b] text-[0.8rem]" />)}
                  <span className="text-[#d97706] font-bold text-[0.88rem]">4.9</span>
                  <span className="text-slate-500 text-[0.78rem]">(38 Reviews)</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {stats.map(s => (
                    <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center transition-transform hover:-translate-y-1 hover:shadow-md">
                      <p className="font-primary font-black text-[1.3rem] text-shimmer">{s.number}</p>
                      <p className="text-slate-500 text-[0.7rem] mt-0.5 font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge – Established */}
            <div className="absolute bottom-0 left-0 bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] rounded-2xl px-4 py-2.5 shadow-[0_8px_24px_rgba(245,158,11,0.3)]">
              <p className="font-primary font-extrabold text-[1rem] text-white">Est. 2024</p>
              <p className="text-[0.65rem] text-white/90 font-semibold">Thingal Nagar</p>
            </div>

            {/* Floating badge – Open */}
            <div className="absolute top-0 right-0 bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] animate-pulse-glow" />
                <span className="font-primary font-bold text-[0.82rem] text-slate-800">Open till 5:30 PM</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}