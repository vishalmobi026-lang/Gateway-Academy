import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import studyVideo from "./assets/About_sec/study_video.mp4";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaHandshake,
  FaChartLine,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const values = [
  {
    icon: <FaGraduationCap />,
    title: "Academic Excellence",
    desc: "We maintain the highest teaching standards with a curriculum designed for real results — not rote learning.",
    color: "#1a3af5",
    gradient: "from-[#1a3af5] to-[#4361ee]",
  },
  {
    icon: <FaHandshake />,
    title: "Personal Mentorship",
    desc: "Every student gets a dedicated mentor who tracks their progress, strengths, and areas for improvement.",
    color: "#06b6d4",
    gradient: "from-[#06b6d4] to-[#38bdf8]",
  },
  {
    icon: <FaChartLine />,
    title: "Structured Growth",
    desc: "Our phased learning approach builds confidence week by week with regular assessments and feedback.",
    color: "#f59e0b",
    gradient: "from-[#f59e0b] to-[#fbbf24]",
  },
  {
    icon: <FaHeart />,
    title: "Student-First Culture",
    desc: "We treat every student like family — small batches, open-door policy, and a supportive learning environment.",
    color: "#ec4899",
    gradient: "from-[#ec4899] to-[#f472b6]",
  },
];

const milestones = [
  {
    year: "2024",
    event: "Gateway Academy founded at Thingal Nagar, Kanniyakumari",
  },
  {
    year: "2024",
    event: "First CBSE coaching batch of 40+ students enrolled",
  },
  {
    year: "2025",
    event: "Launched Railway & SSC competitive exam coaching",
  },
];

// Add your own image paths here for the auto-swapping slider
const sliderImages = [
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
];

// Premium spring & easing variables for dynamic bi-directional scroll reveal
const cinematicReveal = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const slideLeft = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 75,
    },
  },
};

const slideRight = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 75,
    },
  },
};

const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function About() {
  const navigate = useNavigate();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % sliderImages.length);
    }, 1500); // Swaps every 1.5 seconds

    return () => clearInterval(timer);
  }, []);

  // On mobile: pause the video immediately after mount to prevent
  // the autoPlay + loop from hammering the GPU and causing lag/hanging.
  useEffect(() => {
    if (isMobile && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <div className="pt-32 md:pt-20 min-h-screen bg-slate-50/60 relative overflow-x-hidden antialiased selection:bg-blue-500/20">
      {/* Premium Background Layer Architectural Accent Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] md:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Floating Kinetic Ambient Orbs */}
      {!isMobile && (
        <>
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.12, 1],
              x: [0, 20, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.15] bg-gradient-to-tr from-[#1a3af5] via-indigo-500 to-transparent pointer-events-none"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[20%] right-[-5%] w-[700px] h-[700px] rounded-full blur-[160px] opacity-[0.15] bg-gradient-to-br from-[#06b6d4] via-emerald-400 to-transparent pointer-events-none"
          />
        </>
      )}

      {/* Hero Banner - Optimized Padding */}
      <motion.div
        variants={isMobile ? {} : cinematicReveal}
        initial={isMobile ? false : "hidden"}
        whileInView={isMobile ? false : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="text-center pt-16 pb-12 sm:pt-20 sm:pb-14 px-5 relative overflow-hidden bg-white/70 border-b border-slate-200/60 backdrop-blur-md z-10 shadow-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-xs font-bold text-[#1a3af5] uppercase tracking-wider mb-5 shadow-sm">
          ✨ Discover Our Mission
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-primary text-[clamp(2.5rem,6vw,4.75rem)] font-black text-slate-900 mb-5 relative z-10 tracking-tight leading-none">
          About <span className="text-shimmer">Gateway Academy</span>
        </motion.h1>

        <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
          Learn about our journey, our people, and why hundreds of families in
          Kanniyakumari trust us with their children's futures.
        </p>
      </motion.div>

      {/* Our Story - Optimized Padding */}
      <div className="max-w-[1200px] mx-auto px-5 py-12 sm:py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            variants={isMobile ? {} : slideLeft}
            initial={isMobile ? false : "hidden"}
            whileInView={isMobile ? false : "visible"}
            viewport={{ once: true, amount: 0.1 }}>
            <div className="inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.2em] uppercase text-[#f59e0b] mb-3">
              Our Story
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-primary text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-5 relative z-10 tracking-tight leading-tight">
              Building a Legacy of{" "}
              <span className="text-shimmer">Academic Excellence</span>
            </motion.h2>

            <div className="space-y-4 text-slate-600 font-medium text-[1.05rem] leading-relaxed">
              <p>
                Gateway Academy was born out of a simple belief — every student
                in Kanniyakumari deserves access to quality education.
              </p>
              <p>
                Today, we serve over 500 students across CBSE board coaching and
                competitive exam preparation.
              </p>
              <p className="text-slate-900 font-semibold border-l-4 border-l-blue-600 pl-4 py-1 bg-blue-50/50 rounded-r-xl">
                What sets us apart is our commitment to small batch sizes,
                personalised attention and quality teaching.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={isMobile ? {} : slideRight}
            initial={isMobile ? false : "hidden"}
            whileInView={isMobile ? false : "visible"}
            viewport={{ once: true, amount: 0.1 }}
            className="flex justify-center">
            <motion.div
              animate={isMobile ? {} : { y: [0, -6, 0] }}
              transition={isMobile ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={isMobile ? {} : {
                scale: 1.02,
                boxShadow: "0 30px 60px -15px rgba(15, 23, 42, 0.12)",
              }}
              className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 shadow-xl shadow-slate-200/50 text-center max-w-[390px] w-full relative overflow-hidden group transition-all duration-300 transform-gpu">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1a3af5] via-[#06b6d4] to-[#f59e0b]" />

              <div className="w-[120px] h-[120px] mx-auto mb-5 bg-slate-50 border border-slate-100 rounded-3xl p-3 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/logo.png"
                  alt="Gateway Academy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-primary font-black text-2xl text-slate-900 mb-1 tracking-tight">
                Gateway Academy
              </h3>

              <p className="text-[#f59e0b] font-bold text-xs uppercase tracking-widest mb-5 italic">
                "Way to Success"
              </p>

              <div className="flex flex-col gap-3.5 text-left bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 shadow-inner">
                <div className="flex items-start gap-3.5 text-sm font-medium">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-[#1a3af5] flex items-center justify-center shrink-0 shadow-sm">
                    <FaMapMarkerAlt />
                  </div>
                  <span className="text-slate-600 leading-snug pt-0.5">
                    Thingal Nagar, Kanniyakumari – 629802
                  </span>
                </div>

                <div className="flex items-start gap-3.5 text-sm font-medium">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 text-[#06b6d4] flex items-center justify-center shrink-0 shadow-sm">
                    <FaPhoneAlt />
                  </div>
                  <span className="text-slate-800 font-bold pt-1.5">
                    08511350499
                  </span>
                </div>

                <div className="flex items-start gap-3.5 text-sm font-medium">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-[#f59e0b] flex items-center justify-center shrink-0 shadow-sm">
                    <FaClock />
                  </div>
                  <span className="text-slate-600 leading-snug pt-0.5">
                    Mon–Sat, 8:00 AM – 5:30 PM
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Media Showcase Section */}
      <div className="max-w-[1200px] mx-auto px-5 py-8 sm:py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
          className="flex flex-col lg:flex-row gap-6 items-stretch"
        >
          {/* Left: Image Container (Wider) */}
          <div className="relative w-full lg:flex-[1.6] shrink-0 rounded-[32px] overflow-hidden shadow-xl h-[300px] sm:h-[400px] md:h-[480px] group transform-gpu border border-slate-200/50 bg-slate-100 flex items-center justify-center">
            {sliderImages.map((src, index) => (
              <img 
                key={index}
                src={src} 
                alt={`Gateway Academy Campus ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 group-hover:scale-105 transform-gpu ${
                  index === currentImgIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none z-20" />
          </div>

          {/* Right: Video Container (Narrower) */}
          <div className="relative w-full lg:flex-1 shrink-0 rounded-[32px] overflow-hidden shadow-xl h-[300px] sm:h-[400px] md:h-[480px] group transform-gpu bg-slate-900 border border-slate-800 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay={!isMobile}
              loop={!isMobile}
              muted
              playsInline
              preload={isMobile ? "none" : "auto"}
              className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
            >
              <source src={studyVideo} type="video/mp4" />
            </video>

            {/* On mobile: show a static play button so the user can tap to play */}
            {isMobile && (
              <button
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  if (v.paused) {
                    v.play();
                  } else {
                    v.pause();
                  }
                }}
                className="absolute z-30 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-2xl shadow-xl hover:bg-white/30 transition-all duration-200"
                aria-label="Play video"
              >
                ▶
              </button>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Timeline - Optimized Padding */}
      <div className="bg-white border-y border-slate-200/80 py-16 sm:py-20 px-5 relative z-10 shadow-sm">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            variants={isMobile ? {} : cinematicReveal}
            initial={isMobile ? false : "hidden"}
            whileInView={isMobile ? false : "visible"}
            viewport={{ once: true, amount: 0.1 }}
            className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-primary text-4xl sm:text-4xl font-black text-slate-900 mb-5 relative z-10 tracking-tight leading-none">
              Our <span className="text-shimmer"> Journey</span>
            </motion.h2>

            <p className="text-slate-500 font-semibold tracking-wide uppercase text-xs">
              Key milestones in our growth
            </p>
          </motion.div>

          <div className="flex flex-col gap-0 max-w-xl mx-auto relative pl-4">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={isMobile ? false : { opacity: 0, y: 30 }}
                whileInView={isMobile ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex gap-6 items-start group relative">
                <div className="flex flex-col items-center self-stretch">
                  <motion.div
                    animate={isMobile ? {} : { scale: [1, 1.15, 1] }}
                    transition={isMobile ? {} : {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] ring-4 ring-blue-50 shadow-md shrink-0 mt-1.5 relative z-10 cursor-pointer group-hover:from-amber-500 group-hover:to-[#f59e0b] group-hover:ring-amber-50 transition-all duration-300"
                  />

                  {i < milestones.length - 1 && (
                    <div className="w-0.5 bg-slate-200 group-hover:bg-blue-300 flex-1 min-h-[60px] my-1 transition-colors duration-300" />
                  )}
                </div>

                <div className="pb-10 transform transition-all duration-300 group-hover:translate-x-1.5">
                  <span className="font-primary font-black text-[#1a3af5] text-xs tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full inline-block mb-2 shadow-sm">
                    {m.year}
                  </span>
                  <p className="text-slate-700 font-bold text-[1.05rem] leading-relaxed group-hover:text-slate-900 transition-colors duration-200">
                    {m.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values - Optimized Padding */}
      <div className="max-w-[1200px] mx-auto px-5 py-16 sm:py-20 relative z-10">
        <motion.div
          variants={isMobile ? {} : cinematicReveal}
          initial={isMobile ? false : "hidden"}
          whileInView={isMobile ? false : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-primary text-4xl sm:text-4xl font-black text-slate-900 mb-5 relative z-10 tracking-tight leading-none">
            What We <span className="text-shimmer"> Stand For</span>
          </motion.h2>
          <p className="text-slate-600 max-w-lg mx-auto font-medium">
            Our core values shape every interaction, every lesson, and every
            student outcome.
          </p>
        </motion.div>

        <motion.div
          variants={isMobile ? {} : containerStagger}
          initial={isMobile ? false : "hidden"}
          whileInView={isMobile ? false : "visible"}
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              variants={isMobile ? {} : {
                hidden: { opacity: 0, scale: 0.94, y: 30 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 75, damping: 16 },
                },
              }}
              whileHover={isMobile ? {} : {
                scale: 1.015,
                y: -4,
                boxShadow: "0 25px 50px -20px rgba(15,23,42,0.1)",
                borderLeftColor: v.color,
              }}
              className="bg-white border border-slate-200/90 border-l-4 border-l-transparent rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300 flex items-start gap-6 group transform-gpu">
              <motion.div
                animate={isMobile ? {} : { y: [0, -4, 0] }}
                transition={isMobile ? {} : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.25,
                }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300"
                style={{
                  background: `linear-gradient(135deg, ${v.color}, ${v.color}dd)`,
                }}>
                {v.icon}
              </motion.div>

              <div>
                <h3 className="font-primary font-bold text-xl text-slate-900 mb-2 group-hover:text-[#1a3af5] transition-colors duration-200">
                  {v.title}
                </h3>
                <p className="text-slate-600 text-[0.95rem] font-medium leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section - Optimized Padding */}
      <div className="bg-slate-50 border-t border-slate-200/60 py-16 sm:py-20 px-5 relative overflow-hidden z-10 shadow-inner">
        {!isMobile && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a3af5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          </>
        )}

        <motion.div
          variants={isMobile ? {} : cinematicReveal}
          initial={isMobile ? false : "hidden"}
          whileInView={isMobile ? false : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-[850px] mx-auto text-center relative z-10 bg-white border border-slate-200/80 p-8 md:p-16 rounded-[48px] shadow-xl shadow-slate-200/40 transform-gpu">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-primary text-4xl sm:text-4xl font-black text-slate-900 mb-5 relative z-10 tracking-tight leading-none">
            Want to be part of <span className="text-shimmer"> our story?</span>
          </motion.h2>

          <p className="text-slate-600 text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed">
            Join Gateway Academy today and take the first step towards your
            guaranteed academic success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-xs mx-auto sm:max-w-none">
            <motion.button
              whileHover={{
                scale: 1.03,
                y: -3,
                boxShadow: "0 15px 30px rgba(26,58,245,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/enroll")}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] text-white font-primary font-bold shadow-md cursor-pointer border-none transition-all duration-200">
              Enroll Now <FaArrowRight className="text-xs" />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.03,
                y: -3,
                backgroundColor: "#f8fafc",
                borderColor: "#cbd5e1",
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-white border border-slate-300 text-slate-700 font-primary font-bold shadow-sm cursor-pointer transition-all duration-200">
              Get in Touch
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
