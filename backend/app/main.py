from fastapi import FastAPI

from app.database import Base, engine

# Models
from app.models.user import User
from app.models.enrollment import Enrollment
from app.models.enquiry import Enquiry
from app.models.game_score import GameScore
from app.models.question import Question

# Routers
from app.routers.auth import router as auth_router
from app.routers.enrollments import router as enrollment_router
from app.routers.enquiries import router as enquiry_router
from app.routers.game_scores import router as score_router
from app.routers.admin import router as admin_router
from app.routers.questions import router as questions_router
from app.routers.courses import router as course_router
#for allowing CORS requests from frontend
from fastapi.middleware.cors import CORSMiddleware
# Create all database tables
Base.metadata.create_all(bind=engine)


# FastAPI App
app = FastAPI(
    title="Gateway Academy API",
    version="1.0.0",
    description="Backend API for Gateway Academy"
)
# we added a middleware to allow CORS requests from our frontend running on localhost:5173. This is necessary for the frontend to communicate with the backend without running into cross-origin issues. We specify the allowed origins, methods, and headers to ensure secure communication between the two.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register Routers
app.include_router(auth_router)
app.include_router(enrollment_router)
app.include_router(enquiry_router)
app.include_router(score_router)
app.include_router(admin_router)
app.include_router(questions_router)
app.include_router(course_router)

# Home Route
@app.get("/")
def home():
    return {
        "message": "Gateway Academy Backend Running"
    }


# Database Connection Test
@app.get("/gateway_academy")
def db_test():
    try:
        connection = engine.connect()
        connection.close()

        return {
            "status": "success",
            "message": "PostgreSQL Connected Successfully"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

