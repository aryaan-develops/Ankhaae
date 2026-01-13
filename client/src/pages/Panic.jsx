import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, Eye, X, BrainCircuit, Check, Smile, CloudRain, Trees, Waves, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Panic = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('Inhale'); 
  
  // --- POPUP STATES ---
  const [showGrounding, setShowGrounding] = useState(false);
  const [showHelpline, setShowHelpline] = useState(false);
  const [showSolver, setShowSolver] = useState(false);

  // --- SOLVER LOGIC STATES ---
  const [solverStep, setSolverStep] = useState(1);
  const [problemText, setProblemText] = useState("");
  const [hasSolution, setHasSolution] = useState(null);

  // --- MUSIC STATES ---
  const audioRef = useRef(new Audio());
  const [activeSound, setActiveSound] = useState(null); // 'rain', 'forest', 'waves'

  // Sound Links (Mixkit Free Assets)
  const sounds = {
    rain: "rain.mp3",
    forest: "forest.mp3",
    waves: "waves.mp3"
  };

  // --- BREATHING LOGIC ---
  useEffect(() => {
    const cycle = async () => {
      setPhase('Inhale'); await new Promise(r => setTimeout(r, 4000));
      setPhase('Hold'); await new Promise(r => setTimeout(r, 4000));
      setPhase('Exhale'); await new Promise(r => setTimeout(r, 4000));
      setPhase('Hold'); await new Promise(r => setTimeout(r, 4000));
      cycle();
    };
    cycle();

    // Cleanup: Page chodne par music band karo
    return () => {
        audioRef.current.pause();
        audioRef.current.src = "";
    };
  }, []);

  // --- MUSIC FUNCTION ---
  const toggleSound = (soundKey) => {
    if (activeSound === soundKey) {
        // Stop if clicking same icon
        audioRef.current.pause();
        setActiveSound(null);
    } else {
        // Play new sound
        audioRef.current.src = sounds[soundKey];
        audioRef.current.loop = true; // Loop chalega
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        setActiveSound(soundKey);
    }
  };

  const openSolver = () => {
    setSolverStep(1); setProblemText(""); setHasSolution(null); setShowSolver(true);
  };

  return (
    <div className="min-h-screen text-white relative flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black z-0"></div>

      {/* Back Button */}
      <button onClick={() => navigate('/dashboard')} className="absolute top-6 left-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition z-20">
        <ArrowLeft size={24} />
      </button>

      {/* --- BREATHING CIRCLE --- */}
      <div className={`relative z-10 flex flex-col items-center justify-center mb-8 transition-all duration-500 ${showGrounding || showHelpline || showSolver ? 'blur-sm opacity-50' : ''}`}>
        <motion.div animate={{ scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : 1.5, opacity: phase === 'Hold' ? 0.8 : 1 }} transition={{ duration: 4, ease: "easeInOut" }} className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 blur-2xl absolute"></motion.div>
        <motion.div animate={{ scale: phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : 1.2 }} transition={{ duration: 4, ease: "easeInOut" }} className="w-48 h-48 rounded-full border-4 border-blue-300/30 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)] bg-black/20 backdrop-blur-md relative z-20">
          <motion.span key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-serif font-bold text-blue-100 tracking-wider">{phase}</motion.span>
        </motion.div>
      </div>

      {/* --- SOUNDSCAPES (NEW MUSIC PLAYER) --- */}
      <div className={`z-10 flex gap-4 mb-10 transition-all duration-500 ${showGrounding || showHelpline || showSolver ? 'blur-sm opacity-50' : ''}`}>
          
          {/* Rain Button */}
          <button 
            onClick={() => toggleSound('rain')}
            className={`p-4 rounded-full transition-all border ${activeSound === 'rain' ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_#3b82f6]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
          >
            <CloudRain size={24} />
          </button>

          {/* Forest Button */}
          <button 
            onClick={() => toggleSound('forest')}
            className={`p-4 rounded-full transition-all border ${activeSound === 'forest' ? 'bg-green-600 text-white border-green-400 shadow-[0_0_15px_#16a34a]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
          >
            <Trees size={24} />
          </button>

          {/* Waves Button */}
          <button 
            onClick={() => toggleSound('waves')}
            className={`p-4 rounded-full transition-all border ${activeSound === 'waves' ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_#0891b2]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
          >
            <Waves size={24} />
          </button>

          {/* Status Indicator */}
          {activeSound && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-blue-300 flex items-center gap-1 animate-pulse">
                  <Volume2 size={12}/> Playing {activeSound}...
              </div>
          )}
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className={`z-10 w-full max-w-lg px-6 grid grid-cols-3 gap-3 transition-all duration-500 ${showGrounding || showHelpline || showSolver ? 'blur-sm opacity-50' : ''}`}>
        <button onClick={() => setShowGrounding(true)} className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group backdrop-blur-md">
          <Eye size={24} className="mb-2 text-emerald-400 group-hover:scale-110 transition" />
          <span className="text-xs font-medium text-center">Grounding</span>
        </button>
        <button onClick={openSolver} className="flex flex-col items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl hover:bg-purple-500/20 transition group backdrop-blur-md">
          <BrainCircuit size={24} className="mb-2 text-purple-400 group-hover:scale-110 transition" />
          <span className="text-xs font-medium text-center text-purple-200">Solve Problem</span>
        </button>
        <button onClick={() => setShowHelpline(true)} className="flex flex-col items-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition group backdrop-blur-md">
          <Phone size={24} className="mb-2 text-red-400 group-hover:scale-110 transition" />
          <span className="text-xs font-medium text-center text-red-200">Helpline</span>
        </button>
      </div>

      {/* --- MODALS (Logic/Grounding/Helpline) --- */}
      <AnimatePresence>
        
        {/* Logic Solver */}
        {showSolver && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-sm w-full relative shadow-2xl text-center">
                <button onClick={() => setShowSolver(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
                {solverStep === 1 && (<><h2 className="text-xl font-bold mb-4 text-purple-300">What's bothering you?</h2><textarea value={problemText} onChange={(e) => setProblemText(e.target.value)} placeholder="Write your problem here..." className="w-full bg-black/30 text-white p-3 rounded-xl border border-white/10 h-32 mb-4"></textarea><button onClick={() => { if(problemText) setSolverStep(2) }} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold disabled:opacity-50" disabled={!problemText}>Next</button></>)}
                {solverStep === 2 && (<><h2 className="text-xl font-bold mb-2 text-white">Can you do something about it?</h2><div className="grid grid-cols-2 gap-4 mt-6"><button onClick={() => { setHasSolution(true); setSolverStep(3); }} className="bg-green-500/20 text-green-300 py-4 rounded-xl border border-green-500/30">YES</button><button onClick={() => { setHasSolution(false); setSolverStep(3); }} className="bg-red-500/20 text-red-300 py-4 rounded-xl border border-red-500/30">NO</button></div></>)}
                {solverStep === 3 && hasSolution === true && (<><div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-green-400"/></div><h2 className="text-xl font-bold mb-2 text-green-300">Great! Write the steps.</h2><textarea placeholder="Step 1: ..." className="w-full bg-black/30 text-white p-3 rounded-xl border border-white/10 h-24 mb-4"></textarea><button onClick={() => setShowSolver(false)} className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold">I will do this!</button></>)}
                {solverStep === 3 && hasSolution === false && (<><div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Smile size={32} className="text-blue-400"/></div><h2 className="text-2xl font-bold mb-2 text-blue-300">Then why worry?</h2><p className="text-gray-300 mb-6">"If you can't control it, letting it go is the only way to be free."</p><button onClick={() => setShowSolver(false)} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold">Let it go 🍃</button></>)}
             </motion.div>
           </div>
        )}

        {/* Grounding Modal */}
        {showGrounding && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-sm w-full relative">
                    <button onClick={() => setShowGrounding(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
                    <h2 className="text-xl font-bold mb-4 text-emerald-400">Grounding 5-4-3-2-1</h2>
                    <ul className="space-y-3 text-gray-300 text-sm"><li><b className="text-white">5</b> Things you see</li><li><b className="text-white">4</b> Things you touch</li><li><b className="text-white">3</b> Things you hear</li><li><b className="text-white">2</b> Things you smell</li><li><b className="text-white">1</b> Thing you taste</li></ul>
                 </motion.div>
             </div>
        )}

        {/* Helpline Modal */}
        {showHelpline && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-sm w-full relative">
                    <button onClick={() => setShowHelpline(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
                    <h2 className="text-xl font-bold mb-4 text-red-400">Emergency</h2>
                    <div className="space-y-3"><a href="tel:18005990019" className="block p-3 bg-white/5 rounded-xl text-center hover:bg-white/10">Kiran Helpline: 1800-599-0019</a><a href="tel:112" className="block p-3 bg-red-500/20 rounded-xl text-center text-red-300 hover:bg-red-500/30">Emergency: 112</a></div>
                 </motion.div>
             </div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Panic;