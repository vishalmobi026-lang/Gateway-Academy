import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Download, Search, Trash2, Phone, Calendar, Loader2, MessageCircle, RefreshCw } from "lucide-react";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEnquiries = () => {
    fetch("https://gateway-academy.onrender.com/enquiries/")
      .then((res) => res.json())
      .then((data) => {
        // Filter only contact page enquiries
        const filteredData = data.filter(item => item.source === "contact_page");
        setEnquiries(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching enquiries:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEnquiries();
    const interval = setInterval(fetchEnquiries, 3000);
    return () => clearInterval(interval);
  }, []);

  const downloadExcel = () => {
    const excelData = enquiries.map((item) => ({
      ID: item.id,
      Name: item.full_name,
      Phone: item.phone,
      Email: item.email,
      Message: item.message,
      Date: new Date(item.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(file, "Gateway_Enquiries.xlsx");
  };

  const archiveEnquiry = async (id) => {
    if (!window.confirm("Move this enquiry to Archived Inquiries?")) return;
    try {
      await fetch(`https://gateway-academy.onrender.com/enquiries/${id}/archive`, { method: "PATCH" });
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) { console.error(err); }
  };

  const filteredEnquiries = enquiries.filter(item => 
    item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.phone?.includes(searchTerm) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pt-35 pb-12 px-4 sm:px-6 lg:px-8 font-body overflow-x-hidden">
      {/* Premium Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[140px] translate-y-1/3 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto z-10">
        
        {/* Elite Header Area */}
        <div className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide mb-3 uppercase shadow-sm">
                <Mail size={14} /> Inbox Controller
              </div>
              <h1 className="text-4xl md:text-5xl font-primary font-black text-slate-900 tracking-tight">
                Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Enquiries</span>
              </h1>
              <p className="text-slate-500 text-[1.05rem] font-medium mt-3 max-w-2xl leading-relaxed">
                Monitor and manage communications received via the primary contact form.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-slate-400" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl py-3 pl-10 pr-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 font-bold text-sm shadow-sm hover:shadow-md"
                />
              </div>
              <button
                onClick={downloadExcel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-7 py-3 rounded-2xl font-bold transition-all shadow-[0_8px_25px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_30px_rgba(79,70,229,0.35)] hover:-translate-y-0.5"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </motion.div>
        </div>

        {/* Analytics Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8"
        >
          <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">Unresolved Queries</p>
              <h3 className="text-4xl font-primary font-black text-slate-900">{filteredEnquiries.length}</h3>
            </div>
            <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-2xl relative z-10 shadow-inner">
              <MessageCircle size={24} />
            </div>
          </div>
        </motion.div>

        {/* Elite List Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-wide">Syncing Comm channels...</p>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                  <Mail className="text-slate-300 text-4xl" size={40} />
                </div>
                <h3 className="text-xl font-primary font-black text-slate-900 mb-2">No Active Enquiries</h3>
                <p className="text-slate-500 max-w-sm">Inbox is completely clear. You're fully caught up!</p>
              </div>
            ) : (
              filteredEnquiries.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[80px_2fr_3fr_1fr] gap-4 md:gap-6 p-6 items-start hover:bg-slate-50/80 transition-colors group relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500" />

                  <div className="hidden md:block text-xs font-black text-slate-300 tracking-widest pt-3">
                    #{String(item.id).padStart(3, '0')}
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-[1.2rem] font-black shadow-[0_8px_20px_rgba(79,70,229,0.3)] shrink-0 group-hover:scale-105 transition-transform">
                      {item.full_name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-primary font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1.5">{item.full_name}</h3>
                      <div className="flex flex-col gap-1">
                        <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-slate-500 hover:text-indigo-500 transition-colors">
                          <Phone size={12} /> {item.phone}
                        </a>
                        <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-slate-500 hover:text-indigo-500 transition-colors truncate w-full max-w-[180px]">
                          <Mail size={12} /> {item.email || "No Email"}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 md:pt-0">
                    <div className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 mb-1">
                      <Calendar size={12} /> {new Date(item.created_at).toLocaleString()}
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-[0.85rem] text-slate-600 leading-relaxed font-medium">
                      {item.message}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 md:mt-0 pt-2">
                    <button 
                      onClick={() => archiveEnquiry(item.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-amber-200 shadow-sm hover:shadow hover:bg-amber-50 text-amber-600 text-sm font-bold transition-all"
                      title="Move to Archive"
                    >
                      <Trash2 size={14} /> Archive
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

export default Enquiries;