import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0a0f2e] pt-14 pb-8 px-5">
      <div className="max-w-[1200px] mx-auto">

        {/* Top grid — 1 col mobile, 2 cols sm, 4 cols md */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[48px] h-[48px] flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Gateway Academy Logo" className="w-full h-full object-contain" />
              </div>
              <p className="font-primary font-extrabold text-lg text-white">Gateway Academy</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-5">
              Empowering students in Kanniyakumari with expert coaching for CBSE boards and competitive exams (RRB, SSC).
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-2.5 mb-5">
              <a href="tel:08511350499" className="flex items-center gap-2.5 text-white/60 text-sm no-underline hover:text-[#06b6d4] transition-colors">
                <FaPhoneAlt className="text-[#06b6d4] shrink-0" /> 08511350499
              </a>
              <div className="flex items-start gap-2.5 text-white/60 text-sm">
                <FaMapMarkerAlt className="text-[#06b6d4] shrink-0 mt-0.5" />
                <span>Monday Market Thingal Nagar, Manoj Medical Backside, Kanniyakumari-629802</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
               <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#1a3af5] hover:text-white transition-all"><FaFacebook /></a>
               <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#e1306c] hover:text-white transition-all"><FaInstagram /></a>
               <a href="https://wa.me/918511350499" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#25d366] hover:text-white transition-all"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-primary font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Courses", to: "/courses" },
                { label: "Enroll Now", to: "/enroll" },
                { label: "Contact", to: "/contact" },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/60 hover:text-[#06b6d4] text-sm transition-colors no-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-primary font-bold text-white mb-5 text-sm uppercase tracking-wider">Working Hours</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="text-white/60">Monday – Saturday</li>
              <li className="text-[#06b6d4] font-semibold">8:00 AM – 5:30 PM</li>
              <li className="text-white/40 mt-1">Sunday: Closed</li>
            </ul>

            {/* CTA */}
            <Link
              to="/enroll"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] text-white font-primary font-semibold text-sm no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(26,58,245,0.3)]"
            >
              🎓 Enroll Now
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Gateway Academy. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">Thingal Nagar, Kanniyakumari – 629802</p>
        </div>
      </div>
    </footer>
  );
}