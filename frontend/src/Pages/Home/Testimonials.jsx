import { useState, useRef, useEffect } from "react";
import { FaQuoteLeft, FaStar, FaExternalLinkAlt, FaChevronDown, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const JUSTDIAL_URL =
  "https://www.justdial.com/Kanniyakumari/Gateway-Academy-Manoj-Medical-Backside-Thingal-Nagar/9999P4653-4653-250426144943-T3J2_BZDET";

/* ─── Fallback hardcoded reviews (used if fetch fails) ── */
const FALLBACK_REVIEWS = [
  {
    name: "Theboral",
    rating: 5,
    review:
      "Gateway Academy is an excellent coaching centre! The curriculum is very relevant and helps us learn well. The teachers are highly specialised and really know their subjects. With less than 10 students in class, we get personal attention. Regular tests help us improve too. Course materials are provided, making studying easier. I love learning here!",
  },
  {
    name: "Vasanth",
    rating: 5,
    review: "Well trained coach, excellent coaching centre.",
  },
  {
    name: "rabeena",
    rating: 5,
    review:
      "Gateway Academy is an excellent coaching center for competitive exams. The teachers are very knowledgeable and really understand the subjects. They explain difficult topics in a simple way, making it easier to learn. The study materials are also helpful and up-to-date. Overall, I had a great experience and feel more prepared for my exams! Highly recommend it!",
  },
];

/* ─── Animation variants ─────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

/* ─── Star renderer ──────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < count ? "text-[#fbbf24] text-sm" : "text-slate-200 text-sm"}
        />
      ))}
    </div>
  );
}

/* ─── Reusable card ───────────────────────────────────── */
function ReviewCard({ t }) {
  return (
    <div
      className="bg-slate-50 border border-slate-200 rounded-[20px] p-8 relative flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(245,158,11,0.18)] hover:border-[rgba(245,158,11,0.4)]"
      style={{ userSelect: "none" }}
    >
      <FaQuoteLeft className="text-3xl text-slate-200 absolute top-6 right-6" />
      <Stars count={t.rating ?? 5} />
      <p className="text-slate-600 text-[0.95rem] leading-[1.8] mb-6 italic flex-1">
        "{t.review}"
      </p>
      <div>
        <p className="font-primary font-bold text-slate-900 text-[1.1rem]">{t.name}</p>
        <p className="text-[#06b6d4] text-[0.8rem] font-semibold">
          {t.grade ?? "Student"}
          {t.date ? <span className="text-slate-400 ml-2 font-normal">· {t.date}</span> : null}
        </p>
      </div>
    </div>
  );
}

/* ─── Auto-scrolling marquee ─────────────────────────── */
function AutoScrollStrip({ reviews }) {
  const trackRef = useRef(null);
  const isPausedRef = useRef(false);
  const rafRef = useRef(null);
  const posRef = useRef(0);

  const CARD_W = 316;
  const HALF = reviews.length * CARD_W;
  const SPEED = 0.55;
  const cards = [...reviews, ...reviews]; // duplicate for seamless loop

  useEffect(() => {
    posRef.current = 0;
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (!isPausedRef.current) {
        posRef.current += SPEED;
        if (posRef.current >= HALF) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reviews]);

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex gap-4 will-change-transform"
        style={{ width: "max-content" }}
        onMouseEnter={() => (isPausedRef.current = true)}
        onMouseLeave={() => (isPausedRef.current = false)}
        onTouchStart={() => (isPausedRef.current = true)}
        onTouchEnd={() => (isPausedRef.current = false)}
      >
        {cards.map((t, i) => (
          <div key={i} style={{ width: "300px", flexShrink: 0 }}>
            <ReviewCard t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function Testimonials() {
  const [showMore, setShowMore] = useState(false);
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [totalRating, setTotalRating] = useState(4.9);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Fetch reviews.json (auto-updated by the scraper script) */
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/reviews.json?v=${Date.now()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data.reviews?.length > 0) {
          setReviews(data.reviews);
          setTotalRating(data.totalRating ?? 4.9);
          setLastUpdated(data.lastUpdated ?? null);
        }
      })
      .catch(() => {
        /* silently fall back to hardcoded reviews */
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  /* First 3 shown before "Review More" */
  const initialSlice = reviews.slice(0, 3);

  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* ─── Heading ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-14"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#f59e0b] mb-4
              before:content-[''] before:block before:w-[28px] before:h-[2px] before:bg-[#f59e0b]/30 before:rounded-full
              after:content-['']  after:block  after:w-[28px] after:h-[2px] after:bg-[#f59e0b]/30  after:rounded-full"
          >
            Student Stories
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="font-primary text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-slate-900 mb-4"
          >
            Hear From Our <span className="text-shimmer">Achievers</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-slate-600 text-lg max-w-2xl mx-auto">
            Rated{" "}
            <strong className="text-slate-900">{totalRating}/5</strong> by our
            students on Justdial.{" "}
            {loading && (
              <FaSpinner className="inline animate-spin text-slate-400 text-sm ml-1" />
            )}
          </motion.p>
          {/* Last updated badge */}
          {lastUpdated && (
            <motion.p
              variants={itemVariants}
              className="text-[0.72rem] text-slate-400 mt-2"
            >
              Reviews last synced:{" "}
              {new Date(lastUpdated).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </motion.p>
          )}
        </motion.div>

        {/* ─── First 3 Cards ───────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mb-8"
        >
          {initialSlice.map((t, i) => (
            <motion.div key={t.name + i} variants={itemVariants}>
              <ReviewCard t={t} />
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Review More button ───────────────────── */}
        <AnimatePresence>
          {!showMore && reviews.length > 3 && (
            <motion.div
              key="btn"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.22 } }}
              className="flex justify-center mb-10"
            >
              <motion.button
                onClick={() => setShowMore(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border-2 border-[#1a3af5]/30 bg-[#1a3af5]/5 text-[#1a3af5] font-primary font-bold text-[0.95rem] cursor-pointer transition-all duration-300 hover:bg-[#1a3af5]/10 hover:border-[#1a3af5]/60 hover:shadow-[0_8px_24px_rgba(26,58,245,0.15)]"
              >
                Review More ({reviews.length - 3} more)
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaChevronDown className="text-sm" />
                </motion.span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Auto-scroll strip ────────────────────── */}
        <AnimatePresence>
          {showMore && (
            <motion.div
              key="strip"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mb-12 -mx-6"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center flex-wrap gap-3 px-6 mb-5"
              >
                <img
                  src="/justdial1.png"
                  alt="JustDial"
                  onError={(e) => { e.target.style.display = "none"; }}
                  className="h-8 object-contain rounded-md"
                />
                <img
                  src="/justdial2.png"
                  alt="JustDial Reviews"
                  onError={(e) => { e.target.style.display = "none"; }}
                  className="h-8 object-contain rounded-md"
                />
                <span className="text-slate-600 text-sm font-semibold">
                  All {reviews.length} reviews from JustDial
                </span>
                {/* Live dot */}
                <span className="flex items-center gap-1.5 ml-auto mr-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f59e0b]" />
                  </span>
                  <span className="text-[0.75rem] text-slate-400 font-medium">Auto-scrolling</span>
                </span>
              </motion.div>

              {/* Marquee – all reviews fully visible */}
              <AutoScrollStrip reviews={reviews} />

              <p className="text-center text-slate-400 text-xs mt-4 select-none">
                Hover to pause · {reviews.length} reviews shown
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Rate Us CTA ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          className="text-center"
        >
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href={JUSTDIAL_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-slate-900 text-white font-primary font-bold transition-all duration-300 shadow-md no-underline hover:bg-[#1a3af5] hover:shadow-[0_8px_20px_rgba(26,58,245,0.3)]"
          >
            Rate Us on Justdial <FaExternalLinkAlt className="text-sm" />
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}