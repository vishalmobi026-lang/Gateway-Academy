import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBookOpen, FaTrain, FaFileAlt, FaUserGraduate } from "react-icons/fa";
import { motion } from "framer-motion";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const iconMap = {
  "FaUserGraduate": <FaUserGraduate />,
  "FaBookOpen": <FaBookOpen />,
  "FaTrain": <FaTrain />,
  "FaFileAlt": <FaFileAlt />,
};

// Variants removed as we are animating children directly for better IntersectionObserver reliability

export default function CoursesSection() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/courses/")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(c => ({
          id: c.id.toString(),
          icon: iconMap[c.icon] || <FaUserGraduate />,
          title: c.title,
          subtitle: c.learning_mode,
          desc: c.description,
          tags: c.disciplines.map(d => d.name).slice(0, 3), // max 3 tags
          color: c.color,
        }));
        // Show first 4 courses to match previous design
        setCourses(formatted.slice(0, 4));
      })
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  return (
    <section id="courses" className="bg-white py-24 px-6 relative overflow-hidden">
      {/* bg orb */}
      <motion.div 
        animate={isMobile ? {} : { rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={isMobile ? {} : { duration: 25, repeat: Infinity, ease: "linear" }}
        className={`absolute rounded-full blur-[100px] pointer-events-none opacity-10 bg-[radial-gradient(circle,#1a3af5,transparent)] w-[500px] h-[500px] top-1/2 -left-[150px] -translate-y-1/2 ${isMobile ? 'animate-orb-2' : ''}`} 
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="inline-flex items-center justify-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#1a3af5] mb-4 before:content-[''] before:block before:w-[28px] before:h-[2px] before:bg-[#1a3af5]/30 before:rounded-full after:content-[''] after:block after:w-[28px] after:h-[2px] after:bg-[#1a3af5]/30 after:rounded-full"
          >
            Our Programmes
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
            className="font-primary text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-slate-900 mb-4"
          >
            Courses We <span className="text-shimmer">Offer</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            className="text-[1.1rem] text-slate-600 max-w-[560px] mx-auto"
          >
            From school academics to competitive exam preparation — we have the right programme for every student.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 mb-12">
          {courses.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.15 }}
              whileHover={isMobile ? {} : { y: -8, scale: 1.015, boxShadow: "0 25px 50px -12px rgba(26,58,245,0.15)", borderColor: `${c.color}66` }}
              className="bg-slate-50 border border-slate-200 rounded-[20px] p-8 transition-colors duration-300 relative overflow-hidden group hover:bg-white h-full transform-gpu"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] opacity-0 transition-opacity duration-500 rounded-[20px] group-hover:opacity-[0.03] pointer-events-none" />
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[1.6rem] mb-5 text-white shadow-md relative z-10 transition-transform duration-300 group-hover:scale-110" style={{ background:`linear-gradient(135deg, ${c.color}, ${c.color}dd)` }}>
                {c.icon}
              </div>

              {/* Label */}
              <p className="text-[0.72rem] font-bold tracking-[0.1em] uppercase mb-1.5 relative z-10" style={{ color: c.color }}>
                {c.subtitle}
              </p>

              <h3 className="font-primary font-extrabold text-[1.3rem] text-slate-900 mb-3 relative z-10 group-hover:text-[#1a3af5] transition-colors">
                {c.title}
              </h3>

              <p className="text-slate-600 text-[0.9rem] leading-[1.75] mb-5 relative z-10">
                {c.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
                {c.tags.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-white border" style={{ borderColor:`${c.color}33`, color: c.color }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate(`/enroll?course=${c.id}`)}
                className="flex items-center gap-[6px] bg-transparent border-none font-primary font-bold text-[0.9rem] cursor-pointer transition-all duration-200 p-0 hover:gap-2.5 relative z-10"
                style={{ color: c.color }}
              >
                Enroll Now <FaArrowRight className="text-[0.8rem]" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          className="text-center"
        >
          <button onClick={() => navigate("/courses")} className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-slate-700 font-primary font-semibold text-[1rem] border border-slate-300 cursor-pointer transition-all duration-300 no-underline hover:border-[#06b6d4] hover:text-[#06b6d4] hover:-translate-y-0.5 hover:shadow-md">
            View All Courses <FaArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
}