import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import enrollmentAnimation from "./assets/Enrollment/enrollment.json";
import ToastNotification from "./Components/ToastNotification";
import {
  FaCheckCircle,
  FaGraduationCap,
  FaClipboardCheck,
  FaRegComments,
  FaStar,
} from "react-icons/fa";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const LottieComponent = Lottie.default || Lottie;

// Sophisticated animation variations matching elite web standards
const premiumFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 80 },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 80 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

export default function Enroll() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [programme, setProgramme] = useState("");
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
  phone: "",
  parents_no: "", // New
  email: "",
  date_of_birth: "", // New
  gender: "", // New
  address: "",
  about_us: "", // New
  school: "",
  academic_board: "", // New
  current_grade: "", // New
  subjects: "", // New
  last_academic_results: "", // New
  area_of_interest: "", // New
  hobbies: "", // New
  future_goals: "", //
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [toast, setToast] = useState({ visible: false, type: "success", message: "" });

  const showToast = useCallback((type, message) => {
    setToast({ visible: true, type, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/courses/")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        const courseParam = searchParams.get("course");
        if (courseParam) {
          const matchedCourse = data.find(c => c.id.toString() === courseParam || c.title === courseParam);
          if (matchedCourse) {
            setProgramme(matchedCourse.title);
          }
        }
      })
      .catch(err => console.error("Error fetching courses:", err));
  }, [searchParams]);

  // Auto-redirect to home 2s after successful submission
  useEffect(() => {
    if (!submitted) return;
    setCountdown(2);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !programme || !formData.address) {
      showToast("error", "Please fill in all required fields before submitting.");
      return;
    }
   setSubmitting(true);

try {
    const response = await fetch("http://127.0.0.1:8000/enrollments/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        student_name: formData.name,
        phone: formData.phone,
        parents_no: formData.parents_no,
        email: formData.email,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
        address: formData.address,
        about_us: formData.about_us,
        current_school_name: formData.school,
        academic_board: formData.academic_board,
        current_grade: formData.current_grade,
        subjects: formData.subjects,
        last_academic_results: formData.last_academic_results,
        programme: programme,
        area_of_interest: formData.area_of_interest,
        hobbies: formData.hobbies,
        future_goals: formData.future_goals
      })
    });

  if (!response.ok) {
    throw new Error("Enrollment failed");
  }

  const result = await response.json();

  console.log(result);

  setSubmitting(false);

  showToast(
    "success",
    `Application submitted! We'll contact ${formData.name} shortly.`
  );

  setTimeout(() => {
    setSubmitted(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, 1800);

} catch (error) {

  console.error(error);

  setSubmitting(false);

  showToast(
    "error",
    "Failed to submit application."
  );
}
  };
  return (
    <div className="pt-32 md:pt-20 min-h-screen bg-[#f8fafc] relative overflow-hidden antialiased">
      {/* ── Toast Notification ── */}
      <ToastNotification
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={closeToast}
        duration={3500}
      />
      {/* Decorative Background Elements */}
      <motion.div
        animate={isMobile ? {} : {
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={isMobile ? {} : {
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#1a3af5]/10 via-[#06b6d4]/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none ${isMobile ? 'animate-orb-1' : ''}`}
      />
      <motion.div
        animate={isMobile ? {} : {
          scale: [1, 1.15, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={isMobile ? {} : {
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#f59e0b]/10 to-transparent rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none ${isMobile ? 'animate-orb-2' : ''}`}
      />

      <div className="max-w-[1300px] mx-auto px-5 py-10 lg:py-20">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-24 items-start">
          {/* Left Side: Copy & Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-10">
            <motion.div
              variants={premiumFadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#1a3af5]/20 text-[#1a3af5] text-sm font-bold tracking-wide mb-6 shadow-sm cursor-default">
              <FaStar className="text-[#f59e0b] text-base animate-pulse" />{" "}
              Admissions Open for {new Date().getFullYear()}
            </motion.div>
            <motion.h1
              variants={slideInLeft}
              className="font-primary text-5xl md:text-6xl leading-[1.1] font-extrabold text-slate-900 mb-5 tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block relative z-10">
                Begin Your
                <br />
                <span className="text-shimmer">Success Story.</span>
              </motion.span>
            </motion.h1>

            <motion.p
              variants={premiumFadeUp}
              className="text-slate-600 text-base md:text-lg leading-relaxed mb-3 max-w-[500px]">
              Join Gateway Academy's elite coaching programs. We don't just
              teach—we engineer top rankers and future leaders.
            </motion.p>

            {/* Hero Lottie animation — rendered inline, negative margin crops built-in canvas whitespace */}
            <motion.div
              variants={premiumFadeUp}
              whileHover={isMobile ? {} : { scale: 1.02 }}
              className="relative w-full max-w-[480px] -mt-16 -mb-10 group transform-gpu transition-all duration-300">
              <LottieComponent
                animationData={enrollmentAnimation}
                loop={true}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-700 relative z-10"
              />
            </motion.div> 

            {/* Steps row — wraps cleanly on mobile */}
            <motion.div
              variants={staggerContainer}
              className="flex flex-wrap gap-4 sm:gap-8">
              <motion.div
                variants={premiumFadeUp}
                whileHover={isMobile ? {} : { y: -4 }}
                className="flex items-center gap-3 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#10b981] text-xl border border-slate-100 group-hover:shadow-lg transition-all shrink-0">
                  <FaClipboardCheck />
                </div>
                <p className="font-primary font-extrabold text-slate-900 text-base">
                  Apply
                </p>
              </motion.div>
              <motion.div
                variants={premiumFadeUp}
                whileHover={isMobile ? {} : { y: -4 }}
                className="flex items-center gap-3 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#f59e0b] text-xl border border-slate-100 group-hover:shadow-lg transition-all shrink-0">
                  <FaRegComments />
                </div>
                <p className="font-primary font-extrabold text-slate-900 text-base">
                  Counseling
                </p>
              </motion.div>
              <motion.div
                variants={premiumFadeUp}
                whileHover={isMobile ? {} : { y: -4 }}
                className="flex items-center gap-3 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#1a3af5] text-xl border border-slate-100 group-hover:shadow-lg transition-all shrink-0">
                  <FaGraduationCap />
                </div>
                <p className="font-primary font-extrabold text-slate-900 text-base">
                  Enroll
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side: Glassmorphism Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={slideInRight}
            animate={isMobile ? {} : {
              y: [0, -10, 0],
            }}
            transition={isMobile ? {} : {
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="relative z-20 w-full max-w-[600px] mx-auto">
            {/* Glowing drop shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] rounded-[32px] translate-x-3 translate-y-5 opacity-20 blur-2xl" />

            <div className="bg-white/95 backdrop-blur-xl border-2 border-white rounded-[32px] p-6 sm:p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,#1a3af5,transparent)] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center text-center py-10 gap-5"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-emerald-200">
                    <FaCheckCircle className="text-white text-4xl" />
                  </div>
                  <h2 className="font-primary font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    Application Received!
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[320px]">
                    Thank you, <span className="font-bold text-slate-700">{formData.name}</span>! We've received your application for{" "}
                    <span className="font-bold text-[#1a3af5]">{programme}</span>. Our team will contact you shortly on{" "}
                    <span className="font-bold text-slate-700">{formData.phone}</span>.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={(e) => { e.preventDefault(); setSubmitted(false); setFormData({ name: "", phone: "", email: "", school: "", address: "" }); setProgramme(""); }}
                    className="mt-2 px-6 py-3 rounded-2xl border-2 border-[#1a3af5]/30 text-[#1a3af5] font-bold text-sm hover:bg-[#1a3af5]/5 transition-all cursor-pointer"
                  >
                    Submit Another Application
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8 text-center">
                    <h2 className="font-primary font-extrabold text-2xl sm:text-3xl text-slate-900 mb-2 tracking-tight">
                      Secure Your Seat
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                      It takes less than 2 minutes to apply.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                    {/* Name + Phone — stack on mobile, side-by-side on md */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 text-xs uppercase tracking-wider mb-2 font-bold ml-1">
                          Student Name *
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-4 focus:ring-[#1a3af5]/10 transform-gpu"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 text-xs uppercase tracking-wider mb-2 font-bold ml-1">
                          Phone Number *
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile"
                          className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-4 focus:ring-[#1a3af5]/10 transform-gpu"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs uppercase tracking-wider mb-2 font-bold ml-1">
                        Email Address
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.005 }}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@example.com"
                        className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-4 focus:ring-[#1a3af5]/10 transform-gpu"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs uppercase tracking-wider mb-2 font-bold ml-1">
                        Preferred Programme *
                      </label>
                      <motion.select
                        whileFocus={{ scale: 1.005 }}
                        value={programme}
                        onChange={(e) => setProgramme(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3.5 text-slate-900 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-4 focus:ring-[#1a3af5]/10 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1.25rem_center] transform-gpu">
                        <option value="">Choose a Programme</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </motion.select>
                    </div>

                    <div>
                      <label className="block text-slate-700 text-xs uppercase tracking-wider mb-2 font-bold ml-1">
                        School/College Name
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.005 }}
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        placeholder="Current institution"
                        className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-4 focus:ring-[#1a3af5]/10 transform-gpu"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs uppercase tracking-wider mb-2 font-bold ml-1">
                        Address*
                      </label>
                      <motion.textarea
                        whileFocus={{ scale: 1.005 }}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your full address"
                        rows={3}
                        className="w-full bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#1a3af5] focus:bg-white focus:ring-4 focus:ring-[#1a3af5]/10 transform-gpu resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={isMobile ? {} : {
                        y: -3,
                        scale: 1.01,
                        boxShadow: "0 12px 35px rgba(26,58,245,0.4)",
                      }}
                      whileTap={isMobile ? {} : { scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1a3af5] to-[#06b6d4] text-white font-primary font-bold text-[1.05rem] tracking-wide border-none cursor-pointer transition-all duration-300 shadow-[0_8px_30px_rgba(26,58,245,0.3)] mt-2 transform-gpu disabled:opacity-70 disabled:cursor-not-allowed">
                      {submitting ? "Submitting…" : "Submit Application"}
                    </motion.button>

                    <div className="text-center flex items-center justify-center gap-1.5 opacity-70">
                      <FaCheckCircle className="text-[#10b981] text-xs" />
                      <span className="text-xs text-slate-500 font-medium tracking-wide">
                        Secure SSL Encrypted
                      </span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
  }

