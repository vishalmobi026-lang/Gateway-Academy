import achievement1 from "../../assets/AchievementImages/student1.jpg";
import achievement2 from "../../assets/AchievementImages/student5.png";
import achievement3 from "../../assets/AchievementImages/3.webp";
import achievement4 from "../../assets/AchievementImages/4.jpg";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const achievements = [
  {
    image: achievement1,
    title: "Sanchai kumar.k",
    description:
      "Successfully cleared the Tamil subject in the 10th Standard supplementary examination after dedicated preparation and guidance from our institution.",
    date: "March 2025",
  },
  {
    image: achievement2,
    title: "Placement Drive",
    description:
      "Students participated in placement drives and received opportunities from leading companies and industry partners.",
    date: "February 2025",
  },
  {
    image: achievement3,
    title: "Certificate Distribution",
    description:
      "Students were awarded certificates recognizing their successful completion of professional training programs.",
    date: "January 2025",
  },
  {
    image: achievement4,
    title: "Project Expo",
    description:
      "Students showcased innovative projects demonstrating creativity, technical expertise and teamwork.",
    date: "December 2024",
  },
];

export default function RecentAchievements() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % achievements.length);
    }, 3500);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <section className="min-h-screen bg-white overflow-hidden flex items-center relative">
      {/* Background Effects */}
      <div
        className={`absolute rounded-full blur-[100px] pointer-events-none opacity-40 bg-[radial-gradient(circle,#1a3af5,transparent)] w-[600px] h-[600px] -top-[150px] -left-[150px] ${isMobile ? "animate-orb-1" : "animate-float"}`}
      />

      <div
        className={`absolute rounded-full blur-[100px] pointer-events-none opacity-30 bg-[radial-gradient(circle,#06b6d4,transparent)] w-[400px] h-[400px] -bottom-[100px] -right-[80px] ${isMobile ? "animate-orb-2" : "[animation:float_6s_ease-in-out_infinite_reverse]"}`}
      />

      <div className="absolute rounded-full blur-[100px] pointer-events-none opacity-20 bg-[radial-gradient(circle,#f59e0b,transparent)] w-[300px] h-[300px] top-[40%] right-[20%]" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#f59e0b] mb-4 before:content-[''] before:block before:w-[28px] before:h-[2px] before:bg-[#f59e0b]/30 before:rounded-full after:content-[''] after:block after:w-[28px] after:h-[2px] after:bg-[#f59e0b]/30 after:rounded-full">
            Student Achievements
          </div>

          <h2 className="font-primary text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold text-slate-900">
            Our <span className="text-shimmer">Achievers</span>
          </h2>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
            Celebrating academic excellence, competitions, certifications and
            student success stories.
          </p>
        </div>
        {/* Carousel */}
        <div className="relative h-[360px] flex items-center justify-center perspective-[1200px]">
          {achievements.map((item, index) => {
            const offset =
              (index - activeIndex + achievements.length) % achievements.length;

            let x, rotateY, scale, zIndex;
            let opacity = 1;

            if (offset === 0) {
              x = 0;
              rotateY = 0;
              scale = 1;
              zIndex = 50;
            } else if (offset === 1) {
              x = 300;
              rotateY = -55;
              scale = 0.8;
              zIndex = 30;
            } else if (offset === achievements.length - 1) {
              x = -300;
              rotateY = 55;
              scale = 0.8;
              zIndex = 30;
            } else {
              x = 500;
              rotateY = -65;
              scale = 0.55;
              opacity = 0.35;
              zIndex = 10;
            }

            return (
              <motion.div
                key={index}
                className="absolute cursor-pointer"
                animate={{
                  x,
                  rotateY,
                  scale,
                  opacity,
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeInOut",
                }}
                style={{ zIndex }}
                onClick={() => setActiveIndex(index)}>
                <div className="w-[240px] bg-white rounded-[28px] overflow-hidden shadow-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[220px] object-cover"
                  />

                  <div className="p-4 text-center">
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-4">
          {achievements.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-10 bg-cyan-500" : "w-3 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Achievement Details */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mt-4">
          <p className="text-cyan-600 text-sm font-semibold uppercase tracking-[0.2em]">
            {achievements[activeIndex].date}
          </p>

          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
            {achievements[activeIndex].title}
          </h3>

          <p className="text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
            {achievements[activeIndex].description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
