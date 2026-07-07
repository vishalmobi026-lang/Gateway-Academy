import { FaChalkboardTeacher, FaUsers, FaTrophy, FaClock, FaBookOpen, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const reasons = [
  {
    icon: <FaChalkboardTeacher />,
    title: "Expert Faculty",
    desc: "Highly qualified and experienced teachers dedicated to each student's individual success and understanding.",
    color: "#1a3af5",
  },
  {
    icon: <FaUsers />,
    title: "Small Batch Sizes",
    desc: "Intimate class sizes ensure personalised attention, quick doubt resolution, and better learning outcomes.",
    color: "#06b6d4",
  },
  {
    icon: <FaTrophy />,
    title: "Proven Results",
    desc: "Our students consistently achieve top scores in CBSE boards and competitive exams across Kanyakumari.",
    color: "#f59e0b",
  },
  {
    icon: <FaClock />,
    title: "Flexible Timings",
    desc: "Morning and evening batches available to fit student schedules. Open Monday to Saturday, 8AM – 5:30PM.",
    color: "#8b5cf6",
  },
  {
    icon: <FaBookOpen />,
    title: "Comprehensive Study Material",
    desc: "Structured notes, past papers, mock tests and weekly assessments provided to every enrolled student.",
    color: "#ec4899",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Convenient Location",
    desc: "Located at Thingal Nagar, Kanyakumari — easily accessible from Monday Market and surrounding areas.",
    color: "#10b981",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function Whyus() {
  return (
    <section className="bg-slate-50 py-24 px-6 relative overflow-hidden">
      {/* Decorative orbs */}
      <motion.div 
        animate={isMobile ? {} : { y: [0, -20, 0] }}
        transition={isMobile ? {} : { duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute rounded-full blur-[100px] pointer-events-none opacity-10 bg-[radial-gradient(circle,#06b6d4,transparent)] w-[450px] h-[450px] -top-[100px] -right-[100px] ${isMobile ? 'animate-orb-3' : ''}`} 
      />
      <motion.div 
        animate={isMobile ? {} : { y: [0, 20, 0] }}
        transition={isMobile ? {} : { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className={`absolute rounded-full blur-[100px] pointer-events-none opacity-10 bg-[radial-gradient(circle,#f59e0b,transparent)] w-[350px] h-[350px] -bottom-[80px] -left-[80px] ${isMobile ? 'animate-orb-1' : ''}`} 
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-14"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#f59e0b] mb-4 before:content-[''] before:block before:w-[28px] before:h-[2px] before:bg-[#f59e0b]/30 before:rounded-full after:content-[''] after:block after:w-[28px] after:h-[2px] after:bg-[#f59e0b]/30 after:rounded-full">Why Choose Us</motion.div>
          <motion.h2 variants={itemVariants} className="font-primary text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-slate-900 mb-4">
            The Gateway <span className="text-shimmer">Advantage</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-[1.1rem] text-slate-600 max-w-[560px] mx-auto">
            We combine academic excellence with personal mentorship to help every student reach their full potential.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6"
        >
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              variants={itemVariants}
              whileHover={isMobile ? {} : { y: -8, scale: 1.015, boxShadow: "0 20px 40px -12px rgba(6,182,212,0.15)", borderColor: `${r.color}66` }}
              className="p-8 rounded-[20px] bg-white border border-slate-200 shadow-sm transition-colors duration-300 group h-full transform-gpu"
            >
              {/* Icon circle */}
              <div className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center text-[1.4rem] mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md" style={{ background:`${r.color}15`, border:`1px solid ${r.color}33`, color: r.color }}>
                {r.icon}
              </div>
              <h3 className="font-primary font-bold text-[1.15rem] text-slate-900 mb-2.5">
                {r.title}
              </h3>
              <p className="text-slate-600 text-[0.9rem] leading-[1.75]">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlight band */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 90, delay: 0.2 }}
          className="mt-14 p-8 md:px-10 rounded-[24px] bg-[linear-gradient(135deg,#1a3af5,#06b6d4)] border border-[#1a3af5]/30 flex items-center justify-between flex-wrap gap-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10">
            <h3 className="font-primary font-extrabold text-[1.6rem] text-white mb-1.5">
              Ready to begin your journey?
            </h3>
            <p className="text-white/80 text-[0.95rem]">
              Join hundreds of students already excelling at Gateway Academy.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap relative z-10">
            <motion.a 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="tel:08511350499" 
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#1a3af5] font-primary font-bold text-[1rem] border-none cursor-pointer transition-shadow duration-300 shadow-lg no-underline hover:shadow-[0_8px_20px_rgba(255,255,255,0.4)]"
            >
              📞 Call Now
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/918511350499" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/20 border border-white/40 text-white font-primary font-bold text-[1rem] no-underline transition-colors duration-300"
            >
              💬 WhatsApp
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}