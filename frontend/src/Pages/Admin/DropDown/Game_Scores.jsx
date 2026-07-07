import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Download, Search, Trash2, Save, Phone, BookOpen, Hash, Tag, MessageSquare, Loader2, Gamepad2, Sparkles } from "lucide-react";

function GameScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchScores = () => {
    fetch("http://127.0.0.1:8000/scores/")
      .then((res) => res.json())
      .then((data) => {
        setScores(data);
        const initialFeedbacks = {};
        data.forEach(item => {
            initialFeedbacks[item.id] = item.feedback || "";
        });
        // Use functional state update to preserve any unsaved feedback the admin is currently typing
        setFeedbacks(prev => ({ ...initialFeedbacks, ...prev }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching scores:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchScores(); // Initial fetch
    
    // Poll for new scores every 3 seconds to update the UI instantly without a refresh
    const interval = setInterval(fetchScores, 3000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const downloadExcel = () => {
    const excelData = scores.map((item) => ({
      ID: item.id,
      Name: item.name,
      Phone: item.phone,
      Course: item.course,
      Score: item.score,
      Coupon: item.coupon_code,
      Discount: `${item.discount}%`,
      Feedback: feedbacks[item.id] || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Game Scores");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(file, "Gateway_Game_Scores.xlsx");
  };

  const deleteScore = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this score?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/scores/${id}`, { method: "DELETE" });
      setScores((prev) => prev.filter((item) => item.id !== id));
    } catch (err) { console.error(err); }
  };

  const saveFeedback = async (id) => {
    alert("Feedback saved locally (backend endpoint pending).");
  };

  const filteredScores = scores.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.phone?.includes(searchTerm) ||
    item.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.coupon_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
        </div>
        <p className="text-blue-600/80 font-bold text-sm tracking-widest uppercase animate-pulse">Loading Scores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 md:p-8 relative overflow-hidden mt-20">
      {/* Soft Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/50 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-100/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
              <Gamepad2 size={16} /> Player Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Scores</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium max-w-md">Review student performances, track coupon codes, and manage scholarship rewards efficiently.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl py-3 pl-11 pr-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm hover:border-slate-300"
              />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadExcel} 
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 border border-blue-500/20"
            >
              <Download size={18} /> <span>Export Excel</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Data Cards List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredScores.map((item, index) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all group relative overflow-hidden"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-indigo-500/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-colors duration-500 pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  
                  {/* User Info */}
                  <div className="lg:col-span-4 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-inner shadow-white/20 border border-blue-400/20 shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                      {item.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        {item.name}
                      </h2>
                      <div className="flex flex-col gap-1.5 mt-2 text-sm">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 w-fit">
                          <BookOpen size={12} /> {item.course}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500 font-medium ml-1">
                          <Phone size={14} className="text-slate-400" /> {item.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center transition-colors group-hover:bg-slate-100/50">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2 flex items-center gap-1"><Hash size={12}/> Coupon Code</span>
                      <span className="font-mono font-bold text-slate-700 text-base truncate">{item.coupon_code || "None generated"}</span>
                    </div>
                    <div className="bg-orange-50/80 border border-orange-100 p-4 rounded-2xl flex flex-col justify-center relative overflow-hidden transition-colors group-hover:bg-orange-100/50">
                      <div className="absolute -right-4 -bottom-4 text-orange-200/50 rotate-12"><Trophy size={64}/></div>
                      <span className="text-[10px] text-orange-600/80 font-black uppercase tracking-wider mb-2 flex items-center gap-1 relative z-10"><Trophy size={12}/> Game Score</span>
                      <span className="font-black text-3xl text-orange-600 leading-none relative z-10 flex items-baseline gap-1">
                        {item.score} <span className="text-xs font-bold tracking-widest uppercase opacity-70">Pts</span>
                      </span>
                    </div>
                    <div className="bg-emerald-50/80 border border-emerald-100 p-4 rounded-2xl flex flex-col justify-center relative overflow-hidden transition-colors group-hover:bg-emerald-100/50">
                      <div className="absolute -right-4 -top-4 text-emerald-200/50"><Sparkles size={64}/></div>
                      <span className="text-[10px] text-emerald-600/80 font-black uppercase tracking-wider mb-2 flex items-center gap-1 relative z-10"><Tag size={12}/> Scholarship Reward</span>
                      <span className="font-black text-3xl text-emerald-600 leading-none relative z-10 flex items-baseline gap-1">
                        {item.discount}% <span className="text-xs font-bold tracking-widest uppercase opacity-70">Off</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Operations Footer */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 relative z-10">
                  <div className="relative flex-1 group/input">
                    <div className="absolute top-3.5 left-4 pointer-events-none">
                      <MessageSquare size={16} className="text-slate-400 group-focus-within/input:text-blue-500 transition-colors" />
                    </div>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none transition-all placeholder:text-slate-400 font-medium"
                      placeholder="Add internal staff remarks or notes..."
                      rows={1}
                      value={feedbacks[item.id] || ""}
                      onChange={(e) => setFeedbacks({...feedbacks, [item.id]: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 shrink-0 items-start">
                    <button 
                      onClick={() => saveFeedback(item.id)}
                      className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Save size={16} /> <span className="hidden sm:inline">Save</span>
                    </button>
                    <button 
                      onClick={() => deleteScore(item.id)} 
                      className="px-5 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-sm hover:bg-red-100 hover:border-red-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Trash2 size={16} /> <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredScores.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border border-blue-100">
                <Search size={40} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">No records found</h3>
              <p className="text-slate-500 mt-2 font-medium max-w-sm">We couldn't find any student scores matching your search criteria. Try adjusting your filters.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameScores;