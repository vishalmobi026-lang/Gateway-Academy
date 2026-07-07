import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "./Components/LoadingScreen";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import GameWidget from "./Game/GameWidget";
import ContactWidget from "./Components/ContactWidget";

import Home from "./Pages/Home/Home";

import About from "./About";
import Courses from "./Courses";
import Contact from "./Contact";
import Enroll from "./Enroll";

import AdminLogin from "./Pages/Admin/AdminLogin";

// the dropdown import section
import Users from "./Pages/Admin/DropDown/Users";
import Enquiries from "./Pages/Admin/DropDown/Enquiries";
import ContactAD from "./Pages/Admin/DropDown/ContactAD";
import StudentEnroll from "./Pages/Admin/DropDown/Student_enroll";
import GameScores from "./Pages/Admin/DropDown/Game_Scores";
import ArchivedInquiries from "./Pages/Admin/DropDown/ArchivedInquiries";
import VerifyCoupon from "./Pages/Admin/DropDown/VerifyCoupon";
import CourseManagement from "./Pages/Admin/DropDown/CourseManagement";
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time (e.g. fetching config, assets, etc.)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 seconds loading screen

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/inquiries" element={<Enquiries />} />
            <Route path="/admin/contact-ad" element={<ContactAD />} />
            <Route path="/admin/enrollments" element={<StudentEnroll />} />
            <Route path="/admin/game-scores" element={<GameScores />} />
            <Route path="/admin/ArchivedInquiries" element={<ArchivedInquiries />} />
            <Route path="/admin/VerifyCoupon" element={<VerifyCoupon />} />
            <Route path="/admin/CourseManagement"element={<CourseManagement />} />
          </Routes>
        </main>

        <Footer />
      </div>

      <GameWidget />
      <ContactWidget />
    </>
  );
}

export default App;
