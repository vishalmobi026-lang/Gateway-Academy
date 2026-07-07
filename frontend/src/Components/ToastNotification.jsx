import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import successAnim from "../assets/success2.json";
import failAnim from "../assets/Not Found.json";

const LottieComponent = Lottie.default || Lottie;

/**
 * ToastNotification
 * Props:
 *  - type: "success" | "error"
 *  - message: string
 *  - visible: boolean
 *  - onClose: () => void
 *  - duration: number (ms, default 3500)
 */
export default function ToastNotification({
  type = "success",
  message = "",
  visible = false,
  onClose,
  duration = 3500,
}) {
  const timerRef = useRef(null);
  const [lottieKey, setLottieKey] = useState(0);

  useEffect(() => {
    if (visible) {
      // Force Lottie to remount & replay from frame 0 each time toast appears
      setLottieKey((k) => k + 1);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onClose?.();
      }, duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [visible, duration, onClose]);

  const isSuccess = type === "success";

  const config = {
    success: {
      anim: successAnim,
      gradient: "from-[#10b981] to-[#06b6d4]",
      border: "border-[#10b981]/30",
      glow: "shadow-[0_8px_40px_rgba(16,185,129,0.25)]",
      ring: "bg-[#10b981]/10",

    },
    error: {
      anim: failAnim,
      gradient: "from-[#ef4444] to-[#f43f8e]",
      border: "border-[#ef4444]/30",
      glow: "shadow-[0_8px_40px_rgba(239,68,68,0.25)]",
      ring: "bg-[#ef4444]/10",
      label: "Error",
    },
  };

  const cfg = config[type] || config.success;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`toast-overlay-${type}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className={`
              flex flex-col items-center gap-4 sm:gap-6
              bg-white/95
              border-2 ${cfg.border}
              rounded-[32px] sm:rounded-[40px] p-6 sm:p-10
              ${cfg.glow}
              w-full max-w-[320px] sm:max-w-[400px] mx-4
              select-none relative
              overflow-hidden
            `}
            role="alert"
            aria-live="polite"
          >
            {/* Lottie Icon — lottieKey forces remount so animation always replays */}
            <div className={`shrink-0 w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] rounded-[32px] sm:rounded-[40px] ${cfg.ring} flex items-center justify-center overflow-hidden mb-2 sm:mb-4`}>
              <LottieComponent
                key={lottieKey}
                animationData={cfg.anim}
                loop={false}
                autoplay={true}
                style={{ width: "100%", height: "100%", transform: "scale(1.5)" }}
              />
            </div>

            {(cfg.label || message) && (
              <div className="flex flex-col items-center gap-2 sm:gap-3 mb-2 sm:mb-6">
                {cfg.label && (
                  <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                    {cfg.label}
                  </h2>
                )}
                {message && (
                  <p className="text-sm sm:text-xl text-slate-600 text-center max-w-[90%] sm:max-w-[80%] font-medium">
                    {message}
                  </p>
                )}
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
