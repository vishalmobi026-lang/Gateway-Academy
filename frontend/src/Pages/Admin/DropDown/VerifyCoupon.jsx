import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, ShieldCheck, Trophy, BadgePercent } from "lucide-react";

function getTier(discount) {
  if (discount >= 80) return { label: "Elite Tier Offer", color: "text-amber-500", bg: "bg-amber-50 border-amber-200" };
  if (discount >= 50) return { label: "Gold Tier Offer", color: "text-purple-500", bg: "bg-purple-50 border-purple-200" };
  if (discount >= 20) return { label: "Silver Tier Offer", color: "text-blue-500", bg: "bg-blue-50 border-blue-200" };
  return { label: "Base Tier Offer", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200" };
}

function VerifyCoupon() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  const handleDecode = async () => {
    if (!code.trim()) return;
    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/scores/verify/${encodeURIComponent(code.trim())}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Invalid Signature");
      }
      const data = await res.json();
      setResult(data);
      setStatus("success");
    } catch (e) {
      setErrorMsg(e.message);
      setStatus("error");
    }
  };

  const tier = result ? getTier(result.discount) : null;

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pt-35 pb-12 px-4 sm:px-6 lg:px-8 font-body overflow-x-hidden flex flex-col items-center">
      {/* Premium Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px] translate-y-1/3 translate-x-1/3 pointer-events-none" />

      {/* Elite Header Area */}
      <div className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide mb-3 uppercase shadow-sm mx-auto">
          <ShieldCheck size={14} /> Identity Authentication
        </div>
        <h1 className="text-4xl md:text-5xl font-primary font-black text-slate-900 tracking-tight">
          Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Coupon</span>
        </h1>
        <p className="text-slate-500 text-[1.05rem] font-medium mt-3 max-w-lg leading-relaxed mx-auto">
          Cross-reference student hash signatures generated from the Neon Strike scholarship module.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] relative z-10"
      >
        {/* Verification Card */}
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-[32px] p-8 shadow-[0_20px_60px_rgb(0,0,0,0.05)]">
          <div className="relative mb-6">
            <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-2">Input Scholarship Signature</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={20} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDecode()}
                placeholder="GTEC-XXXX-XXXX"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl py-4 pl-14 pr-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 font-bold tracking-widest shadow-inner uppercase"
              />
            </div>
          </div>

          <button
            onClick={handleDecode}
            disabled={status === "loading" || !code.trim()}
            className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-[0_8px_25px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_30px_rgba(59,130,246,0.4)] transition-all disabled:opacity-60 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm uppercase tracking-wider hover:-translate-y-0.5"
          >
            {status === "loading" ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
            ) : (
              <><ShieldCheck className="w-5 h-5" /> Run Verification</>
            )}
          </button>

          <AnimatePresence>
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 overflow-hidden"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <p className="text-red-600 text-sm font-bold tracking-wide">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result Card */}
        <AnimatePresence>
          {status === "success" && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-[32px] p-8 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative overflow-hidden"
            >
              {/* Green glow background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 relative z-10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                  <span className="text-emerald-600 font-black tracking-wide">Signature Validated</span>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[0.65rem] font-black uppercase tracking-widest rounded-lg">
                  {result.coupon_code}
                </span>
              </div>

              <div className="mb-8 relative z-10">
                <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Identity</p>
                <h3 className="text-3xl font-primary font-black text-slate-900 leading-none">{result.name}</h3>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-100">
                    <ShieldCheck size={14} /> {result.course}
                  </div>
                  <div className="text-sm font-bold text-slate-500">+91 {result.phone}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-slate-50 border border-slate-100 rounded-[20px] p-5">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Trophy size={16} />
                    <span className="text-[0.65rem] font-black uppercase tracking-widest">Score</span>
                  </div>
                  <p className="text-3xl font-primary font-black text-slate-900">
                    {result.score} <span className="text-sm font-bold text-slate-400 align-middle">pts</span>
                  </p>
                </div>

                <div className={`border rounded-[20px] p-5 ${tier.bg}`}>
                  <div className={`flex items-center gap-2 mb-2 ${tier.color}`}>
                    <BadgePercent size={16} />
                    <span className="text-[0.65rem] font-black uppercase tracking-widest">Grant</span>
                  </div>
                  <p className={`text-3xl font-primary font-black leading-none ${tier.color}`}>
                    {result.discount}%
                  </p>
                  <p className={`text-[0.65rem] font-black uppercase tracking-widest mt-1.5 ${tier.color} opacity-80`}>
                    {tier.label}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}

export default VerifyCoupon;
