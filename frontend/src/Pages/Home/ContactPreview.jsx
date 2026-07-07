import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane } from "react-icons/fa";
import RevealOnScroll from "../../Components/RevealOnScroll";

export default function ContactPreview() {
  const navigate = useNavigate();
  return (
    <section className="bg-transparent py-6 px-2 sm:px-6 relative overflow-hidden">
      <div className="w-full mx-auto relative z-10 flex flex-col gap-10">
        <RevealOnScroll animationClass="animate-slide-right">
          <div>
            <h2 className="font-primary text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Get in Touch <span className="text-shimmer">With Us</span>
            </h2>
            <p className="text-slate-600 text-base mb-8">
              Have questions about our courses or admissions? Our team is here to help you make the right choice for your future.
            </p>
            <div className="flex flex-col gap-5">
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-[#1a3af5]/10 border border-[#1a3af5]/20 flex items-center justify-center text-[#1a3af5] text-lg shrink-0 mt-1"><FaMapMarkerAlt /></div>
                 <div><p className="text-slate-900 font-bold mb-1">Address</p><p className="text-slate-600 text-sm leading-relaxed">Monday Market Thingal Nagar, Manoj Medical Backside, Kanniyakumari-629802</p></div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-[#1a3af5]/10 border border-[#1a3af5]/20 flex items-center justify-center text-[#1a3af5] text-lg shrink-0 mt-1"><FaPhoneAlt /></div>
                 <div><p className="text-slate-900 font-bold mb-1">Phone</p><p className="text-slate-600 text-sm">08511350499</p></div>
               </div>
            </div>
          </div>
        </RevealOnScroll>
        
        <RevealOnScroll animationClass="animate-scale-in" delay={100}>
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-slate-200/50">
             <h3 className="font-primary font-bold text-xl text-slate-900 mb-5">Quick Enquiry</h3>
             <form className="flex flex-col gap-4">
               <input type="text" placeholder="Your Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#06b6d4] focus:bg-white focus:ring-2 focus:ring-[#06b6d4]/20" />
               <input type="tel" placeholder="Your Phone Number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-body text-sm transition-all outline-none focus:border-[#06b6d4] focus:bg-white focus:ring-2 focus:ring-[#06b6d4]/20" />
               <button type="button" onClick={(e) => {e.preventDefault(); navigate("/contact")}} className="inline-flex justify-center items-center gap-2 w-full py-4 mt-2 rounded-xl bg-gradient-to-br from-[#1a3af5] to-[#06b6d4] text-white font-primary font-bold text-[1rem] border-none cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(26,58,245,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(6,182,212,0.35)]">
                 Send Enquiry <FaPaperPlane />
               </button>
             </form>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}