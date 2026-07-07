import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaBookOpen,
  FaInfoCircle,
  FaEnvelope,
  FaWhatsapp,
  FaHome,
} from "react-icons/fa";

const navLinks = [
  { name: "Home", path: "/", icon: <FaHome /> },
  { name: "Courses", path: "/courses", icon: <FaBookOpen /> },
  { name: "About", path: "/about", icon: <FaInfoCircle /> },
  { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);

    let logoutTimer;

    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const timeRemaining = payload.exp * 1000 - Date.now();

        if (timeRemaining <= 0) {
          localStorage.removeItem("token");
          setIsAdmin(false);
          setAdminMenuOpen(false);
          navigate("/");
        } else {
          setIsAdmin(true);
          clearTimeout(logoutTimer);
          logoutTimer = setTimeout(() => {
            localStorage.removeItem("token");
            setIsAdmin(false);
            setAdminMenuOpen(false);
            navigate("/");
            alert("Your session has expired. You have been automatically logged out.");
          }, timeRemaining);
        }
      } catch (e) {
        localStorage.removeItem("token");
        setIsAdmin(false);
      }
    };

    window.addEventListener("storage", checkToken);
    checkToken(); // Initial check

    // Close admin menu when clicking outside
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".admin-menu-container")) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("storage", checkToken);
      document.removeEventListener("click", handleOutsideClick);
      clearTimeout(logoutTimer);
    };
  }, [navigate]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goto = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-[1000] transition-all duration-400 ease px-6 ${
          scrolled || menuOpen
            ? "top-0 w-full max-w-full rounded-none bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm"
            : "top-4 w-[95%] max-w-[1200px] rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm"
        }`}>
        <div className="flex items-center justify-between h-[105px]">
          <div
            onClick={() => goto("/")}
            className="flex items-center gap-3 cursor-pointer group">
            <div className="w-[75px] h-[75px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Gateway Academy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-primary font-extrabold text-[1.2rem] sm:text-[1.75rem] text-slate-900 leading-tight tracking-[-0.02em]">
                Gateway Academy
              </p>
              <p className="text-[0.65rem] text-slate-500 leading-tight sm:block md:text-[0.85rem]">
                Thingal Nagar, Kanniyakumari
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks
              .filter((l) => l.name !== "Home")
              .map((link) => {
                const active = location.pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => goto(link.path)}
                    className={`px-5 py-2 rounded-full font-primary font-semibold text-[0.92rem] cursor-pointer transition-all duration-250 ease-in-out border-none ${
                      active
                        ? "bg-[#1a3af5]/10 text-[#1a3af5]"
                        : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}>
                    {link.name}
                  </button>
                );
              })}

            {/* Admin Panel Integrated into Desktop Links */}
            {isAdmin && (
              <div
                className="relative admin-menu-container"
                onMouseEnter={() => setAdminMenuOpen(true)}
                onMouseLeave={() => setAdminMenuOpen(false)}>
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-primary font-semibold text-[0.92rem] cursor-pointer transition-all duration-250 ease-in-out border-none ${
                    location.pathname.startsWith("/admin")
                      ? "bg-[#1a3af5]/10 text-[#1a3af5]"
                      : "bg-transparent text-slate-700 hover:bg-slate-100"
                  }`}>
                  <FaInfoCircle /> Admin Panel
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {adminMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full right-0 pt-2 z-[1001]"
                    >
                      <div className="w-64 bg-slate-900 text-white rounded-2xl shadow-xl p-6 border border-slate-700/50">
                        {/* RECORDS & RESULTS */}
                        <div className="mb-6">
                          <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Records & Results
                          </p>
                          <div className="space-y-3">
                            <NavLink
                              to="/admin/enrollments"
                              onClick={() => setAdminMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 text-sm ${
                                  isActive ? "text-blue-400" : "hover:text-blue-400"
                                }`
                              }>
                              🎓 Student Enrollments
                            </NavLink>
                            <NavLink
                              to="/admin/game-scores"
                              onClick={() => setAdminMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 text-sm ${
                                  isActive ? "text-blue-400" : "hover:text-blue-400"
                                }`
                              }>
                              🎮 Game Scores
                            </NavLink>
                          </div>
                        </div>

                        {/* COMMUNICATIONS */}
                        <div className="mb-6">
                          <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Communications
                          </p>
                          <div className="space-y-3">
                             <NavLink
                              to="/admin/inquiries"
                              onClick={() => setAdminMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 text-sm ${
                                  isActive ? "text-blue-400" : "hover:text-blue-400"
                                }`
                              }>
                              ✉️ Inbox Inquiries
                            </NavLink>
                            <NavLink
                              to="/admin/contact-ad"
                              onClick={() => setAdminMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 text-sm ${
                                  isActive ? "text-blue-400" : "hover:text-blue-400"
                                }`
                              }>
                              💼 Professional Emails
                            </NavLink>
                            <NavLink
                              to="/admin/ArchivedInquiries"
                              onClick={() => setAdminMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 text-sm ${
                                  isActive ? "text-blue-400" : "hover:text-blue-400"
                                }`
                              }>
                              🕒 Archived Inquiries
                            </NavLink>
                          </div>
                        </div>

                        {/* TOOLS & PRICING */}
                        <div>
                          <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Tools & Pricing
                          </p>
                            
                          <div className="space-y-3">
                            <NavLink
                              to="/admin/VerifyCoupon"
                              onClick={() => setAdminMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 text-sm ${
                                  isActive ? "text-blue-400" : "hover:text-blue-400"
                                }`
                              }>
                              🎫 Verify Coupon
                            </NavLink>
                            <NavLink
                              to="/admin/CourseManagement"
                              onClick={() => setAdminMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 text-sm ${
                                  isActive ? "text-blue-400" : "hover:text-blue-400"
                                }`
                              }>
                             🏷️ Course Management
                            </NavLink>
                            
                          </div>
                        </div>

                        {/* Logout */}
                        <div className="mt-6 pt-4 border-t border-slate-700">
                          <button
                            onClick={() => {
                              localStorage.removeItem("token");
                              setIsAdmin(false);
                              setAdminMenuOpen(false);
                              goto("/");
                            }}
                            className="w-full text-red-400 text-sm font-semibold hover:text-red-300 transition-colors">
                            Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="tel:08511350499"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#d97706] font-primary font-semibold text-[0.85rem] no-underline transition-all duration-300 hover:bg-[#f59e0b]/20 hover:-translate-y-[1px]">
              <FaPhoneAlt className="text-[0.75rem]" /> 08511350499
            </a>
            <button
              onClick={() => goto("/enroll")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] text-white font-primary font-bold text-[0.9rem] border-none cursor-pointer transition-all duration-300 shadow-[0_4px_16px_rgba(26,58,245,0.25)] hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_24px_rgba(6,182,212,0.35)]">
              Enroll Now
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-lg cursor-pointer transition-colors hover:bg-slate-100">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div
          className={`md:hidden absolute top-[106px] left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-y-auto transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
          }`}>
          <div className="flex flex-col px-6 py-4 gap-2">
            {navLinks
              .filter((l) => l.name !== "Home")
              .map((link) => {
                const active = location.pathname === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => goto(link.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-primary font-semibold text-[0.95rem] cursor-pointer transition-colors border-none text-left ${
                      active
                        ? "bg-[#1a3af5]/10 text-[#1a3af5]"
                        : "bg-transparent text-slate-700 hover:bg-slate-50 hover:text-[#1a3af5]"
                    }`}>
                    <span
                      className={`${active ? "text-[#1a3af5]" : "text-slate-400"}`}>
                      {link.icon}
                    </span>
                    {link.name}
                  </button>
                );
              })}

            {isAdmin && (
              <>
                <button
                  onClick={() => setMobileAdminOpen(!mobileAdminOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-primary font-semibold text-[0.95rem] cursor-pointer transition-colors border-none text-left bg-slate-50 text-slate-700 hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400"><FaInfoCircle /></span>
                    Admin Panel
                  </div>
                  <span className="text-slate-400 text-[0.8rem]">
                    {mobileAdminOpen ? "▲" : "▼"}
                  </span>
                </button>

                <AnimatePresence>
                  {mobileAdminOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 px-2 py-2 bg-slate-50/50 rounded-xl mt-1">
                        <button onClick={() => goto('/admin/enrollments')} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-slate-600 hover:bg-slate-100 hover:text-[#1a3af5] rounded-lg text-left">🎓 Student Enrollments</button>
                        <button onClick={() => goto('/admin/game-scores')} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-slate-600 hover:bg-slate-100 hover:text-[#1a3af5] rounded-lg text-left">🎮 Game Scores</button>
                        <button onClick={() => goto('/admin/inquiries')} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-slate-600 hover:bg-slate-100 hover:text-[#1a3af5] rounded-lg text-left">✉️ Inbox Inquiries</button>
                        <button onClick={() => goto('/admin/contact-ad')} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-slate-600 hover:bg-slate-100 hover:text-[#1a3af5] rounded-lg text-left">💼 Professional Emails</button>
                        <button onClick={() => goto('/admin/ArchivedInquiries')} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-slate-600 hover:bg-slate-100 hover:text-[#1a3af5] rounded-lg text-left">🕒 Archived Inquiries</button>
                        <button onClick={() => goto('/admin/VerifyCoupon')} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-slate-600 hover:bg-slate-100 hover:text-[#1a3af5] rounded-lg text-left">🎫 Verify Coupon</button>
                        <button onClick={() => goto('/admin/CourseManagement')} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-slate-600 hover:bg-slate-100 hover:text-[#1a3af5] rounded-lg text-left">🏷️ Course Management</button>
                        <div className="h-[1px] bg-slate-200 my-1 mx-2" />
                        <button onClick={() => {
                            localStorage.removeItem("token");
                            setIsAdmin(false);
                            setMobileAdminOpen(false);
                            goto("/");
                          }} className="flex items-center gap-3 px-4 py-2.5 text-[0.9rem] text-red-500 hover:bg-red-50 rounded-lg text-left">
                          🚪 Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            <div className="h-[1px] bg-slate-100 my-2" />

            <button
              onClick={() => goto("/enroll")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] text-white font-primary font-bold text-[1rem] border-none cursor-pointer transition-transform hover:scale-[1.02] shadow-md">
              🎓 Enroll Now
            </button>
            <div className="flex gap-3 mt-2">
              <a
                href="tel:08511350499"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[0.9rem] no-underline">
                <FaPhoneAlt className="text-slate-400" /> Call
              </a>
              <a
                href="https://wa.me/918511350499"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25d366]/10 border border-[#25d366]/20 text-[#16a34a] font-semibold text-[0.9rem] no-underline">
                <FaWhatsapp className="text-[1.1rem]" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[999] md:hidden transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
    </>
  );
}
