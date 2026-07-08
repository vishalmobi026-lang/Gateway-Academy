import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy, ArrowRight, ShieldAlert, Sparkles, Copy, CheckCircle2,
    ChevronLeft, ChevronRight, Heart, Zap,
    User, Phone, BookOpen, X, Loader2,
    ChevronDown, AlertCircle, Rocket, Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";




const smoothEase = [0.16, 1, 0.3, 1];


const PLANET_THEMES = [
    { name: "Neon Prime", bg: "from-[#0a0514] via-[#11092e] to-[#0a1930]", primary: "#22d3ee", nebula1: "bg-cyan-600/20", nebula2: "bg-indigo-600/20" },
    { name: "Crimson Forge", bg: "from-[#1a0505] via-[#2a0808] to-[#1f0a0a]", primary: "#ef4444", nebula1: "bg-red-600/20", nebula2: "bg-orange-600/20" },
    { name: "Verdant Toxic", bg: "from-[#051a0a] via-[#092e11] to-[#0a1f10]", primary: "#22c55e", nebula1: "bg-green-600/20", nebula2: "bg-emerald-600/20" },
    { name: "Amethyst Void", bg: "from-[#14051a] via-[#24092e] to-[#1f0a28]", primary: "#a855f7", nebula1: "bg-purple-600/20", nebula2: "bg-fuchsia-600/20" },
    { name: "Solar Core", bg: "from-[#1a1505] via-[#2e2409] to-[#1f190a]", primary: "#eab308", nebula1: "bg-yellow-600/20", nebula2: "bg-amber-600/20" },
    { name: "Glacial Ring", bg: "from-[#0a141a] via-[#09242e] to-[#0a1f28]", primary: "#e2e8f0", nebula1: "bg-slate-400/20", nebula2: "bg-blue-400/20" }
];

/* ================= NEON STRIKE GAME COMPONENT ================= */

// Detect mobile once — used to strip heavy GPU effects
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

export default function NeonStrikeGame({ onClose }) {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState("intro");
    const [score, setScore] = useState(0);
    const [playerLane, setPlayerLane] = useState(1);
    const [entities, setEntities] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(1);
    const [shake, setShake] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [takingScreenshot, setTakingScreenshot] = useState(false);
    const voucherRef = useRef(null);

    const [currentPlanet, setCurrentPlanet] = useState(0);

    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", countryCode: "+91", phone: "", course: "" });
    const [formError, setFormError] = useState("");
    const [isFetchingQs, setIsFetchingQs] = useState(false);

    const stateRef = useRef({
        lane: 1, score: 0, lives: 3, combo: 1,
        speed: 0.35,
        entities: [], flashTimer: 0, frame: 0,
        questions: [], qIndex: 0, isQuestionActive: false,
        spawnTimer: 30, correctCount: 0, questionsAnswered: 0,
        laserActive: false, blastColor: "#22d3ee", blastTimer: 0
    });

    const gameLoopRef = useRef(null);

    useEffect(() => {
        // Categories are hardcoded below — no API fetch needed
        setCountries([]);
    }, []);

    // Categories are hardcoded below — no API fetch needed

    // Lock body scroll when overlay is open
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 400);
    };

    const addFloatingText = (text, color, lane) => {
        const id = Date.now() + Math.random();
        setFloatingTexts(prev => [...prev, { id, text, color, lane }]);
        setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1000);
    };

    const copyToClipboard = () => {
        const codeToCopy = couponCode || "GTEC-SCORE-XXXX";
        navigator.clipboard.writeText(codeToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    };

    const takeScreenshot = async () => {
        if (!voucherRef.current) return;
        try {
            setTakingScreenshot(true);
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
            const dataUrl = await toPng(voucherRef.current, {
                quality: 1.0,
                pixelRatio: 2,
            });
            const link = document.createElement("a");
            link.download = `GTEC_Scholarship_${couponCode || "VOUCHER"}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Screenshot failed:", error);
        } finally {
            setTakingScreenshot(false);
        }
    };

    const handlePhoneChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, "");
        setFormData({ ...formData, phone: digitsOnly });
    };

    // Using Vite environment variables for security
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "REPLACE_WITH_REAL_GEMINI_KEY";

    const submitForm = async () => {
        if (!formData.course) {
            return setFormError("Please select a target course.")
        }

        setFormError("")
        setIsFetchingQs(true)

        try {
            // Create a specific topic mapping to guide the AI better
            let detailedTopic = formData.course;
            if (formData.course === "TNPSC Coaching") detailedTopic = "Tamil Nadu Public Service Commission (TNPSC) exams, Tamil Nadu history, geography, and general knowledge";
            if (formData.course === "Class X Coaching") detailedTopic = "CBSE Class 10 Science (physics/chemistry/biology basics), Mathematics, and Social Science";
            if (formData.course === "Class XI Coaching") detailedTopic = "CBSE Class 11 Physics, Chemistry, Biology, and foundational Mathematics";
            if (formData.course === "Railway Exam Prep") detailedTopic = "Indian Railway Recruitment Board (RRB) exams, general science, logical reasoning, and basic math";
            if (formData.course === "SSC Exam Prep") detailedTopic = "Staff Selection Commission (SSC) exams, general intelligence, quantitative aptitude, and general awareness";

            const prompt = `Generate 30 very short, simple, and completely randomized multiple-choice questions about "${detailedTopic}". Please provide a fresh, different set of questions each time. The question must be at least 5 words and under 15 words. Each option MUST be extremely short (1-3 words maximum). Respond ONLY with valid JSON array, no markdown: [{"q":"Short question?","options":["A","B","C","D"],"correct":0}]. Randomization seed: ${Math.random()}`;

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                }
            );
            if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
            const data = await res.json();
            const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const cleaned = raw.replace(/```json|```/g, "").trim();
            const finalQuestions = JSON.parse(cleaned);

            if (!Array.isArray(finalQuestions) || finalQuestions.length === 0) {
                setFormError("No questions returned. Try again.");
                setIsFetchingQs(false);
                return;
            }
            startGame(finalQuestions);

            // Fire-and-forget: Save questions to the backend database
            try {
                const questionsToSave = finalQuestions.map(q => ({...q, topic: formData.course}));
                fetch("https://gateway-academy.onrender.com/questions/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(questionsToSave)
                }).catch(e => console.error("Failed to save generated questions to DB:", e));
            } catch (e) {}

        } catch (error) {
            console.error(error);
            console.warn("Gemini API is unavailable or failed to parse. Falling back to DB.");
            
            try {
                const fallbackRes = await fetch(`https://gateway-academy.onrender.com/questions/fallback?course=${encodeURIComponent(formData.course)}`);
                if (!fallbackRes.ok) throw new Error("Backend fallback failed");
                
                const fallbackQuestions = await fallbackRes.json();
                if (!Array.isArray(fallbackQuestions) || fallbackQuestions.length === 0) {
                    setFormError("Offline question bank is currently empty for this course. Please ensure your internet is working or try again later.");
                    return;
                }
                
                // Shuffle fallback questions so they are randomized
                const shuffledFallback = fallbackQuestions.sort(() => Math.random() - 0.5);
                startGame(shuffledFallback);
            } catch (fallbackError) {
                console.error("Fallback DB error:", fallbackError);
                setFormError("Failed to fetch questions. Please check your network connection.");
            }
        } finally {
            setIsFetchingQs(false);
        }
    }

            useEffect(() => {
                const handleKeyDown = (e) => {
                    if (gameState !== "playing") return;
                    if (e.key === "ArrowLeft" && stateRef.current.lane > 0) movePlayer(-1);
                    if (e.key === "ArrowRight" && stateRef.current.lane < 2) movePlayer(1);
                };
                window.addEventListener("keydown", handleKeyDown);
                return () => window.removeEventListener("keydown", handleKeyDown);
            }, [gameState]);

            const movePlayer = (direction) => {
                const newLane = stateRef.current.lane + direction;
                if (newLane >= 0 && newLane <= 2) {
                    stateRef.current.lane = newLane;
                    setPlayerLane(newLane);
                }
            };

            const startGame = (questionsToPlay) => {
                setGameState("playing");
                setScore(0); setLives(3); setCombo(1); setEntities([]);

                setCurrentQuestion(questionsToPlay[0].q);

                setCurrentPlanet(0);

                stateRef.current = {
                    lane: 1, score: 0, lives: 3, combo: 1, speed: 0.35, entities: [],
                    flashTimer: 0, frame: 0, questions: questionsToPlay, qIndex: 0,
                    isQuestionActive: false, spawnTimer: 30, correctCount: 0,
                    questionsAnswered: 0
                };

                setCorrectCount(0);

                setPlayerLane(1);
                gameLoopRef.current = setInterval(gameTick, 30);
            };

            const gameTick = () => {
                const state = stateRef.current;
                state.frame += 1;

                if (state.frame % 300 === 0) state.speed += 0.015;
                if (state.flashTimer > 0) state.flashTimer -= 30;

                if (!state.isQuestionActive) {
                    if (state.spawnTimer > 0) {
                        state.spawnTimer--;
                    } else {
                        if (state.qIndex >= state.questions.length) state.qIndex = 0;

                        const qData = state.questions[state.qIndex];
                        state.isQuestionActive = true;

                        const laneOrder = [0, 1, 2];
                        const selectedOptions = [];
                        selectedOptions.push({ text: qData.options[qData.correct], isCorrect: true });

                        const incorrects = qData.options.filter((_, i) => i !== qData.correct);
                        selectedOptions.push({ text: incorrects[0] || "None", isCorrect: false });
                        selectedOptions.push({ text: incorrects[1] || "All", isCorrect: false });

                        selectedOptions.sort(() => Math.random() - 0.5);

                        selectedOptions.forEach((opt, index) => {
                            state.entities.push({
                                id: Date.now() + Math.random(),
                                lane: laneOrder[index],
                                top: -10,
                                text: opt.text,
                                isCorrect: opt.isCorrect,
                                revealed: false
                            });
                        });
                    }
                }

                let hitWrong = false;
                let waveCompleted = false;

                state.entities = state.entities.map(ent => ({ ...ent, top: ent.top + state.speed }))
                    .filter(ent => {
                        const inHitbox = ent.top > 75 && ent.top < 90 && ent.lane === state.lane;

                        if (inHitbox && !ent.revealed) {
                            ent.revealed = true;
                            waveCompleted = true;
                            state.questionsAnswered += 1;

                            if (state.questionsAnswered % 5 === 0 && state.questionsAnswered > 0) {
                                state.speed += 0.04; // Speed bump at new planet
                            }

                            if (ent.isCorrect) {
                                state.correctCount += 1;

                                const pts = 10; // 10 points per correct answer
                                state.score += pts;
                                state.combo = Math.min(state.combo + 1, 10);
                                setCombo(state.combo);
                                setCorrectCount(state.correctCount);
                                addFloatingText(`+${pts}`, "text-green-400", state.lane);
                            } else {
                                hitWrong = true;
                                addFloatingText("WRONG", "text-red-500", state.lane);
                            }
                        }
                        return ent.top < 120;
                    });

                if (waveCompleted) {
                    setTimeout(() => {
                        state.entities = [];
                        state.isQuestionActive = false;
                        state.qIndex++;

                        if (state.qIndex >= state.questions.length) state.qIndex = 0;
                        setCurrentQuestion(state.questions[state.qIndex].q);

                        state.spawnTimer = 30;
                    }, 200);
                }

                if (hitWrong) {
                    triggerShake();
                    state.lives -= 1;
                    state.combo = 1;
                    state.flashTimer = 2000;

                    setLives(state.lives);
                    setCombo(state.combo);

                    if (state.lives <= 0) {
                        endGame();
                        return;
                    }
                }

                if (state.frame % 3 === 0) {
                    setScore(state.score);
                    setEntities([...state.entities]);
                    setCurrentPlanet(Math.floor(state.questionsAnswered / 5));
                }
            };

            const endGame = async () => {
                clearInterval(gameLoopRef.current);

                const finalScore = stateRef.current.score;
                let prefix = "B2";
                if (finalScore > 10000) prefix = "X9";
                else if (finalScore > 5000) prefix = "V7";

                const code = `GTEC-${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                const count = stateRef.current.correctCount;
                const calculatedDiscount = count >= 20 ? 7 : count >= 10 ? 5 : count >= 7 ? 4 : count >= 5 ? 3 : count >= 3 ? 2 : 1;

                setCouponCode(code);
                setDiscount(calculatedDiscount);
                setGameState("result");

                const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
                try {
                    await fetch("https://gateway-academy.onrender.com/scores/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: formData.name,
                            phone: fullPhoneNumber,
                            course: formData.course,
                            score: finalScore,
                            coupon_code: code,
                            discount: calculatedDiscount,

                        }),
                    });
                } catch (error) { console.error("Failed to save score:", error); }

            };

            const handleExit = () => {
                clearInterval(gameLoopRef.current);
                onClose();
            };

            return (
                <div className={`fixed inset-0 z-[99999] flex items-center justify-center font-sans select-none w-full h-full transition-colors duration-1000 ${gameState === "playing"
                    ? `bg-gradient-to-br ${PLANET_THEMES[currentPlanet % PLANET_THEMES.length].bg} overflow-hidden`
                    : "bg-slate-900/95 md:bg-slate-900/30 md:backdrop-blur-md overflow-y-auto"
                    }`}>

                    {gameState === "playing" ? (
                        <>
                            {!isMobile && <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] ${PLANET_THEMES[currentPlanet % PLANET_THEMES.length].nebula1} blur-[150px] rounded-full pointer-events-none nebula-glow-1 transition-colors duration-1000`}></div>}
                            {!isMobile && <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] ${PLANET_THEMES[currentPlanet % PLANET_THEMES.length].nebula2} blur-[150px] rounded-full pointer-events-none nebula-glow-2 transition-colors duration-1000`}></div>}
                        </>
                    ) : (
                        <>
                            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-100/40 blur-[150px] rounded-full pointer-events-none"></div>
                            <div className="hidden md:block absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/40 blur-[150px] rounded-full pointer-events-none"></div>
                        </>
                    )}

                    {gameState !== "playing" && (
                        <button onClick={handleExit} className="absolute top-4 right-4 md:top-6 md:right-6 z-[100000] bg-white/95 hover:bg-red-50 text-slate-400 hover:text-red-500 p-3 rounded-full border border-blue-100 shadow-xl transition-all duration-500 active:scale-95">
                            <X size={24} />
                        </button>
                    )}

                    <motion.div
                        animate={shake ? { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full relative z-10 flex flex-col justify-start md:justify-center max-w-[1920px] mx-auto overflow-x-hidden"
                        style={{ overflowY: gameState === 'playing' ? 'hidden' : 'auto' }}
                    >
                        <AnimatePresence mode="wait">
                            {/* ----- 1. INTRO SCREEN ----- */}
                            {gameState === "intro" && (
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.7, ease: smoothEase }}
                                    className="w-full min-h-screen flex items-center justify-center p-4 py-12 md:p-8"
                                >
                                    <div className="w-full max-w-6xl mx-auto">

                                        {/* TOP BADGE */}
                                        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center mb-6 md:mb-8">
                                            <div className="inline-flex items-center gap-2 md:gap-3 bg-white rounded-full px-3 py-2 md:px-5 md:py-2.5 shadow-lg border border-slate-100 max-w-[90vw]">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0"></div>
                                                <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-700 truncate">Gateway Academy · Scholarship Challenge</span>
                                                <div className="bg-indigo-100 text-indigo-700 text-[9px] md:text-xs font-black px-1.5 md:px-2 py-0.5 rounded-full shrink-0">LIVE</div>
                                            </div>
                                        </motion.div>

                                        {/* HERO HEADING */}
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center mb-8 md:mb-10 px-2">
                                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-tight md:leading-none">
                                                Win a{" "}
                                                <span className="relative inline-block mt-2 sm:mt-0">
                                                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)" }}>Scholarship</span>
                                                    <motion.div animate={{ scaleX: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -bottom-1 left-0 right-0 h-1 rounded-full" style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }}></motion.div>
                                                </span>
                                            </h1>
                                            <p className="text-slate-500 text-sm sm:text-base md:text-xl mt-4 font-medium px-4">Test your knowledge and earn up to <span className="text-indigo-600 font-bold">7% off</span> your course fee.</p>
                                        </motion.div>

                                        {/* 3-COLUMN GRID */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                            {/* LEFT: STAT CARDS */}
                                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4">
                                                {[
                                                    { val: "7%", sub: "Max Discount", emoji: "🏆", from: "#059669", to: "#10b981" },
                                                    { val: "3♥", sub: "Lives Per Game", emoji: "❤️", from: "#dc2626", to: "#f87171" },
                                                ].map((s, i) => (
                                                    <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.08 }} whileHover={{ y: -4, scale: 1.02 }} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex items-center gap-4 cursor-default">
                                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0" style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>{s.emoji}</div>
                                                        <div>
                                                            <div className="text-3xl font-black text-slate-900 leading-none">{s.val}</div>
                                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.sub}</div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>

                                            {/* CENTER: MAIN CARD */}
                                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
                                                <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#4f46e5,#7c3aed,#2563eb,#4f46e5)", backgroundSize: "200% auto", animation: "shimmer 3s linear infinite" }}></div>
                                                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                                                    <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-28 h-28 rounded-3xl mb-6 flex items-center justify-center text-6xl shadow-xl" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
                                                        🚀
                                                    </motion.div>
                                                    <h2 className="text-2xl font-black text-slate-900 mb-2">How to Play</h2>
                                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">Your ship flies through three answer lanes. Navigate into the correct answer before it disappears!</p>
                                                    <div className="w-full space-y-2.5">
                                                        {[
                                                            "← → Arrow keys or tap buttons to move",
                                                            "Fly into the CORRECT answer lane",
                                                            "3 wrong answers ends the game",
                                                        ].map((tip, i) => (
                                                            <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3 text-left" style={{ background: i === 0 ? "#eef2ff" : i === 1 ? "#f0fdf4" : "#fff1f2", border: `1px solid ${i === 0 ? "#c7d2fe" : i === 1 ? "#bbf7d0" : "#fecdd3"}` }}>
                                                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: i === 0 ? "#4f46e5" : i === 1 ? "#059669" : "#dc2626" }}>{i + 1}</div>
                                                                <span className="text-sm font-semibold text-slate-700">{tip}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-6 pt-0">
                                                    <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setGameState("form")} className="w-full py-4 rounded-2xl text-white font-black text-lg uppercase tracking-wider shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-3" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
                                                        <Rocket size={20} /> Register & Play
                                                    </motion.button>
                                                </div>
                                            </motion.div>

                                            {/* RIGHT: DISCOUNT TIERS */}
                                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-4">
                                                <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex-1">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Trophy size={16} className="text-yellow-500" />
                                                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Discount Tiers</h3>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {[
                                                            { correct: "20+ correct", discount: "7%", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
                                                            { correct: "10–19 correct", discount: "5%", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
                                                            { correct: "7–9 correct", discount: "4%", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe" },
                                                            { correct: "5–6 correct", discount: "3%", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
                                                            { correct: "3–4 correct", discount: "2%", color: "#9333ea", bg: "#faf5ff", border: "#e9d5ff" },
                                                            { correct: "1–2 correct", discount: "1%", color: "#db2777", bg: "#fdf2f8", border: "#fbcfe8" },
                                                        ].map((t, i) => (
                                                            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ backgroundColor: t.bg, border: `1px solid ${t.border}` }}>
                                                                <span className="text-xs font-semibold text-slate-600">{t.correct}</span>
                                                                <span className="text-sm font-black" style={{ color: t.color }}>{t.discount} OFF</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl p-5 shadow-md text-white" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
                                                    <div className="text-3xl mb-2">⚡</div>
                                                    <p className="font-black text-lg leading-tight">Fresh Questions Every Time</p>
                                                    <p className="text-indigo-200 text-xs mt-1.5 leading-relaxed">Powered by Google Gemini AI — no two sessions are ever the same.</p>
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ----- 2. FORM SCREEN ----- */}
                            {gameState === "form" && (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full max-w-5xl my-8 md:my-auto mx-auto bg-gradient-to-br from-[#546292] via-[#1e3a8a] to-[#0f172a] md:backdrop-blur-2xl p-5 sm:p-8 md:p-12 rounded-[2.5rem] border border-cyan-500/20 shadow-xl md:shadow-[0_0_50px_-12px_rgba(34,211,238,0.15)] relative"
                                >
                                    {/* Inset Border Glow */}
                                    <div className="absolute inset-0 rounded-[2.5rem] border border-cyan-400/10 pointer-events-none z-20" />

                                    <div className="hidden md:block absolute -top-[50%] -right-[20%] w-[100%] h-[150%] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
                                        <div className="space-y-6">
                                            <div>
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">

                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-md">Register & Play</h2>
                                                <p className="text-cyan-100/60 text-sm md:text-base font-semibold leading-relaxed">
                                                    Fill in your details to start the scholarship challenge.
                                                </p>
                                            </div>

                                            <div className="space-y-5">
                                                {/* Full Name Input Field */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-cyan-200/50 font-bold uppercase tracking-wider pl-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Full Name</label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                                            <User className="text-cyan-600 group-focus-within:text-cyan-400 group-focus-within:-translate-y-0.5 transition-all duration-300 ease-out" size={20} />
                                                        </div>
                                                        <input
                                                            type="text" placeholder="Enter full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 pl-12 pr-4 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out text-base placeholder:text-cyan-600/50 font-semibold shadow-inner focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Phone Number Input Field */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-cyan-200/50 font-bold uppercase tracking-wider pl-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Contact Number</label>
                                                    <div className="flex gap-2 sm:gap-3 relative">
                                                        <div className="relative w-[42%] sm:w-[35%] shrink-0 group">
                                                            <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none z-20">
                                                                <Phone className="text-cyan-600 group-focus-within:text-cyan-400 transition-colors duration-200 ease-out" size={16} />
                                                            </div>
                                                            <select
                                                                value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                                                className="w-full bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 pl-8 sm:pl-10 pr-6 sm:pr-8 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out appearance-none text-xs sm:text-base font-semibold cursor-pointer relative z-10 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                                            >
                                                                <option value="+91">IN (+91)</option>
                                                                {Array.isArray(countries) && countries.map((c) => <option key={c.id} value={`+${c.phonecode}`}>{c.id} (+{c.phonecode})</option>)}
                                                            </select>
                                                            <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none z-20">
                                                                <ChevronDown className="text-cyan-600 group-focus-within:text-cyan-400 transition-colors duration-200 ease-out" size={16} />
                                                            </div>
                                                        </div>

                                                        <input
                                                            type="text" placeholder="Phone Number" value={formData.phone} onChange={handlePhoneChange} maxLength={formData.countryCode === "+91" ? 10 : 15}
                                                            className="w-[58%] sm:w-[65%] bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 px-3 sm:px-5 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out font-mono tracking-wider text-sm sm:text-lg placeholder:text-cyan-600/50 placeholder:font-sans font-semibold shadow-inner focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Course Selection Input Field */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-cyan-200/50 font-bold uppercase tracking-wider pl-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Target Sector</label>
                                                    <div className="relative group">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                                            <BookOpen className="text-cyan-600 group-focus-within:text-cyan-400 group-focus-within:-translate-y-0.5 transition-all duration-300 ease-out" size={20} />
                                                        </div>
                                                        <select
                                                            value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                                            className="w-full bg-[#060b18]/80 border border-cyan-500/20 text-white rounded-2xl py-4 pl-12 pr-10 hover:bg-[#0a1128] focus:bg-[#0a1128] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all duration-300 ease-out appearance-none text-base md:text-lg font-semibold cursor-pointer relative z-10 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                                        >
                                                            <option value="" disabled className="text-slate-400">Select Target Sector</option>
                                                            {[
                                                                "TNPSC Coaching",
                                                                "Class X Coaching",
                                                                "Class XI Coaching",
                                                                "Railway Exam Prep",
                                                                "SSC Exam Prep"
                                                            ].map((course) => (
                                                                <option key={course} value={course} className="text-slate-900 bg-white">
                                                                    {course}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-20">
                                                            <ChevronDown className="text-cyan-600 group-focus-within:text-cyan-400 transition-colors duration-200 ease-out" size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {formError && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.4, ease: smoothEase }} className="flex items-center gap-3 text-red-700 text-sm font-bold bg-red-50 py-3 px-4 rounded-xl border border-red-100">
                                                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                                                    <p>{formError}</p>
                                                </motion.div>
                                            )}

                                            <button
                                                onClick={submitForm}
                                                disabled={isFetchingQs}
                                                className="relative w-full overflow-hidden rounded-2xl bg-[#1e1e2e] p-[2px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                                            >
                                                {/* Elegant Gradient Border */}
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-blue-500/50 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                                                {/* Main Button Surface with Inset Highlight */}
                                                <div className="relative flex h-full w-full items-center justify-center gap-3 rounded-[14px] bg-[#0b0c10] px-8 py-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors duration-300 group-hover:bg-[#13141f]">

                                                    {isFetchingQs ? (
                                                        <>
                                                            <Loader2 className="animate-spin text-blue-400" size={20} />
                                                            <span className="font-semibold tracking-wide">Calibrating...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Rocket
                                                                size={20}
                                                                className="text-blue-400 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                                                            />
                                                            <span className="text-lg font-bold tracking-tight text-white/90">
                                                                READY TO LAUNCH
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </button>                                </div>

                                        {/* Ultimate 3D Gyro HUD Graphic Card */}
                                        {/* RIGHT SIDE SIMPLE ILLUSTRATION */}
                                        <div className="relative p-8 bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                            {/* Ambient background glow */}
                                            <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[120px]" />

                                            <div className="relative z-10 text-center">
                                                <div className="text-6xl mb-6">🎓</div>
                                                <h3 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Ready to Start?</h3>
                                                <p className="text-slate-400 mb-10">Complete your registration and begin the challenge.</p>

                                                <div className="grid gap-4">
                                                    {[
                                                        { icon: "🎯", title: "Skill Assessment", desc: "Test your knowledge.", color: "cyan" },
                                                        { icon: "🏆", title: "Scholarship", desc: "Earn up to 7% discount.", color: "amber" },
                                                        { icon: "⚡", title: "Instant Results", desc: "Get scores immediately.", color: "purple" }
                                                    ].map((item, i) => (
                                                        <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300">
                                                            <div className={`p-3 rounded-xl bg-${item.color}-500/20 text-xl`}>{item.icon}</div>
                                                            <div className="text-left">
                                                                <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">{item.title}</h4>
                                                                <p className="text-xs text-slate-400">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ----- 3. GAMEPLAY HUD ----- */}
                            {gameState === "playing" && (
                                <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: smoothEase }} className="flex flex-col h-full w-full relative">
                                    <div className="absolute top-0 left-0 w-full z-[100] pointer-events-none p-3 md:p-6 flex justify-between items-start">
                                        <div className="flex flex-col gap-2 md:gap-3 pointer-events-auto">
                                            <div className="relative overflow-hidden flex flex-col gap-1 md:gap-1.5 bg-white/10 md:backdrop-blur-xl p-3 md:p-5 rounded-2xl md:rounded-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 min-w-[130px] md:max-w-[200px]">
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                                                {/* Pulsing indicator */}
                                                <div className="absolute top-2 right-3 md:right-4 flex items-center gap-1.5">
                                                    <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#a855f7]"></span>
                                                    <span className="font-sans text-[7px] md:text-[8px] text-purple-200/80 font-bold tracking-wider">LIVE</span>
                                                </div>

                                                <p className="font-sans text-[8px] md:text-[9px] text-white/70 font-black uppercase tracking-widest mb-0 md:mb-0.5 z-10">Total Score</p>
                                                <div className="font-black font-sans text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-sm flex items-baseline gap-1 md:gap-1.5 leading-none mt-0.5 md:mt-0 z-10">
                                                    {score.toLocaleString()} <span className="text-[10px] md:text-[11px] text-yellow-500/80 font-bold tracking-widest uppercase">PTS</span>
                                                </div>

                                                <div className="flex items-center justify-between mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-white/10 z-10">
                                                    <span className="font-sans text-[7px] md:text-[8px] text-white/60 font-bold uppercase tracking-widest">Shields</span>
                                                    <div className="flex gap-0.5 md:gap-1">
                                                        {[...Array(3)].map((_, i) => (
                                                            <Heart key={i} size={12} className={i < lives ? "text-pink-500 fill-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-[heartPulse_1.5s_infinite_alternate] md:w-[14px] md:h-[14px]" : "text-white/20 md:w-[14px] md:h-[14px]"} style={{ animationDelay: `${i * 0.15}s` }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`w-fit px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl font-black font-mono text-xs md:text-lg flex items-center gap-1.5 md:gap-2 shadow-md md:shadow-xl md:backdrop-blur-md transition-all duration-500 ease-out ${combo > 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50 shadow-sm md:shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-black/40 text-white/50 border border-white/10'}`}>
                                                <Zap size={14} className={`md:w-[18px] md:h-[18px] ${combo > 1 ? "fill-yellow-400" : ""}`} /> x{combo}
                                            </div>
                                        </div>
                                        <div className="hidden md:flex flex-col items-center justify-start w-1/2 max-w-2xl mt-1">
                                            <AnimatePresence mode="wait">
                                                {currentQuestion && (
                                                    <motion.div
                                                        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4, ease: smoothEase }}
                                                        className="bg-indigo-950/40 backdrop-blur-2xl border border-purple-400/30 rounded-full py-4 px-8 text-center shadow-[0_10px_40px_rgba(88,28,135,0.4)] w-full relative overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>

                                                        {/* Decorative background glow */}
                                                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 blur-[40px] rounded-full pointer-events-none"></div>
                                                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/20 blur-[40px] rounded-full pointer-events-none"></div>

                                                        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-70"></div>

                                                        <div className="relative z-10 flex flex-col items-center">
                                                            <div className="bg-purple-900/50 border border-purple-400/30 rounded-full px-3 py-1 mb-2 inline-flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
                                                                <Sparkles size={10} className="text-pink-300" />
                                                                <span className="text-purple-200 text-[9px] font-black uppercase tracking-widest">Question</span>
                                                            </div>
                                                            <h3 className="text-xl md:text-2xl font-black text-white leading-tight px-4 select-text drop-shadow-md">{currentQuestion}</h3>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="pointer-events-auto">
                                            <button onClick={handleExit} className="bg-white/10 hover:bg-red-500/80 text-white p-2.5 md:p-3 rounded-full md:backdrop-blur-md transition-all duration-500 border border-white/20 shadow-lg">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:hidden absolute top-[135px] left-1/2 -translate-x-1/2 w-[94%] sm:w-[90%] z-[90] pointer-events-none">
                                        <AnimatePresence mode="wait">
                                            {currentQuestion && (
                                                <motion.div
                                                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4, ease: smoothEase }}
                                                    className="bg-indigo-950/60 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-3 sm:p-4 text-center shadow-xl relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-70"></div>
                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <div className="bg-purple-900/50 border border-purple-400/30 rounded-full px-2 py-0.5 mb-1.5 inline-flex items-center gap-1">
                                                            <span className="w-1 h-1 rounded-full bg-pink-400 animate-pulse" />
                                                            <span className="text-purple-200 text-[8px] font-black uppercase tracking-widest">Question</span>
                                                        </div>
                                                        <h3 className="text-sm sm:text-base font-black text-white leading-snug px-1 select-text drop-shadow-sm">{currentQuestion}</h3>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="relative flex-1 w-full overflow-hidden" style={{ perspective: '1200px' }}>
                                        {/* Deep Space Parallax Starfields */}
                                        <div className="absolute inset-0 starfield-1 opacity-20 pointer-events-none"></div>
                                        <div className="hidden md:block absolute inset-0 starfield-2 opacity-50 pointer-events-none"></div>
                                        <div className="hidden md:block absolute inset-0 starfield-3 opacity-75 pointer-events-none"></div>

                                        <div
                                            className="absolute bottom-0 w-full h-full md:h-[250%] md:[transform:rotateX(60deg)] md:[transform-origin:bottom_center] md:[transform-style:preserve-3d] md:[mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_100%)] md:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_100%)]"
                                        >
                                            {/* Sleek Digital Grid Layer (Perspective Movement lines) */}
                                            <div className="absolute inset-0 opacity-30">
                                                {/* Thin sliding horizontal lines - now softer purple/pink */}
                                                <div className="hidden md:block absolute inset-0 bg-[linear-gradient(transparent_97%,rgba(216,180,254,0.35)_97%)] bg-[length:100%_120px] animate-[slideDown_0.6s_linear_infinite]"></div>
                                            </div>

                                            {/* Soft Glowing Lane Separators */}
                                            <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-80">
                                                <div className="w-[1px] md:w-[3px] h-full bg-purple-400/20 md:bg-purple-300/40 shadow-none md:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all duration-500 rounded-full"></div>
                                                <div className="w-[1px] md:w-[3px] h-full bg-purple-400/20 md:bg-purple-300/40 shadow-none md:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all duration-500 rounded-full"></div>
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 z-[60] pointer-events-none">
                                            {entities.map(ent => {
                                                const progress = ent.top / 100;
                                                let xPos = 50;
                                                const vw = window.innerWidth;

                                                const laneSpread = vw < 768 ? 16 : 18;
                                                const perspectiveSpread = vw < 768 ? 18 : 24;

                                                if (ent.lane === 0) {
                                                    xPos = 50 - (laneSpread + progress * perspectiveSpread);
                                                }

                                                if (ent.lane === 2) {
                                                    xPos = 50 + (laneSpread + progress * perspectiveSpread);
                                                }
                                                const scale = 0.6 + (progress * 0.4);

                                                return (
                                                    <div key={ent.id}
                                                        className="absolute top-0 left-0 w-full h-full pointer-events-none will-change-transform"
                                                        style={{
                                                            transform: `translate3d(${xPos}%, ${ent.top}%, 0)`,
                                                            zIndex: Math.floor(ent.top)
                                                        }}>
                                                        <div className="absolute top-0 left-0 pointer-events-auto flex flex-col items-center justify-center"
                                                            style={{
                                                                transform: `translate(-50%, -50%) scale(${scale})`,
                                                                width: '55%'
                                                            }}>

                                                            {!ent.revealed && (
                                                                <div className="relative flex items-center justify-center min-h-[120px] md:min-h-[200px] w-full break-words transition-all duration-300">
                                                                    {/* Desktop Asteroid (High Fidelity with Filters) */}
                                                                    <svg viewBox="0 0 100 100" className="hidden md:block absolute inset-0 w-full h-full z-0 drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] animate-[spin_60s_linear_infinite]" style={{ animationDirection: ent.id % 2 === 0 ? 'normal' : 'reverse' }}>
                                                                        <defs>
                                                                            <radialGradient id={`astGrad-${ent.id}`} cx="30%" cy="30%" r="70%">
                                                                                <stop offset="0%" stopColor="#475569" />
                                                                                <stop offset="100%" stopColor="#0f172a" />
                                                                            </radialGradient>
                                                                            <filter id={`craterInner-${ent.id}`}>
                                                                                <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.8" />
                                                                            </filter>
                                                                        </defs>
                                                                        <path d="M50 5 C75 8, 95 25, 95 50 C90 80, 75 95, 50 90 C20 95, 5 75, 10 45 C15 15, 30 5, 50 5 Z" fill={`url(#astGrad-${ent.id})`} />
                                                                        <circle cx="35" cy="35" r="8" fill="#1e293b" filter={`url(#craterInner-${ent.id})`} />
                                                                        <circle cx="65" cy="45" r="12" fill="#0f172a" filter={`url(#craterInner-${ent.id})`} />
                                                                        <circle cx="45" cy="70" r="10" fill="#1e293b" filter={`url(#craterInner-${ent.id})`} />
                                                                        <circle cx="75" cy="70" r="5" fill="#0f172a" filter={`url(#craterInner-${ent.id})`} />
                                                                        <circle cx="25" cy="65" r="6" fill="#0f172a" filter={`url(#craterInner-${ent.id})`} />
                                                                        <path d="M25 30 Q35 20 45 30" stroke="#64748b" strokeWidth="2" fill="none" opacity="0.4" />
                                                                        <path d="M70 25 Q80 35 70 45" stroke="#64748b" strokeWidth="2" fill="none" opacity="0.4" />
                                                                    </svg>

                                                                    {/* Mobile Asteroid (Optimized, No Inner Filters) */}
                                                                    <svg viewBox="0 0 100 100" className="md:hidden absolute inset-0 w-full h-full z-0 shadow-none">
                                                                        <defs>
                                                                            <radialGradient id={`astGradMobile-${ent.id}`} cx="30%" cy="30%" r="70%">
                                                                                <stop offset="0%" stopColor="#475569" />
                                                                                <stop offset="100%" stopColor="#0f172a" />
                                                                            </radialGradient>
                                                                        </defs>
                                                                        <path d="M50 5 C75 8, 95 25, 95 50 C90 80, 75 95, 50 90 C20 95, 5 75, 10 45 C15 15, 30 5, 50 5 Z" fill={`url(#astGradMobile-${ent.id})`} />
                                                                        <circle cx="35" cy="35" r="8" fill="#0f172a" />
                                                                        <circle cx="65" cy="45" r="12" fill="#020617" />
                                                                        <circle cx="45" cy="70" r="10" fill="#0f172a" />
                                                                        <circle cx="75" cy="70" r="5" fill="#020617" />
                                                                        <circle cx="25" cy="65" r="6" fill="#020617" />
                                                                        <path d="M25 30 Q35 20 45 30" stroke="#64748b" strokeWidth="2" fill="none" opacity="0.3" />
                                                                        <path d="M70 25 Q80 35 70 45" stroke="#64748b" strokeWidth="2" fill="none" opacity="0.3" />
                                                                    </svg>

                                                                    <span className="relative z-10 text-xs sm:text-sm md:text-xl font-black leading-tight md:leading-snug text-white md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-text px-4 py-2 text-center">
                                                                        {ent.text}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {ent.revealed && ent.isCorrect && (
                                                                <div className="relative w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
                                                                    <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="absolute inset-0 rounded-full bg-green-500/60" />
                                                                    <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="absolute inset-0 rounded-full border-4 border-white" />
                                                                    {/* Debris particles — desktop only */}
                                                                    {!isMobile && [...Array(6)].map((_, i) => (
                                                                        <motion.div key={i}
                                                                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                                                            animate={{ x: (Math.random() - 0.5) * 150, y: (Math.random() - 0.5) * 150, opacity: 0, scale: 0, rotate: Math.random() * 360 }}
                                                                            transition={{ duration: 0.7, ease: "easeOut" }}
                                                                            className="absolute w-4 h-4 bg-slate-400 rounded-sm"
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {ent.revealed && !ent.isCorrect && (
                                                                <div className="relative w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
                                                                    <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="absolute inset-0 rounded-full bg-red-600/60" />
                                                                    <motion.div initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="absolute inset-0 rounded-full border-4 border-yellow-400" />
                                                                    {/* Fire particles — desktop only */}
                                                                    {!isMobile && [...Array(8)].map((_, i) => (
                                                                        <motion.div key={i}
                                                                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                                                            animate={{ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200, opacity: 0, scale: 0, rotate: Math.random() * 360 }}
                                                                            transition={{ duration: 0.7, ease: "easeOut" }}
                                                                            className="absolute w-5 h-5 bg-orange-500 rounded-full"
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <AnimatePresence>
                                            {floatingTexts.map(ft => {
                                                let xPos = 50;
                                                if (ft.lane === 0) xPos = 16.66;
                                                if (ft.lane === 2) xPos = 83.33;
                                                return (
                                                    <motion.div key={ft.id}
                                                        initial={{ opacity: 1, y: '70%', scale: 0.5 }}
                                                        animate={{ opacity: 0, y: '10%', scale: 1.5 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                        className={`absolute flex justify-center text-2xl md:text-6xl font-black ${ft.color} z-50 text-center pointer-events-none`}
                                                        style={{ left: `${xPos}%`, transform: 'translateX(-50%)', width: '100%' }}>
                                                        {ft.text}
                                                    </motion.div>
                                                )
                                            })}
                                        </AnimatePresence>

                                        <div className="absolute bottom-20 md:bottom-12 w-1/3 flex justify-center z-[80] will-change-transform" style={{ left: 0, transform: `translate3d(${playerLane * 100}%, 0, 0)`, transition: 'transform 0.18s ease-out' }}>
                                            <div className={`w-28 h-28 md:w-48 md:h-48 relative flex items-center justify-center transition-opacity duration-200 ${stateRef.current.flashTimer > 0 ? 'opacity-30' : 'opacity-100'}`}>
                                                {/* CUSTOM NEON SHIP */}
                                                {isMobile ? (
                                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                                        {/* SHIP BODY - MOBILE SIMPLE */}
                                                        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full z-10">
                                                            <defs>
                                                                <linearGradient id="bodyBase" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="#1e293b" />
                                                                    <stop offset="100%" stopColor="#020617" />
                                                                </linearGradient>
                                                                <linearGradient id="accentCyan" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} />
                                                                    <stop offset="100%" stopColor="#0369a1" />
                                                                </linearGradient>
                                                                <linearGradient id="cockpitVisor" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="#cffafe" />
                                                                    <stop offset="40%" stopColor="#06b6d4" />
                                                                    <stop offset="100%" stopColor="#082f49" />
                                                                </linearGradient>
                                                                <filter id="neonCoreGlow" x="-50%" y="-50%" width="200%" height="200%">
                                                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                                                    <feMerge>
                                                                        <feMergeNode in="blur" />
                                                                        <feMergeNode in="blur" />
                                                                        <feMergeNode in="SourceGraphic" />
                                                                    </feMerge>
                                                                </filter>
                                                                <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                                                                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.7" />
                                                                </filter>
                                                            </defs>

                                                            {/* Left Engine Pod */}
                                                            <path d="M20 80 L30 40 L35 40 L40 80 L35 100 L25 100 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />
                                                            <path d="M25 70 L30 45 L32 45 L35 70 Z" fill="url(#accentCyan)" opacity="0.7" />

                                                            {/* Right Engine Pod */}
                                                            <path d="M100 80 L90 40 L85 40 L80 80 L85 100 L95 100 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />
                                                            <path d="M95 70 L90 45 L88 45 L85 70 Z" fill="url(#accentCyan)" opacity="0.7" />

                                                            {/* Main Wings */}
                                                            <path d="M15 85 L45 50 L60 40 L75 50 L105 85 L95 95 L75 75 L60 80 L45 75 L25 95 Z" fill="#0f172a" stroke={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} strokeWidth="1" strokeOpacity="0.4" filter="url(#dropShadow)" />

                                                            {/* Main Fuselage */}
                                                            <path d="M45 90 L60 5 L75 90 L65 105 L55 105 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />

                                                            {/* Fuselage Accents */}
                                                            <path d="M50 80 L60 15 L70 80 L60 90 Z" fill="#334155" />
                                                            <path d="M55 70 L60 25 L65 70 Z" fill="url(#accentCyan)" opacity="0.4" />

                                                            {/* Cockpit Canopy */}
                                                            <path d="M54 55 Q60 30 66 55 L64 65 Q60 70 56 65 Z" fill="url(#cockpitVisor)" />
                                                            <path d="M56 65 Q60 70 64 65 L62 60 L58 60 Z" fill="#22d3ee" opacity="0.5" filter="url(#neonCoreGlow)" />

                                                            {/* Center Energy Core */}
                                                            <circle cx="60" cy="75" r="5" fill="#fff" filter="url(#neonCoreGlow)" />
                                                            <circle cx="60" cy="75" r="2" fill="#cffafe" />

                                                            {/* Neon Trims */}
                                                            <path d="M45 90 L60 5 L75 90" fill="none" stroke={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} strokeWidth="2" strokeOpacity="0.9" filter="url(#neonCoreGlow)" />
                                                            <path d="M60 5 L60 25" fill="none" stroke="#fff" strokeWidth="1" opacity="0.9" />

                                                            {/* Wing Tip Glows */}
                                                            <line x1="15" y1="85" x2="25" y2="95" stroke={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} strokeWidth="2" filter="url(#neonCoreGlow)" />
                                                            <line x1="105" y1="85" x2="95" y2="95" stroke={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} strokeWidth="2" filter="url(#neonCoreGlow)" />
                                                        </svg>


                                                        {/* MOBILE: static engine glow — no blur animation */}
                                                        <div className="absolute bottom-[-8px] w-12 h-20 bg-gradient-to-t from-cyan-400/80 to-transparent rounded-full z-0" />
                                                    </div>
                                                ) : (
                                                    <motion.div
                                                        animate={{ y: [0, -4, 0], rotateX: [10, 25, 10] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                        className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center"
                                                    >
                                                        {/* SHIP BODY - DESKTOP */}
                                                        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full z-10 drop-shadow-[0_15px_25px_rgba(34,211,238,0.4)]">
                                                            <defs>
                                                                <linearGradient id="bodyBase" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="#1e293b" />
                                                                    <stop offset="100%" stopColor="#020617" />
                                                                </linearGradient>
                                                                <linearGradient id="accentCyan" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} />
                                                                    <stop offset="100%" stopColor="#0369a1" />
                                                                </linearGradient>
                                                                <linearGradient id="cockpitVisor" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                    <stop offset="0%" stopColor="#cffafe" />
                                                                    <stop offset="40%" stopColor="#06b6d4" />
                                                                    <stop offset="100%" stopColor="#082f49" />
                                                                </linearGradient>
                                                                <filter id="neonCoreGlow" x="-50%" y="-50%" width="200%" height="200%">
                                                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                                                    <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                                                </filter>
                                                                <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                                                                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.7" />
                                                                </filter>
                                                            </defs>
                                                            <path d="M20 80 L30 40 L35 40 L40 80 L35 100 L25 100 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />
                                                            <path d="M25 70 L30 45 L32 45 L35 70 Z" fill="url(#accentCyan)" opacity="0.7" />
                                                            <path d="M100 80 L90 40 L85 40 L80 80 L85 100 L95 100 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />
                                                            <path d="M95 70 L90 45 L88 45 L85 70 Z" fill="url(#accentCyan)" opacity="0.7" />
                                                            <path d="M15 85 L45 50 L60 40 L75 50 L105 85 L95 95 L75 75 L60 80 L45 75 L25 95 Z" fill="#0f172a" stroke={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} strokeWidth="1" strokeOpacity="0.4" filter="url(#dropShadow)" />
                                                            <path d="M45 90 L60 5 L75 90 L65 105 L55 105 Z" fill="url(#bodyBase)" filter="url(#dropShadow)" />
                                                            <path d="M50 80 L60 15 L70 80 L60 90 Z" fill="#334155" />
                                                            <path d="M55 70 L60 25 L65 70 Z" fill="url(#accentCyan)" opacity="0.4" />
                                                            <path d="M54 55 Q60 30 66 55 L64 65 Q60 70 56 65 Z" fill="url(#cockpitVisor)" />
                                                            <path d="M56 65 Q60 70 64 65 L62 60 L58 60 Z" fill="#22d3ee" opacity="0.5" filter="url(#neonCoreGlow)" />
                                                            <circle cx="60" cy="75" r="5" fill="#fff" filter="url(#neonCoreGlow)" />
                                                            <circle cx="60" cy="75" r="2" fill="#cffafe" />
                                                            <path d="M45 90 L60 5 L75 90" fill="none" stroke={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} strokeWidth="2" strokeOpacity="0.9" filter="url(#neonCoreGlow)" />
                                                            <path d="M60 5 L60 25" fill="none" stroke="#fff" strokeWidth="1" opacity="0.9" />
                                                            <line x1="15" y1="85" x2="25" y2="95" stroke={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} strokeWidth="2" filter="url(#neonCoreGlow)" />
                                                            <line x1="105" y1="85" x2="95" y2="95" stroke={PLANET_THEMES[currentPlanet % PLANET_THEMES.length].primary} strokeWidth="2" filter="url(#neonCoreGlow)" />
                                                        </svg>
                                                        {/* MAIN THRUSTER GLOW */}
                                                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7], y: [0, 4, 0] }} transition={{ duration: 0.08, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-10px] w-14 h-28 bg-gradient-to-t from-cyan-400 via-blue-500/50 to-transparent blur-xl rounded-full z-0" />
                                                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5], y: [0, 2, 0] }} transition={{ duration: 0.12, repeat: Infinity, ease: "linear", delay: 0.05 }} className="absolute bottom-2 left-4 w-6 h-16 bg-gradient-to-t from-cyan-300 via-blue-500/40 to-transparent blur-md rounded-full z-0" />
                                                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5], y: [0, 2, 0] }} transition={{ duration: 0.12, repeat: Infinity, ease: "linear", delay: 0.05 }} className="absolute bottom-2 right-4 w-6 h-16 bg-gradient-to-t from-cyan-300 via-blue-500/40 to-transparent blur-md rounded-full z-0" />
                                                        <motion.div animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, 15, 30] }} transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }} className="absolute bottom-0 w-1.5 h-6 bg-white blur-[1px] rounded-full z-0" />
                                                        <motion.div animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [0, 20, 35] }} transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }} className="absolute bottom-0 left-6 w-1 h-4 bg-white blur-[1px] rounded-full z-0" />
                                                        <motion.div animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [0, 20, 35] }} transition={{ duration: 0.4, repeat: Infinity, delay: 0.3 }} className="absolute bottom-0 right-6 w-1 h-4 bg-white blur-[1px] rounded-full z-0" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* DIRECTIONAL CONTROLS */}
                                    <div className="flex gap-4 md:gap-10 p-4 md:p-8 bg-transparent md:bg-gradient-to-t md:from-indigo-950/80 md:via-indigo-950/40 md:to-transparent z-[100] h-28 md:h-40 border-t border-white/10 relative justify-center items-end pb-6 md:pb-8">
                                        {/* Left Direction Button */}
                                        <button
                                            onPointerDown={() => movePlayer(-1)}
                                            className="relative flex-1 max-w-[300px] h-full max-h-[80px] bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full flex items-center justify-center active:scale-95 transition-all duration-200 group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                                                <ChevronLeft size={32} className="text-white drop-shadow-md group-hover:-translate-x-1 transition-transform" />
                                                <div className="hidden md:flex flex-col items-start text-left">
                                                    <span className="text-white/90 font-sans font-bold tracking-wider uppercase text-lg">Move Left</span>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Right Direction Button */}
                                        <button
                                            onPointerDown={() => movePlayer(1)}
                                            className="relative flex-1 max-w-[300px] h-full max-h-[80px] bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full flex items-center justify-center active:scale-95 transition-all duration-200 group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                                                <div className="hidden md:flex flex-col items-end text-right">
                                                    <span className="text-white/90 font-sans font-bold tracking-wider uppercase text-lg">Move Right</span>
                                                </div>
                                                <ChevronRight size={32} className="text-white drop-shadow-md group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ----- 4. RESULT SCREEN ----- */}
                            {gameState === "result" && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                                    className="text-center px-4 w-full max-w-5xl mx-auto relative z-20"
                                >
                                    <div className="mb-4 relative">
                                        <motion.h2
                                            animate={{
                                                opacity: [0.5, 1, 0.5],
                                                textShadow: ["0 0 10px rgba(168,85,247,0)", "0 0 20px rgba(168,85,247,0.5)", "0 0 10px rgba(168,85,247,0)"]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="text-white text-[10px] font-black uppercase tracking-[0.5em] mb-1"
                                        >
                                            Mission Accomplished
                                        </motion.h2>
                                        <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch perspective-1000">

                                        {/* LEFT: CANDIDATE INFO */}
                                        <motion.div
                                            initial={{ x: -30, opacity: 0, rotateY: -5 }}
                                            animate={{ x: 0, opacity: 1, rotateY: 0 }}
                                            transition={{ duration: 0.8, ease: smoothEase }}
                                            whileHover={{ scale: 1.01 }}
                                            className="md:col-span-7 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-6 md:p-8 text-left flex flex-col justify-between relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                                        >
                                            {/* DECORATIONS */}
                                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
                                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/20 blur-[60px] rounded-full pointer-events-none" />
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="flex items-center gap-6 mb-12">
                                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(168,85,247,0.2)] overflow-hidden">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                                                            <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] font-sans">Cadet Profile</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className="px-3 py-1 bg-green-500/20 border border-green-400/40 rounded-full flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                                                                <span className="text-green-300 text-[10px] font-black uppercase tracking-widest">Verified</span>
                                                            </div>
                                                            <div className="px-3 py-1 bg-purple-500/20 border border-purple-400/40 rounded-full">
                                                                <span className="text-purple-200 text-[10px] font-black uppercase tracking-widest italic">{formData.course}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Subject Name</h3>
                                                <p className="text-3xl md:text-5xl font-black text-white tracking-tighter truncate leading-tight drop-shadow-md">
                                                    {formData.name}
                                                </p>
                                            </div>

                                            <div className="mt-16 flex items-center justify-between border-t border-white/20 pt-10 relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex gap-1.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                animate={{ opacity: [0.2, 1, 0.2] }}
                                                                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                                                className="w-1.5 h-6 bg-purple-400/50 rounded-full"
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="font-sans text-[10px] text-white/60 font-bold uppercase tracking-widest leading-none">Record: ACTIVE</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-sans text-[9px] text-white/50 font-bold uppercase tracking-[0.2em]">Session ID</p>
                                                    <p className="font-sans text-[11px] text-white/80 font-bold tracking-wider">{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* RIGHT: STATS STACK */}
                                        <div className="md:col-span-5 flex flex-col gap-8">
                                            {/* DISCOUNT CARD */}
                                            <motion.div
                                                initial={{ x: 30, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.8, delay: 0.1 }}
                                                className="flex-1 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-6 text-left relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                                {/* ANIMATED GLOW BACKGROUND */}
                                                <motion.div
                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                                    transition={{ duration: 5, repeat: Infinity }}
                                                    className="absolute top-0 right-0 w-48 h-48 bg-yellow-400 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"
                                                />

                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                            <Zap size={14} className="fill-yellow-400" /> Scholarship Grant
                                                        </p>
                                                    </div>

                                                    <div className="flex items-baseline gap-2 mt-4">
                                                        <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 tracking-tighter drop-shadow-sm">
                                                            {discount}
                                                        </span>
                                                        <span className="text-3xl font-black text-yellow-500">%</span>
                                                    </div>
                                                    <p className="text-white/60 text-[9px] font-bold mt-2 uppercase tracking-[0.2em] border-l-2 border-yellow-500 pl-2">Grant Authorized</p>
                                                </div>
                                            </motion.div>

                                            {/* SOLVED CARD */}
                                            <motion.div
                                                initial={{ x: 30, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 0.8, delay: 0.2 }}
                                                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-6 text-left relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                                            >
                                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none" />

                                                <div className="relative z-10 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Solved</p>
                                                        <p className="text-3xl md:text-4xl font-black text-white tracking-tighter flex items-baseline gap-1 leading-none drop-shadow-sm">
                                                            {correctCount} <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">PTS</span>
                                                        </p>
                                                    </div>
                                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/20 group-hover:border-purple-400/50 transition-all duration-500 overflow-hidden relative shadow-inner">
                                                        <motion.div
                                                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="w-10 h-10 bg-purple-500/30 rounded-full blur-md"
                                                        />
                                                        <div className="w-3 h-3 bg-purple-400 rounded-full relative z-10 shadow-[0_0_15px_#c084fc]" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            ref={voucherRef}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                            className="md:col-span-12 bg-white/95 backdrop-blur-3xl rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white"
                                        >
                                            {/* LUXURY DECORATIONS */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-[40px] pointer-events-none" />

                                            {/* SIGNATURE TECH STRIPE */}
                                            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400" />

                                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                                <div className="text-left space-y-4">
                                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-900 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                                                        <ShieldAlert size={14} className="text-purple-600" /> SECURE VOUCHER
                                                        <div> <p className="text-3xl md:text-5xl font-black text-purple-600 tracking-tighter truncate leading-tight drop-shadow-md">
                                                            {formData.name}
                                                        </p>  </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none text-slate-900 drop-shadow-sm">
                                                            SCHOLARSHIP <br />
                                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 italic">GRANT</span> VOUCHER
                                                        </h3>
                                                    </div>
                                                    <div className="pt-4 border-t border-slate-200 max-w-xs">
                                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em] leading-tight">
                                                            Valid for institutional grant allocation.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                                                    <div
                                                        onClick={copyToClipboard}
                                                        className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 md:p-8 cursor-pointer group/code transition-all hover:border-purple-300 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] w-full md:min-w-[320px] relative text-center md:text-right shadow-sm"
                                                    >
                                                        <p className="text-[11px] font-black text-purple-600 uppercase tracking-[0.3em] mb-2">Access Key</p>
                                                        <div className="text-4xl md:text-6xl font-sans font-black tracking-tighter text-slate-900 leading-none break-all drop-shadow-sm">
                                                            {couponCode || "GTEC-SCORE-XXXX"}
                                                        </div>

                                                        <div className="mt-6 flex justify-center md:justify-end items-center gap-3">
                                                            <div className="w-16 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    animate={{ x: ["-100%", "100%"] }}
                                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                                    className="w-1/2 h-full bg-gradient-to-r from-purple-400 to-pink-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                                        <button
                                                            onClick={takeScreenshot}
                                                            disabled={takingScreenshot}
                                                            className="group/btn relative h-14 w-full sm:w-[150px] bg-white border-2 border-slate-200 text-slate-700 rounded-[1.2rem] font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden shadow-sm hover:border-purple-300 hover:text-purple-600 active:scale-95 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {takingScreenshot ? <Loader2 size={16} className="animate-spin text-purple-500" /> : <Camera size={16} className="text-purple-500 group-hover/btn:scale-110 transition-transform" />}
                                                            <span className="relative z-10">Capture</span>
                                                        </button>

                                                        <button
                                                            onClick={copyToClipboard}
                                                            className="group/btn relative h-14 w-full sm:w-[220px] bg-slate-900 text-white rounded-[1.2rem] font-black uppercase tracking-[0.3em] text-[11px] overflow-hidden shadow-xl active:scale-95 flex items-center justify-center gap-3 transition-all"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                                                            <span className="relative z-10 flex items-center gap-3">
                                                                {copied ? <><CheckCircle2 size={18} className="text-pink-300" /> COPIED</> : <><Copy size={18} /> COPY CODE</>}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="mt-6 flex flex-col items-center justify-center gap-6 relative z-10 pb-8">
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-3xl">
                                            {/* SYSTEM STATUS BAR */}
                                            <div className="hidden lg:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex-1 shadow-lg">
                                                <div className="flex gap-1.5">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ height: [8, 16, 8] }}
                                                            transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                                                            className="w-1.5 bg-purple-400/60 rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] flex-1 text-left">
                                                    Network Status: <span className="text-green-400 font-black ml-1">Optimal</span>
                                                </div>
                                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                                    GTEC_SYNC_v3
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <motion.button
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={submitForm}
                                                    disabled={isFetchingQs}
                                                    className="text-white/60 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 px-6 py-4 border border-white/10 rounded-full transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isFetchingQs ? (
                                                        <><Loader2 size={16} className="animate-spin" /> Calibrating...</>
                                                    ) : (
                                                        <><X size={16} /> Play Again</>
                                                    )}
                                                </motion.button>

                                                <motion.button
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    whileHover={{
                                                        scale: 1.05,
                                                        boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
                                                        backgroundColor: "#9333ea"
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleExit}
                                                    className="group bg-purple-600 text-white px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(147,51,234,0.3)] flex items-center gap-4 border border-purple-400/50"
                                                >
                                                    Exit Game
                                                    <motion.div
                                                        animate={{ x: [0, 4, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <ArrowRight size={18} />
                                                    </motion.div>
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* FOOTER HASH */}
                                        <div className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest opacity-50">
                                            Transaction_Hash: {Math.random().toString(36).substring(2, 15).toUpperCase()}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <style jsx="true">{`
        .nebula-glow-1 {
          animation: driftGlowOne 20s ease-in-out infinite;
        }
        .nebula-glow-2 {
          animation: driftGlowTwo 25s ease-in-out infinite;
        }
        @keyframes driftGlowOne {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.7; }
          50% { transform: translate(-45%, -55%) scale(1.2) rotate(180deg); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0.7; }
        }
        @keyframes driftGlowTwo {
          0% { transform: scale(1) translate(0, 0); opacity: 0.6; }
          50% { transform: scale(1.15) translate(-15px, -20px); opacity: 0.8; }
          100% { transform: scale(1) translate(0, 0); opacity: 0.6; }
        }
        @keyframes heartPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 3px rgba(239,68,68,0.5)); }
          100% { transform: scale(1.2); filter: drop-shadow(0 0 8px rgba(239,68,68,0.9)); }
        }
        @keyframes hudScan {
          0% { box-shadow: 0 0 40px rgba(34,211,238,0.25); }
          50% { box-shadow: 0 0 50px rgba(34,211,238,0.4); }
          100% { box-shadow: 0 0 40px rgba(34,211,238,0.25); }
        }
        .starfield-1 {
          background-image: 
            radial-gradient(1px 1px at 25px 45px, #fff, transparent),
            radial-gradient(1.5px 1.5px at 80px 120px, #fff, transparent),
            radial-gradient(1px 1px at 140px 180px, #fff, transparent),
            radial-gradient(1px 1px at 200px 30px, #fff, transparent),
            radial-gradient(1.5px 1.5px at 240px 220px, #fff, transparent),
            radial-gradient(1px 1px at 290px 100px, #fff, transparent);
          background-size: 300px 300px;
          animation: moveStarsSlow 25s linear infinite;
        }
        .starfield-2 {
          background-image: 
            radial-gradient(1.5px 1.5px at 40px 90px, #fff, transparent),
            radial-gradient(2px 2px at 110px 40px, rgba(34,211,238,0.8), transparent),
            radial-gradient(1.5px 1.5px at 170px 210px, #fff, transparent),
            radial-gradient(2px 2px at 220px 130px, rgba(147,51,234,0.6), transparent),
            radial-gradient(1.5px 1.5px at 280px 60px, #fff, transparent);
          background-size: 320px 320px;
          animation: moveStarsMedium 15s linear infinite;
        }
        .starfield-3 {
          background-image: 
            radial-gradient(2px 2px at 15px 150px, #fff, transparent),
            radial-gradient(2.5px 2.5px at 95px 85px, #fff, transparent),
            radial-gradient(2px 2px at 180px 20px, #fff, transparent),
            radial-gradient(3px 3px at 230px 260px, rgba(255,255,255,0.9), transparent);
          background-size: 280px 280px;
          animation: moveStarsFast 8s linear infinite;
        }
        @keyframes moveStarsSlow {
          from { background-position: 0 0; }
          to { background-position: 0 300px; }
        }
        @keyframes moveStarsMedium {
          from { background-position: 0 0; }
          to { background-position: 0 320px; }
        }
        @keyframes moveStarsFast {
          from { background-position: 0 0; }
          to { background-position: 0 280px; }
        }
        @keyframes slideDown {
          from { background-position: 0 0; }
          to { background-position: 0 120px; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .scanline-horizontal {
          background: linear-gradient(to bottom, transparent, rgba(34,211,238,0.2), transparent);
          background-size: 100% 4px;
          animation: scan-v 4s linear infinite;
        }
        .scanline-vertical {
          background: linear-gradient(to right, transparent, rgba(34,211,238,0.4), transparent);
          background-size: 4px 100%;
          animation: scan-h 8s linear infinite;
        }
        @keyframes scan-v {
          0% { background-position: 0 -100%; }
          100% { background-position: 0 100%; }
        }
        @keyframes scan-h {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
                </div>
            );
        }
