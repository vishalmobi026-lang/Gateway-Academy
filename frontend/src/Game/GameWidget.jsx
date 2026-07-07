import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import gameAnimation from "../assets/game/game.json";
import angeryAnimation from "../assets/game/angry_red_simple.json";

import Gameplay from "./Gameplay";

const LottieComponent = Lottie.default || Lottie;

// CSS keyframe heart — purely self-contained, no AnimatePresence conflict
function FloatingHeart() {
  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none text-4xl"
      style={{ animation: "heartFloat 2s ease-out forwards" }}
    >
      ❤️
      <style>{`
        @keyframes heartFloat {
          0%   { opacity: 0; transform: translateX(-50%) translateY(0px)   scale(0.3); }
          20%  { opacity: 1; transform: translateX(-50%) translateY(-15px) scale(1.3); }
          60%  { opacity: 1; transform: translateX(-50%) translateY(-45px) scale(1.1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-70px) scale(0.8); }
        }
      `}</style>
    </div>
  );
}

export default function GameWidget() {
  const [showWidget, setShowWidget] = useState(true);
  const [isGameplayOpen, setIsGameplayOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Listen to ContactWidget state
  useEffect(() => {
    const handleContactState = (e) => setIsContactOpen(e.detail);
    window.addEventListener("contactWidgetState", handleContactState);
    return () => window.removeEventListener("contactWidgetState", handleContactState);
  }, []);

  // Logic states
  const [isAltState, setIsAltState] = useState(false);
  const [altClickCount, setAltClickCount] = useState(0);
  const [heartKey, setHeartKey] = useState(null); // null = hidden, a number = show heart
  const timerRef = useRef(null);

  // The widget is truly "visible" only when:
  //   • showWidget === true (not scrolled to footer)
  //   • !isContactOpen (contact widget not open)
  //   • !isGameplayOpen (game not open)
  //   • document.visibilityState === "visible" (tab is active)
  const isWidgetVisible =
    showWidget && !isContactOpen && !isGameplayOpen;

  // ─── Inactivity timer – only runs while widget is visible ───────────────
  useEffect(() => {
    // Clear any existing timer whenever visibility or angry state changes
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only start the countdown if the widget is visible and NOT already angry
    if (isWidgetVisible && !isAltState) {
      timerRef.current = setTimeout(() => {
        setIsAltState(true);
        setAltClickCount(0);
      }, 30000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isWidgetVisible, isAltState]);

  // ─── Pause timer when browser tab goes into background ─────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden → clear timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // Tab visible again → restart if conditions met
        if (isWidgetVisible && !isAltState) {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setIsAltState(true);
            setAltClickCount(0);
          }, 30000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isWidgetVisible, isAltState]);

  // ─── Click handler ───────────────────────────────────────────────────────
  const handleWidgetClick = () => {
    if (isAltState) {
      setAltClickCount((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          setIsAltState(false);
          // Trigger heart: use a unique key so React mounts a fresh element each time
          setHeartKey(Date.now());
          return 0;
        }
        return next;
      });
    } else {
      setIsGameplayOpen(true);
    }
  };

  // Auto-remove the heart after its CSS animation finishes (2 s)
  useEffect(() => {
    if (heartKey === null) return;
    const t = setTimeout(() => setHeartKey(null), 2100);
    return () => clearTimeout(t);
  }, [heartKey]);

  // ─── Footer intersection observer ────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowWidget(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    const footer = document.querySelector("footer");
    if (footer) observer.observe(footer);
    return () => { if (footer) observer.unobserve(footer); };
  }, []);

  return (
    <AnimatePresence>
      {showWidget && !isContactOpen && (
        <motion.div
          key="widget"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-[100] pointer-events-none"
        >
          <div className="relative w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center pointer-events-auto">

            {/* ── Heart (CSS keyframe, no AnimatePresence) ── */}
            {heartKey !== null && <FloatingHeart key={heartKey} />}

            {/* ── Angry bubble ── */}
            <AnimatePresence>
              {isAltState && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 w-48 text-center z-20"
                >
                  <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] tracking-wide font-black uppercase shadow-md border border-zinc-800">
                    He is angry!
                  </div>
                  <div className="bg-white text-blue-600 px-4 py-2 rounded-2xl text-[11px] font-extrabold leading-tight shadow-xl border border-slate-100 backdrop-blur-sm">
                    Tap 3 times
                    <br />
                    to calm him down
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Lottie character ── */}
            <div className="relative z-10 cursor-pointer" onClick={handleWidgetClick}>
              <LottieComponent
                animationData={isAltState ? angeryAnimation : gameAnimation}
                loop={true}
                className="w-24 h-24 sm:w-40 sm:h-40"
              />
            </div>
          </div>
        </motion.div>
      )}

      {isGameplayOpen && (
        <Gameplay key="gameplay" onClose={() => setIsGameplayOpen(false)} />
      )}
    </AnimatePresence>
  );
}
