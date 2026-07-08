import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaArrowRight, 
  FaBookOpen, 
  FaTrain, 
  FaFileAlt, 
  FaUserGraduate, 
  FaClock, 
  FaChalkboardTeacher, 
  FaClipboardList, 
  FaUsers 
} from "react-icons/fa";

// Import custom images
import classXImg from "./assets/Class X CBSE Coaching.png";
import classXIImg from "./assets/Class XI CBSE Coaching.png";
import rrbImg from "./assets/Railway Exam Prep (RRB).png";
import sscImg from "./assets/SSC Exam Prep.png";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const iconMap = {
  "FaUserGraduate": <FaUserGraduate />,
  "FaBookOpen": <FaBookOpen />,
  "FaTrain": <FaTrain />,
  "FaFileAlt": <FaFileAlt />,
};

const imageMap = {
  "Class X CBSE Coaching.png": classXImg,
  "Class XI CBSE Coaching.png": classXIImg,
  "Railway Exam Prep (RRB).png": rrbImg,
  "SSC Exam Prep.png": sscImg,
};

// Complex Animation Tokens
const titleReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const statsContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } }
};

const statItem = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const scrollRevealLeft = {
  hidden: { opacity: 0, x: -100, y: 40, scale: 0.95 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { type: "spring", damping: 22, stiffness: 70 } }
};

const scrollRevealRight = {
  hidden: { opacity: 0, x: 100, y: 40, scale: 0.95 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { type: "spring", damping: 22, stiffness: 70 } }
};

const badgeContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const badgeItem = {
  hidden: { opacity: 0, scale: 0.6, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 12 } }
};



export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://gateway-academy.onrender.com/courses/");
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        
        const formattedCourses = data.map(c => ({
          id: c.id.toString(),
          icon: iconMap[c.icon] || <FaUserGraduate />,
          title: c.title,
          image: imageMap[c.image_url] || classXImg,
          Learning_Mode: c.learning_mode,
          desc: c.description,
          subjects: c.disciplines.map(d => d.name),
          highlights: c.deliverables.map(d => d.name),
          color: c.color,
          duration: c.duration,
          batchSize: c.batch_size,
          schedule: c.schedule
        }));
        
        setCourses(formattedCourses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="pt-32 md:pt-20 min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden relative perspective-1000 select-none">
   
      {/* ─── HYPER-PREMIUM LIGHT AMBIENT BACKGROUND SYSTEM ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Engineering Mesh Layout Overlap */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_-1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        
        {/* Ambient Plasma Orbs tuned for high visibility on light backgrounds */}
        {!isMobile && (
          <>
            <motion.div 
              animate={{ x: [0, 40, -20, 0], y: [0, -60, 30, 0], scale: [1, 1.15, 0.9, 1] }} 
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-20 w-[550px] h-[550px] bg-gradient-to-br from-blue-200/40 to-cyan-200/30 rounded-full blur-[100px]" 
            />
            <motion.div 
              animate={{ x: [0, -50, 30, 0], y: [0, 70, -40, 0], scale: [1, 1.2, 0.85, 1] }} 
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-[40%] -right-32 w-[650px] h-[650px] bg-gradient-to-tl from-purple-200/30 via-pink-100/20 to-transparent rounded-full blur-[120px]" 
            />
            <motion.div 
              animate={{ x: [0, 35, -35, 0], y: [0, 45, -50, 0], scale: [1, 1.1, 0.95, 1] }} 
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/30 to-blue-100/20 rounded-full blur-[110px]" 
            />
          </>
        )}
      </div>

      {/* ─── HERO BANNER HEADLINE AREA ─── */}
      <div className="text-center py-16 sm:py-24 px-5 relative overflow-hidden bg-white/60 border-b border-slate-200 backdrop-blur-md z-10 shadow-sm">
        {!isMobile && <div className="absolute rounded-full blur-[100px] pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,#1a3af5,transparent_65%)] w-[800px] h-[400px] top-0 left-1/2 -translate-x-1/2" />}
        
        <div className="max-w-4xl mx-auto relative z-10">
          
  <motion.h1
    initial="hidden"
    animate="visible"
    variants={titleReveal}
    className="font-primary text-[clamp(2.5rem,5.5vw,4.5rem)] font-black text-slate-900 mb-6 tracking-tight leading-none"
  >
    Our <span className="text-shimmer">Academic Programmes</span>
  </motion.h1>

  <motion.p
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.7 }}
    className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
  >
    Detailed overview of every course we offer — engineered to guide your
    strategic roadmap toward elite academic milestones.
  </motion.p>
</div>

        {/* Dynamic Horizontal Quick Stat Anchors */}
        <motion.div 
          variants={statsContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-12 relative z-10 max-w-5xl mx-auto"
        >
          <motion.div variants={statItem} className="flex items-center gap-4 bg-white border border-slate-200/80 backdrop-blur-xl px-6 py-3.5 rounded-2xl shadow-md shadow-slate-100">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg border border-blue-100"><FaChalkboardTeacher /></div>
            <div className="text-left"><p className="font-bold text-slate-800 text-sm">Expert Faculty</p><p className="text-slate-500 text-xs">Qualified & Experienced</p></div>
          </motion.div>
          <motion.div variants={statItem} className="flex items-center gap-4 bg-white border border-slate-200/80 backdrop-blur-xl px-6 py-3.5 rounded-2xl shadow-md shadow-slate-100">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 text-lg border border-cyan-100"><FaUsers /></div>
            <div className="text-left"><p className="font-bold text-slate-800 text-sm">Small Batches</p><p className="text-slate-500 text-xs">12–25 Students Only</p></div>
          </motion.div>
          <motion.div variants={statItem} className="flex items-center gap-4 bg-white border border-slate-200/80 backdrop-blur-xl px-6 py-3.5 rounded-2xl shadow-md shadow-slate-100">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-lg border border-amber-100"><FaClipboardList /></div>
            <div className="text-left"><p className="font-bold text-slate-800 text-sm">Regular Tests</p><p className="text-slate-500 text-xs">Weekly Assessments</p></div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── MAIN DETAILED INTERACTIVE COURSE SECTIONS ─── */}
      <div className="max-w-[1050px] mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        <div className="flex flex-col gap-20">
          {courses.map((c, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div 
                key={c.id} 
                variants={isMobile ? {} : (isEven ? scrollRevealLeft : scrollRevealRight)}
                initial={isMobile ? false : "hidden"}
                whileInView={isMobile ? false : "visible"}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={isMobile ? {} : { 
                  y: -8, 
                  scale: 1.015, 
                  rotateX: isEven ? 0.8 : -0.8,
                  rotateY: isEven ? -0.8 : 0.8,
                  transition: { duration: 0.35, ease: "easeOut" } 
                }}
                className="bg-white/90 border border-slate-200 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-colors duration-300 relative overflow-hidden group transform-gpu backdrop-blur-sm"
              >
                {/* Visual Glass Reflection Sweep Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-slate-900/5 to-transparent transition-opacity duration-700 z-30 transform -translate-x-full group-hover:translate-x-full ease-out" style={{ transitionDuration: '1200ms' }} />

                {/* Card Top Branding Header Panel */}
                <div className="h-[250px] w-full overflow-hidden relative bg-slate-100">
                  <motion.img 
                    src={c.image} 
                    alt={c.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out"
                  />
                  {/* Dense Light Gradient Overlap */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
                  
                  <div className="absolute bottom-6 left-6 sm:left-10 right-6 flex items-center gap-5 z-20">
                    <motion.div 
                      whileHover={{ rotate: [0, -12, 12, 0], scale: 1.1 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-[1.5rem] sm:text-[1.75rem] shadow-lg shrink-0 border border-white/20" 
                      style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}cc)` }}
                    >
                      {c.icon}
                    </motion.div>
                    <h2 className="font-primary font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">{c.title}</h2>
                  </div>
                </div>

                {/* Target Radial Spotlights behind standard elements */}
                {!isMobile && <div className="absolute top-[250px] right-0 w-56 h-56 rounded-full blur-[80px] opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-150" style={{ background: c.color }} />}

                <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-[1fr_310px] gap-8 md:gap-12 items-start">
                  
                  {/* Content Segment Left */}
                  <div>
                    <p className="text-slate-600 text-[1.05rem] leading-relaxed mb-8 font-medium tracking-wide">{c.desc}</p>

                    {/* Interactive Subjects Array */}
                    <div className="mb-8">
                      <h4 className="font-primary font-bold text-xs text-slate-400 mb-3.5 uppercase tracking-widest">Core Disciplines</h4>
                      <motion.div 
                        variants={badgeContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-wrap gap-2.5"
                      >
                        {c.subjects.map(s => (
                          <motion.span 
                            key={s} 
                            variants={badgeItem}
                            whileHover={{ scale: 1.05, backgroundColor: "#f8fafc", borderColor: c.color }}
                            className="px-4 py-2 rounded-xl text-[0.85rem] font-bold bg-slate-100 text-slate-700 border border-slate-200/60 shadow-sm cursor-default transition-colors duration-200"
                          >
                            {s}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>

                    {/* Highlights Metric Rows */}
                    <div>
                      <h4 className="font-primary font-bold text-xs text-slate-400 mb-4 uppercase tracking-widest">Programme Deliverables</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {c.highlights.map((h, hIdx) => (
                          <motion.div 
                            key={h} 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: hIdx * 0.04, duration: 0.35 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3.5 text-slate-600 text-[0.92rem] font-medium"
                          >
                            <motion.span 
                              animate={isMobile ? {} : { scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                              transition={isMobile ? {} : { repeat: Infinity, duration: 2.5, delay: hIdx * 0.2 }}
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-none md:shadow-[0_0_8px_rgba(0,0,0,0.05)]" 
                              style={{ background: c.color }} 
                            />
                            {h}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Metadata Configuration Sidebar Panel Right */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-4.5 relative group-hover:bg-slate-100/50 group-hover:border-slate-300 transition-all duration-300"
                  >
                    {/* Conditionally rendered metadata fields */}
                    {c.duration && (
                      <div className="flex items-center gap-4">
                        <div className="text-slate-400 text-xl bg-white p-2 rounded-lg border border-slate-200 shadow-sm"><FaClock /></div>
                        <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</p><p className="font-bold text-slate-700 text-[0.95rem]">{c.duration}</p></div>
                      </div>
                    )}
                    {c.Learning_Mode && (
                      <div className="flex items-center gap-4">
                        <div className="text-slate-400 text-xl bg-white p-2 rounded-lg border border-slate-200 shadow-sm"><FaChalkboardTeacher /></div>
                        <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Learning Mode</p><p className="font-bold text-slate-700 text-[0.95rem]">{c.Learning_Mode}</p></div>
                      </div>
                    )}
                    {c.batchSize && (
                      <div className="flex items-center gap-4">
                        <div className="text-slate-400 text-xl bg-white p-2 rounded-lg border border-slate-200 shadow-sm"><FaUsers /></div>
                        <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Batch Size</p><p className="font-bold text-slate-700 text-[0.95rem]">{c.batchSize}</p></div>
                      </div>
                    )}
                    {c.schedule && (
                      <div className="flex items-center gap-4">
                        <div className="text-slate-400 text-xl bg-white p-2 rounded-lg border border-slate-200 shadow-sm"><FaClipboardList /></div>
                        <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Schedule</p><p className="font-bold text-slate-700 text-[0.95rem]">{c.schedule}</p></div>
                      </div>
                    )}
                    
                    <div className="h-px bg-slate-200 my-2" />
                    
                    <motion.button
                      onClick={() => navigate(`/enroll?course=${c.id}`)}
                      whileHover={{ scale: 1.03, boxShadow: `0 8px 25px ${c.color}44` }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl text-white font-primary font-bold text-[0.95rem] border-none cursor-pointer relative overflow-hidden flex items-center justify-center gap-2 shadow-md transition-all duration-300"
                      style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}dd)` }}
                    >
                      Enroll Now 
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}>
                        <FaArrowRight className="text-xs" />
                      </motion.span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

     {/* ─── BOTTOM ACADEMIC COUNSEL CONSOLE CTA ─── */}
<div className="bg-white border-t border-slate-200 py-24 px-6 overflow-hidden relative z-10 shadow-inner">
  <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white pointer-events-none" />

  <motion.div
    initial={{ opacity: 0, scale: 0.94, y: 30 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ type: "spring", damping: 22, stiffness: 80 }}
    className="max-w-[750px] mx-auto text-center relative z-10"
  >
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="font-primary text-4xl sm:text-4xl font-black text-slate-900 mb-5 relative z-10 tracking-tight leading-none"
    >
      Not sure which course is{" "}
      <span className="text-shimmer">
        right for you?
      </span>
    </motion.h2>

    <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
      Speak directly with our technical advisors to strategically configure
      your path forward.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
      <motion.a
        href="tel:08511350499"
        whileHover={{
          y: -5,
          scale: 1.03,
          boxShadow: "0 16px 35px rgba(26,58,245,0.25)",
        }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-primary font-bold border-none cursor-pointer transition-all duration-300 no-underline shadow-md"
      >
        📞 Call Us Now
      </motion.a>

      <motion.a
        href="https://wa.me/918511350499"
        target="_blank"
        rel="noreferrer"
        whileHover={{
          y: -5,
          scale: 1.03,
          borderColor: "#16a34a",
          color: "#16a34a",
          backgroundColor: "rgba(22,163,74,0.04)",
          boxShadow: "0 12px 30px rgba(34,197,94,0.08)",
        }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-white text-slate-700 font-primary font-bold border border-slate-300 no-underline transition-all duration-300 shadow-sm"
      >
        💬 WhatsApp Us
      </motion.a>
    </div>
  </motion.div>
</div>
    </div>
  );
}