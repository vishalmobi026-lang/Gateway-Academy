import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArchiveRestore, Search, Trash2, Phone, Mail, Calendar, Loader2, MessageCircle, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ArchivedInquiries() {
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchArchived = () => {
    fetch("http://127.0.0.1:8000/enquiries/archived")
      .then((res) => res.json())
      .then((data) => {
        setArchived(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching archived enquiries:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArchived();
    const interval = setInterval(fetchArchived, 3000);
    return () => clearInterval(interval);
  }, []);

  const restoreEnquiry = async (id) => {
    if (!window.confirm("Restore this enquiry back to Inbox?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/enquiries/${id}/restore`, { method: "PATCH" });
      setArchived((prev) => prev.filter((item) => item.id !== id));
    } catch (err) { console.error(err); }
  };

  const permanentlyDelete = async (id) => {
    if (!window.confirm("Permanently delete this enquiry? This cannot be undone.")) return;
    try {
      await fetch(`http://127.0.0.1:8000/enquiries/${id}`, { method: "DELETE" });
      setArchived((prev) => prev.filter((item) => item.id !== id));
    } catch (err) { console.error(err); }
  };

  const filtered = archived.filter(item =>
    item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone?.includes(searchTerm) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pt-35 pb-12 px-4 sm:px-6 lg:px-8 font-body overflow-x-hidden">
      {/* Premium Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-slate-400/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-slate-400/10 rounded-full blur-[140px] translate-y-1/3 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto z-10">

        {/* Elite Header Area */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold tracking-wide mb-3 uppercase shadow-sm">
                <Clock size={14} /> Historical Records
              </div>
              <h1 className="text-4xl md:text-5xl font-primary font-black text-slate-900 tracking-tight">
                Archived <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">Inquiries</span>
              </h1>
              <p className="text-slate-500 text-[1.05rem] font-medium mt-3 max-w-2xl leading-relaxed">
                Review and restore previously processed or discarded communication logs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-slate-400" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search archive..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl py-3 pl-10 pr-4 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10 outline-none transition-all placeholder:text-slate-400 font-bold text-sm shadow-sm hover:shadow-md"
                />
              </div>
              <button
                onClick={() => navigate("/admin/inquiries")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 text-slate-700 px-7 py-3 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <ArrowLeft size={16} /> Back to Inbox
              </button>
            </div>
          </motion.div>
        </div>

        {/* Elite List Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] overflow-hidden"
        >
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[80px_2fr_3fr_1fr] gap-6 p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">ID</div>
            <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Sender Profile</div>
            <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Message Payload</div>
            <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest text-right pr-2">Actions</div>
          </div>

          <div className="flex flex-col divide-y divide-slate-100/80">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-slate-400 animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-wide">Accessing cold storage...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                  <ArchiveRestore className="text-slate-300 text-4xl" size={40} />
                </div>
                <h3 className="text-xl font-primary font-black text-slate-900 mb-2">Archive is Empty</h3>
                <p className="text-slate-500 max-w-sm">No historical records are currently stored.</p>
              </div>
            ) : (
              filtered.map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[80px_2fr_3fr_1fr] gap-4 md:gap-6 p-6 items-start hover:bg-slate-50/80 transition-colors group relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-400" />

                  <div className="hidden md:block text-xs font-black text-slate-300 tracking-widest pt-3">
                    #{String(item.id).padStart(3, '0')}
                  </div>

                  <div className="flex items-start gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-[14px] bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 text-[1.2rem] font-black shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                      {item.full_name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-primary font-black text-slate-600 group-hover:text-slate-900 transition-colors leading-tight mb-1.5">{item.full_name}</h3>
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-slate-400">
                          <Phone size={12} /> {item.phone}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-slate-400 truncate w-full max-w-[180px]">
                          <Mail size={12} /> {item.email || "No Email"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 md:pt-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 mb-1">
                      <Calendar size={12} /> {new Date(item.created_at).toLocaleString()}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm text-[0.85rem] text-slate-500 leading-relaxed font-medium italic">
                      {item.message}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 md:mt-0 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => restoreEnquiry(item.id)}
                      className="flex items-center justify-center w-[40px] h-[40px] rounded-xl bg-white border border-blue-200 shadow-sm hover:shadow hover:bg-blue-50 text-blue-500 transition-all"
                      title="Restore to Inbox"
                    >
                      <ArchiveRestore size={16} />
                    </button>
                    <button
                      onClick={() => permanentlyDelete(item.id)}
                      className="flex items-center justify-center w-[40px] h-[40px] rounded-xl bg-white border border-red-200 shadow-sm hover:shadow hover:bg-red-50 text-red-500 transition-all"
                      title="Permanently Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ArchivedInquiries;
