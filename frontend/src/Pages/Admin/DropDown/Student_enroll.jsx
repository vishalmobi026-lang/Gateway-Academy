import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Download, Search, Trash2, Phone, Calendar, Loader2, Mail, MapPin, Building2, BookOpen } from "lucide-react";

function StudentEnroll() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEnrollments = () => {
    fetch("https://gateway-academy.onrender.com/enrollments/")
      .then((res) => res.json())
      .then((data) => {
        setEnrollments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching enrollments:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEnrollments();
    const interval = setInterval(fetchEnrollments, 3000);
    return () => clearInterval(interval);
  }, []);

  const downloadExcel = () => {
    const excelData = enrollments.map((item) => ({
      ID: item.id,
      Name: item.student_name,
      Phone: item.phone,
      Email: item.email,
      Programme: item.programme,
      College: item.college,
      Address: item.address,
      Date: new Date(item.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(file, "Gateway_Enrollments.xlsx");
  };

  const deleteEnrollment = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this enrollment?")) return;
    try {
      await fetch(`https://gateway-academy.onrender.com/enrollments/${id}`, { method: "DELETE" });
      setEnrollments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) { console.error(err); }
  };

  const filteredEnrollments = enrollments.filter(item => 
    item.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.phone?.includes(searchTerm) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.programme?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
        </div>
        <p className="text-indigo-600/80 font-bold text-sm tracking-widest uppercase animate-pulse">Loading Enrollments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 md:p-8 relative overflow-hidden mt-20">
      {/* Soft Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-100/50 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
              <GraduationCap size={16} /> Admissions
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Enrollments</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium max-w-md">Manage new student applications and course registrations.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl py-3 pl-11 pr-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm hover:border-slate-300"
              />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadExcel} 
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(79,70,229,0.2)] hover:shadow-[0_12px_25px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 border border-indigo-500/20"
            >
              <Download size={18} /> <span>Export Excel</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Data Cards List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredEnrollments.map((item, index) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all group relative overflow-hidden flex flex-col gap-6"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-blue-500/0 group-hover:from-indigo-50/50 group-hover:to-blue-50/50 transition-colors duration-500 pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                  <div className="lg:col-span-4 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-inner shadow-white/20 border border-indigo-400/20 shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                      {item.student_name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        {item.student_name}
                      </h2>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <a href={`tel:${item.phone}`} className="flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-indigo-600 transition-colors">
                          <Phone size={14} className="text-slate-400" /> {item.phone}
                        </a>
                        <a href={`mailto:${item.email}`} className="flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-indigo-600 transition-colors">
                          <Mail size={14} className="text-slate-400" /> {item.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex flex-col justify-center">
                      <span className="text-[10px] text-indigo-400 font-black uppercase tracking-wider mb-2 flex items-center gap-1"><BookOpen size={12}/> Programme</span>
                      <span className="font-bold text-indigo-900 text-base">{item.programme}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2 flex items-center gap-1"><Building2 size={12}/> College / School</span>
                      <span className="font-bold text-slate-700 text-base truncate">{item.college || "Not Provided"}</span>
                    </div>
                    <div className="md:col-span-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-center">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin size={12}/> Address</span>
                      <span className="font-medium text-slate-600 text-sm leading-relaxed">{item.address}</span>
                    </div>
                  </div>
                </div>

                {/* Operations Footer */}
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-xs font-bold">
                    <Calendar size={14} /> Applied on {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => deleteEnrollment(item.id)} 
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-black text-sm hover:bg-red-100 hover:border-red-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Trash2 size={16} /> <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEnrollments.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border border-indigo-100">
                <Search size={40} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">No enrollments found</h3>
              <p className="text-slate-500 mt-2 font-medium max-w-sm">There are no student applications matching your current criteria.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentEnroll;