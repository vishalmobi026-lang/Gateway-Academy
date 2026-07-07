import {
  FaGraduationCap as GraduationCap,
  FaBookOpen as BookOpen,
  FaDesktop as Monitor,
  FaFileAlt as FileText,
} from "react-icons/fa";

const courses = [
  {
    id: 1,
    title: "TNPSC Coaching",
    description: "Expert coaching for TNPSC Group I, II, IIA & IV.",
    color: "pink",
    tags: ["Group I", "Group II", "Group IV"],
    icon: GraduationCap,
  },
  {
    id: 2,
    title: "Class X Coaching",
    description: "Comprehensive coaching covering all CBSE Class X subjects.",
    color: "blue",
    tags: ["CBSE", "All Subjects"],
    icon: GraduationCap,
  },
  {
    id: 3,
    title: "Class XI Coaching",
    description: "Expert guidance for Class XI students.",
    color: "cyan",
    tags: ["CBSE", "Science"],
    icon: BookOpen,
  },
  {
    id: 4,
    title: "Railway Exam Prep",
    description: "Structured coaching for Railway Recruitment exams.",
    color: "purple",
    tags: ["RRB", "RRC"],
    icon: Monitor,
  },
  {
    id: 5,
    title: "SSC Exam Prep",
    description: "Intensive preparation for SSC exams.",
    color: "orange",
    tags: ["SSC", "CGL"],
    icon: FileText,
  },
];

export default function CourseSelection({ selectedCourse, setSelectedCourse }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const Icon = course.icon;

        return (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course.title)}
            className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300
            ${
              selectedCourse === course.title
                ? "border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                : "border-slate-200 hover:border-cyan-300"
            }`}
          >
            <div className="mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center">
                <Icon className="text-white" size={26} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>

            <p className="mt-3 text-slate-600 text-sm leading-7">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full border"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 font-semibold text-cyan-600">Enroll Now →</div>
          </div>
        );
      })}
    </div>
  );
}
