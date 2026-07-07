import os
import sys

# Add the parent directory to the path so we can import 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database import engine, SessionLocal
from app.models import Course, CourseDiscipline, CourseDeliverable

courses_data = [
    {
        "id": "TNPSC",
        "icon": "FaUserGraduate",
        "title": "TNPSC Coaching",
        "image_url": "Class X CBSE Coaching.png",
        "learning_mode": "Interactive Classroom Sessions",
        "description": "Expert coaching for TNPSC Group I, II, IIA & IV with comprehensive study materials and regular mock tests.",
        "disciplines": ["General Tamil/English", "Aptitude & Mental Ability", "General Studies", "Current Affairs"],
        "deliverables": ["Complete syllabus coverage", "State-level mock tests", "Daily current affairs", "Interview guidance"],
        "color": "#e83e8c",
        "enroll_text": "Enroll Now"
    },
    {
        "id": "class-x",
        "icon": "FaUserGraduate",
        "title": "Class X  Supplementary Exam Coaching",
        "image_url": "Class X CBSE Coaching.png",
        "learning_mode": "Interactive Classroom Sessions",
        "description": "Comprehensive coaching covering all CBSE Class X subjects with focused preparation for Board examinations.",
        "disciplines": ["Mathematics", "Science", "Social Studies", "English", "Hindi"],
        "deliverables": ["Weekly mock tests", "Previous year paper drills", "Personal doubt sessions"],
        "color": "#1a3af5",
        "enroll_text": "Enroll Now"
    },
    {
        "id": "class-xi",
        "icon": "FaBookOpen",
        "title": "Class XII  Supplementary Exam Coaching",
        "image_url": "Class XI CBSE Coaching.png",
        "learning_mode": "Interactive Classroom Sessions",
        "description": "Expert guidance for Class XI students to build strong conceptual foundations in their chosen streams.",
        "disciplines": ["Physics", "Chemistry", "Mathematics", "Biology", "Accountancy"],
        "deliverables": ["Concept-first teaching", "Lab-integrated learning", "Stream-specific guidance", "Regular assessments"],
        "color": "#06b6d4",
        "enroll_text": "Enroll Now"
    },
    {
        "id": "rrb",
        "icon": "FaTrain",
        "title": "Railway Exam Prep (RRB)",
        "image_url": "Railway Exam Prep (RRB).png",
        "learning_mode": "Interactive Classroom Sessions",
        "description": "Structured coaching for all Railway Recruitment Board exams including RRB NTPC, Group D, ALP & Technician.",
        "disciplines": ["General Awareness", "Mathematics", "Reasoning", "General Science"],
        "deliverables": ["Current affairs updates", "Speed & accuracy drills", "Full-length mock tests", "Shortcut techniques"],
        "color": "#7c3aed",
        "enroll_text": "Enroll Now"
    },
    {
        "id": "ssc",
        "icon": "FaFileAlt",
        "title": "SSC Exam Prep",
        "image_url": "SSC Exam Prep.png",
        "learning_mode": "Interactive Classroom Sessions",
        "description": "Intensive preparation for SSC CGL, CHSL, MTS and other Staff Selection Commission exams.",
        "disciplines": ["Quantitative Aptitude", "English Language", "General Intelligence", "General Awareness"],
        "deliverables": ["Tier-wise preparation", "Previous year analysis", "Sectional tests", "Interview guidance (for CGL)"],
        "color": "#d97706",
        "enroll_text": "Enroll Now"
    }
]

def alter_schema():
    print("Altering schema to add color and icon columns...")
    with engine.connect() as con:
        try:
            con.execute(text("ALTER TABLE courses ADD COLUMN color VARCHAR(50) DEFAULT '#1a3af5'"))
            con.execute(text("ALTER TABLE courses ADD COLUMN icon VARCHAR(50) DEFAULT 'FaUserGraduate'"))
            con.commit()
            print("Schema altered successfully.")
        except Exception as e:
            print(f"Columns might already exist or error occurred: {e}")

def seed_db():
    print("Seeding database...")
    db = SessionLocal()
    try:
        # Clear existing courses
        db.query(Course).delete()
        db.commit()

        for c_data in courses_data:
            course = Course(
                title=c_data["title"],
                description=c_data["description"],
                learning_mode=c_data["learning_mode"],
                image_url=c_data["image_url"],
                enroll_text=c_data["enroll_text"],
                color=c_data["color"],
                icon=c_data["icon"]
            )
            db.add(course)
            db.commit()
            db.refresh(course)

            for d in c_data["disciplines"]:
                discipline = CourseDiscipline(name=d, course_id=course.id)
                db.add(discipline)
            
            for d in c_data["deliverables"]:
                deliverable = CourseDeliverable(name=d, course_id=course.id)
                db.add(deliverable)
                
            db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    alter_schema()
    seed_db()
