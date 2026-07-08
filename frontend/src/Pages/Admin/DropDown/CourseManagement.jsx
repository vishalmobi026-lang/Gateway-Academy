import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, FaEdit, FaTrash, FaTimes, FaSyncAlt, 
  FaUserGraduate, FaBookOpen, FaTrain, FaFileAlt, 
  FaLayerGroup 
} from "react-icons/fa";

// Component Map for rendering string icon names back into React Icons
const iconMap = {
  "FaUserGraduate": <FaUserGraduate />,
  "FaBookOpen": <FaBookOpen />,
  "FaTrain": <FaTrain />,
  "FaFileAlt": <FaFileAlt />,
};

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    learning_mode: "Interactive Classroom Sessions",
    image_url: "Class X CBSE Coaching.png",
    enroll_text: "Enroll Now",
    color: "#1a3af5",
    icon: "FaUserGraduate",
    disciplines: "",
    deliverables: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("https://gateway-academy.onrender.com/courses/");
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        learning_mode: course.learning_mode,
        image_url: course.image_url,
        enroll_text: course.enroll_text,
        color: course.color,
        icon: course.icon,
        disciplines: course.disciplines.map((d) => d.name).join(", "),
        deliverables: course.deliverables.map((d) => d.name).join(", "),
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        learning_mode: "Interactive Classroom Sessions",
        image_url: "Class X CBSE Coaching.png",
        enroll_text: "Enroll Now",
        color: "#1a3af5",
        icon: "FaUserGraduate",
        disciplines: "",
        deliverables: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      disciplines: formData.disciplines
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name })),
      deliverables: formData.deliverables
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name })),
    };

    try {
      const url = editingCourse
        ? `https://gateway-academy.onrender.com/courses/${editingCourse.id}`
        : "https://gateway-academy.onrender.com/courses/";

      const method = editingCourse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save course");

      handleCloseModal();
      fetchCourses();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`https://gateway-academy.onrender.com/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pt-35 pb-12 px-4 sm:px-6 lg:px-8 font-body overflow-x-hidden">
      
      {/* Premium Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[140px] translate-y-1/3 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto z-10">
        
        {/* Elite Header Area */}
        <div className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide mb-3 uppercase shadow-sm">
                <FaLayerGroup /> Database Controller
              </div>
              <h1 className="text-4xl md:text-5xl font-primary font-black text-slate-900 tracking-tight">
                Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Management</span>
              </h1>
              <p className="text-slate-500 text-[1.05rem] font-medium mt-3 max-w-2xl leading-relaxed">
                Seamlessly orchestrate your academic catalog. Add, refine, or organize active programmes in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={fetchCourses}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
                Refresh Data
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-7 py-3.5 rounded-2xl font-bold transition-all shadow-[0_8px_25px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.35)] hover:-translate-y-0.5"
              >
                <FaPlus />
                Create Course
              </button>
            </div>
          </motion.div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <p className="font-bold text-sm tracking-wide">{error}</p>
          </motion.div>
        )}

        {/* Analytics Card (Visual Flair) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8"
        >
          <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">Active Catalog</p>
              <h3 className="text-4xl font-primary font-black text-slate-900">{courses.length}</h3>
            </div>
            <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 text-blue-600 flex items-center justify-center text-2xl relative z-10 shadow-inner">
              <FaBookOpen />
            </div>
          </div>
          {/* Transparent decorative stat blocks */}
          <div className="hidden md:flex bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md rounded-[24px] p-6 border border-white flex-col justify-center relative overflow-hidden">
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
             <p className="text-slate-700 font-bold flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Systems Operational
             </p>
          </div>
        </motion.div>

        {/* Elite List Layout (Replaces basic table) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.03)] overflow-hidden"
        >
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[80px_2.5fr_1.5fr_1fr] gap-6 p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
             <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">ID</div>
             <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Programme Identity</div>
             <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Delivery Mode</div>
             <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest text-right pr-2">Operations</div>
          </div>

          <div className="flex flex-col divide-y divide-slate-100/80">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-wide">Syncing Data Vault...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                  <FaLayerGroup className="text-slate-300 text-4xl" />
                </div>
                <h3 className="text-xl font-primary font-black text-slate-900 mb-2">No Programmes Found</h3>
                <p className="text-slate-500 max-w-sm">Your catalog is currently empty. Start by initializing a new course infrastructure.</p>
                <button onClick={() => handleOpenModal()} className="mt-6 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  + Create First Course
                </button>
              </div>
            ) : (
              courses.map((course, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  key={course.id}
                  className="grid grid-cols-1 md:grid-cols-[80px_2.5fr_1.5fr_1fr] gap-4 md:gap-6 p-6 items-center hover:bg-slate-50/80 transition-colors group relative"
                >
                  {/* Subtle hover gradient indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: course.color || '#1a3af5' }} />

                  <div className="hidden md:block text-xs font-black text-slate-300 tracking-widest">
                    #{String(course.id).padStart(3, '0')}
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-[1.4rem] shadow-[0_8px_20px_rgba(0,0,0,0.12)] shrink-0 transform-gpu group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 border border-white/20"
                      style={{ background: `linear-gradient(135deg, ${course.color || '#1a3af5'}, ${course.color || '#1a3af5'}dd)` }}
                    >
                      {iconMap[course.icon] || <FaBookOpen />}
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-primary font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{course.title}</h3>
                      <p className="text-[0.85rem] text-slate-500 line-clamp-2 leading-relaxed font-medium">{course.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-4 md:mt-0 items-start">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[0.7rem] font-bold uppercase tracking-wider bg-white shadow-sm border border-slate-200 text-slate-600">
                      {course.learning_mode}
                    </span>
                    <div className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 opacity-80">
                      <span>{course.disciplines.length} Tags</span> <span className="w-1 h-1 rounded-full bg-slate-300" /> <span>{course.deliverables.length} Highlights</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-5 md:mt-0">
                    <button 
                      onClick={() => handleOpenModal(course)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow hover:border-blue-200 text-slate-600 hover:text-blue-600 text-sm font-bold transition-all"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="w-[42px] h-[42px] flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                      title="Delete Course"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* State-of-the-Art Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl mt-20 bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[80vh] border border-slate-100"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                <div>
                  <h2 className="text-2xl font-primary font-black text-slate-900 tracking-tight">
                    {editingCourse ? "Configure Course" : "Initialize New Course"}
                  </h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {editingCourse ? `ID: #${String(editingCourse.id).padStart(3, '0')}` : "System Database Entry"}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all shadow-sm"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/30">
                <form id="course-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Primary Info Segment */}
                  <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Core Attributes</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Programme Title</label>
                        <input
                          required
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400"
                          placeholder="e.g. TNPSC Intensive Coaching"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Delivery Mode</label>
                        <input
                          required
                          name="learning_mode"
                          value={formData.learning_mode}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400"
                          placeholder="e.g. Interactive Classroom Sessions"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Comprehensive Description</label>
                      <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm resize-none placeholder:text-slate-400"
                        placeholder="Detailed course description outlining scope and methodology..."
                      />
                    </div>
                  </div>

                  {/* Aesthetics Segment */}
                  <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Visual Aesthetics</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brand Color</label>
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                          <input
                            type="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 bg-transparent shrink-0"
                          />
                          <input
                            required
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-full bg-transparent border-none outline-none text-sm font-bold uppercase text-slate-700 tracking-wider"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Icon Blueprint</label>
                        <select
                          required
                          name="icon"
                          value={formData.icon}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1.25rem_center]"
                        >
                          <option value="FaUserGraduate">Graduation Cap</option>
                          <option value="FaBookOpen">Open Book</option>
                          <option value="FaTrain">Train (RRB)</option>
                          <option value="FaFileAlt">Document (SSC)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cover Image Link</label>
                        <input
                          required
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400"
                          placeholder="e.g. banner.png"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Arrays Segment */}
                  <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Categorization & Perks</h3>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                          <span>Disciplines</span>
                          <span className="text-slate-400 lowercase font-medium tracking-normal">(comma separated)</span>
                        </label>
                        <input
                          name="disciplines"
                          value={formData.disciplines}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-300"
                          placeholder="Physics, Chemistry, Mathematics..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                          <span>Deliverables</span>
                          <span className="text-slate-400 lowercase font-medium tracking-normal">(comma separated)</span>
                        </label>
                        <input
                          name="deliverables"
                          value={formData.deliverables}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-300"
                          placeholder="Weekly Mock Tests, Interview Guidance..."
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-4 relative z-10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="course-form"
                  disabled={saving}
                  className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] transition-all disabled:opacity-70 disabled:shadow-none flex items-center gap-2 text-sm hover:-translate-y-0.5"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {saving ? "Commiting..." : editingCourse ? "Commit Changes" : "Deploy Course"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}