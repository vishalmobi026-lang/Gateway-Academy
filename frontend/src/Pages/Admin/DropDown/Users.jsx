import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { Users as UsersIcon, Download, Search, Trash2, Shield, Loader2, Key } from "lucide-react";

function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = () => {
    fetch("http://127.0.0.1:8000/auth/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  const downloadExcel = () => {
    const excelData = users.map((item) => ({
      ID: item.id,
      Username: item.username,
      Role: item.role,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "System_Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(file, "Gateway_System_Users.xlsx");
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? They will lose all access.")) return;
    try {
      await fetch(`http://127.0.0.1:8000/auth/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((item) => item.id !== id));
    } catch (err) { console.error(err); }
  };

  const filteredUsers = users.filter(item => 
    item.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin relative z-10" />
        </div>
        <p className="text-violet-600/80 font-bold text-sm tracking-widest uppercase animate-pulse">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 md:p-8 relative overflow-hidden mt-20">
      {/* Soft Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-100/50 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-100/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
              <Shield size={16} /> Access Control
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Users</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium max-w-md">Manage administrators and staff access to the dashboard.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl py-3 pl-11 pr-4 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm hover:border-slate-300"
              />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadExcel} 
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl shadow-[0_8px_20px_rgba(124,58,237,0.2)] hover:shadow-[0_12px_25px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center gap-2 border border-violet-500/20"
            >
              <Download size={18} /> <span>Export Excel</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Data Cards List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredUsers.map((item, index) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all group relative overflow-hidden flex flex-col gap-6 items-center text-center"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-fuchsia-500/0 group-hover:from-violet-50/50 group-hover:to-fuchsia-50/50 transition-colors duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-2xl font-black shadow-inner shadow-white/20 border-4 border-white shrink-0 transform group-hover:scale-105 transition-transform duration-300 mb-4 ring-4 ring-violet-50">
                    <UsersIcon size={32} />
                  </div>
                  
                  <h2 className="text-xl font-black text-slate-900 mb-2">
                    {item.username}
                  </h2>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold border border-violet-100">
                    <Key size={12} /> {item.role.toUpperCase()}
                  </div>
                </div>

                {/* Operations Footer */}
                <div className="border-t border-slate-100 pt-4 w-full flex justify-center relative z-10">
                  <button 
                    onClick={() => deleteUser(item.id)} 
                    className="w-full py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-black text-sm hover:bg-red-100 hover:border-red-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Trash2 size={16} /> <span>Revoke Access</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredUsers.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm">
              <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mb-6 border border-violet-100">
                <Search size={40} className="text-violet-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">No users found</h3>
              <p className="text-slate-500 mt-2 font-medium max-w-sm">There are no admin accounts matching your current search.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;