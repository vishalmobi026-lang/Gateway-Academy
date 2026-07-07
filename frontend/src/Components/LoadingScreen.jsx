
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading/loading.json"; // Assuming this is where the lottie file is

// Fallback for Vite/ESM interop issues where default export is wrapped
const LottieComponent = Lottie.default || Lottie;

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
         <LottieComponent animationData={loadingAnimation} loop={true} className="w-full h-full" />
         
         {/* Logo overlay centered inside the animation */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src="/logo.png" alt="Gateway Academy" className="w-20 h-20 object-contain drop-shadow-md animate-pulse" />
         </div>
      </div>
      <p className="mt-4 font-primary font-semibold text-slate-500 tracking-wide animate-pulse">Loading Gateway Academy...</p>
    </div>
  );
}
