import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogOut, BookOpen, AlertCircle, Quote, Trophy, Instagram, Save, X, Users, Lock, Copy, Check, Stethoscope } from 'lucide-react'; // <--- Stethoscope add kiya
import { useNavigate } from 'react-router-dom';
import desktopBg from '../assets/dashboard.jpg'; 
import mobileBg from '../assets/signup8.png';

const quotes = [
  "You don’t have to control your thoughts. You just have to stop letting them control you.",
  "Healing doesn't mean the damage never existed. It means the damage no longer controls your life.",
  "Almost everything will work again if you unplug it for a few minutes, including you.",
  "Your present circumstances don't determine where you can go; they merely determine where you start."
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [todaysQuote, setTodaysQuote] = useState("");
  
  // Social States
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false); 
  const [instaId, setInstaId] = useState("");
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  
  // Matching States
  const [matchedUser, setMatchedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Gamification States
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchUserAndData = async () => {
      const localData = localStorage.getItem('user');
      if (!localData) {
        navigate('/login'); return;
      }
      
      const parsedUser = JSON.parse(localData);
      setTodaysQuote(quotes[Math.floor(Math.random() * quotes.length)]);

      try {
        const userId = parsedUser._id || parsedUser.id;
        const res = await axios.get(`https://ankahee-api.onrender.com/api/auth/user/${userId}`);
        const freshUser = res.data;
        setUser(freshUser);
        setXp(freshUser.xp || 0);
        setLevel(freshUser.level || 1);
        setInstaId(freshUser.instagramId || "");
        setProgress(((freshUser.xp || 0) % 50) / 50 * 100);
      } catch (err) {
        setUser(parsedUser);
      }
    };
    fetchUserAndData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSaveInsta = async () => {
    setIsSavingSocial(true);
    try {
        const userId = user._id || user.id;
        await axios.put('https://ankahee-api.onrender.com/api/auth/update-insta', { userId, instagramId: instaId });
        toast.success("Profile Updated! Ready to connect. 🤝");
        setShowSocialModal(false);
    } catch (error) { 
        toast.error("Update failed. Server issue."); 
    } finally { 
        setIsSavingSocial(false); 
    }
  };

  const handleFindFriend = async () => {
    if (level < 5) {
        toast.error(`🔒 Locked! Level 5 required.\nKeep journaling to unlock! 🚀`, {
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
            duration: 4000
        });
        return; 
    }

    setShowMatchModal(true);
    setIsSearching(true);
    setMatchedUser(null);

    setTimeout(async () => {
        try {
            const userId = user._id || user.id;
            const res = await axios.get(`https://ankahee-api.onrender.com/api/auth/find-friend/${userId}`);
            setMatchedUser(res.data);
        } catch (error) {
            console.error(error);
            setMatchedUser({ error: "No friends found right now. Be the first one!" });
        } finally {
            setIsSearching(false);
        }
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("ID Copied!"); 
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen text-white relative flex flex-col items-center font-sans overflow-y-auto">
      
      <div className="fixed top-0 left-0 w-full h-full -z-20">
        <img className="hidden md:block w-full h-full object-cover bg-breathe-animate" src={desktopBg} alt="Desktop Background" />
        <img className="block md:hidden w-full h-full object-cover bg-breathe-animate" src={mobileBg} alt="Mobile Background" />
      </div>
      <div className="fixed top-0 left-0 w-full h-full bg-black/60 -z-10"></div>

      {/* Header */}
      <div className="z-10 w-full max-w-4xl p-6 flex justify-between items-center mt-4 shrink-0">
        <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">🌱</div>
          <h1 className="text-lg font-medium">Hi, {user.username}</h1>
        </div>
        <div className="flex gap-3">
            <button onClick={() => setShowSocialModal(true)} className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-pink-400 bg-black/30 backdrop-blur-md rounded-full border border-white/10 transition-all hover:bg-pink-500/20">
                <Instagram size={18} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-white/70 hover:text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-red-500/20">
                <LogOut size={18} /> <span className="hidden sm:inline text-sm">Logout</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center relative z-10 w-full px-4 py-6 md:py-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col md:grid md:grid-cols-3 gap-8">
            
            <div className="md:col-span-2 flex flex-col justify-center text-center md:text-left order-1">
                <div className="flex justify-center md:justify-start"><Quote size={32} className="text-white/40 mb-4" /></div>
                <h2 className="text-xl md:text-3xl font-serif italic leading-relaxed text-white/90">"{todaysQuote}"</h2>
                <p className="text-sm text-white/50 mt-4">— Daily Insight</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/10 order-2 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${level > 1 ? 'from-purple-500 to-blue-500' : 'from-green-500 to-emerald-500'}`}></div>
                <div className="relative z-10 flex flex-col items-center w-full">
                    <div className="bg-yellow-500/20 p-4 rounded-full mb-3 shadow-[0_0_15px_rgba(234,179,8,0.3)]"><Trophy size={28} className="text-yellow-300" /></div>
                    <h3 className="text-lg font-semibold">Level {level}</h3>
                    <p className="text-green-300 font-medium text-sm mb-3">{level === 1 ? "The Seedling 🌱" : "The Sapling 🌿"}</p>
                    <div className="w-full h-3 bg-gray-700/50 rounded-full mt-2 overflow-hidden border border-white/5 relative">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-green-400 to-emerald-600 shadow-[0_0_10px_#4ade80]"></motion.div>
                    </div>
                    <div className="flex justify-between w-full text-xs text-gray-400 mt-2"><span>{xp % 50} / 50 XP</span><span>Next Lvl</span></div>
                </div>
            </div>
        </motion.div>
      </div>

      {/* --- ACTION BUTTONS (Updated Grid for 4 Buttons) --- */}
      <div className="z-10 w-full max-w-4xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 shrink-0">
        
        {/* 1. Journal */}
        <motion.button onClick={() => navigate('/journal')} whileHover={{ scale: 1.03, backgroundColor: "rgba(59, 130, 246, 0.2)" }} whileTap={{ scale: 0.98 }}
          className="flex items-center p-4 bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl transition-all group cursor-pointer gap-4 justify-center sm:justify-start">
          <div className="bg-blue-500/20 p-3 rounded-full group-hover:bg-blue-500/30 transition-colors"><BookOpen size={24} className="text-blue-300" /></div>
          <div className="text-left"><span className="font-medium text-lg block">Journal</span><span className="text-xs text-gray-400">Write it out</span></div>
        </motion.button>

        {/* 2. FIND FRIEND */}
        <motion.button 
          onClick={handleFindFriend} 
          whileHover={level >= 5 ? { scale: 1.03, backgroundColor: "rgba(236, 72, 153, 0.2)" } : {}} 
          whileTap={level >= 5 ? { scale: 0.98 } : {}}
          className={`flex items-center p-4 backdrop-blur-lg border rounded-2xl transition-all group cursor-pointer gap-4 justify-center sm:justify-start ${
            level < 5 
              ? "bg-gray-800/40 border-gray-700 opacity-70 cursor-not-allowed" 
              : "bg-black/40 border-white/10"
          }`}
        >
          <div className={`p-3 rounded-full transition-colors ${
            level < 5 
              ? "bg-gray-700 text-gray-500" 
              : "bg-pink-500/20 group-hover:bg-pink-500/30" 
          }`}>
             {level < 5 ? <Lock size={24} /> : <Users size={24} className="text-pink-300" />}
          </div>
          <div className="text-left">
            <span className={`font-medium text-lg block ${level < 5 ? "text-gray-400" : "text-white"}`}>
                {level < 5 ? "Locked" : "Connect"}
            </span>
            <span className="text-xs text-gray-500">
                {level < 5 ? "Unlock at Lvl 5" : "Find a buddy"}
            </span>
          </div>
        </motion.button>

        {/* 3. Panic */}
        <motion.button onClick={() => navigate('/panic')} whileHover={{ scale: 1.03, backgroundColor: "rgba(239, 68, 68, 0.2)" }} whileTap={{ scale: 0.98 }}
          className="flex items-center p-4 bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl transition-all group cursor-pointer gap-4 justify-center sm:justify-start">
           <div className="bg-red-500/20 p-3 rounded-full group-hover:bg-red-500/30 transition-colors"><AlertCircle size={24} className="text-red-300" /></div>
          <div className="text-left"><span className="font-medium text-lg text-red-100 block">Panic</span><span className="text-xs text-gray-400">Get Calm</span></div>
        </motion.button>

        {/* 4. THERAPIST (NEW BUTTON) */}
        <motion.button onClick={() => navigate('/find-doctor')} whileHover={{ scale: 1.03, backgroundColor: "rgba(6, 182, 212, 0.2)" }} whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl transition-all group cursor-pointer gap-4 justify-center sm:justify-start">
            <div className="bg-cyan-500/20 p-3 rounded-full group-hover:bg-cyan-500/30 transition-colors"><Stethoscope size={24} className="text-cyan-300" /></div>
            <div className="text-left"><span className="font-medium text-lg block text-white">Therapist</span><span className="text-xs text-gray-400">Get Help</span></div>
        </motion.button>

      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        
        {showSocialModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-sm w-full relative shadow-2xl">
              <button onClick={() => setShowSocialModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
              <div className="flex flex-col items-center text-center mb-6">
                 <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center mb-4"><Instagram size={32} className="text-white" /></div>
                 <h2 className="text-xl font-bold text-white">Your Social ID</h2>
                 <p className="text-xs text-gray-400 mt-2">Enter your Instagram ID to be discoverable.</p>
              </div>
              <div className="space-y-4">
                  <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-3 py-3 mt-1 focus-within:border-purple-500 transition-colors">
                      <span className="text-gray-500 mr-2">@</span>
                      <input type="text" value={instaId} onChange={(e) => setInstaId(e.target.value)} placeholder="username" className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"/>
                  </div>
                  <button onClick={handleSaveInsta} disabled={isSavingSocial} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                     {isSavingSocial ? 'Saving...' : <><Save size={18}/> Save Profile</>}
                  </button>
              </div>
            </motion.div>
          </div>
        )}

        {showMatchModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} 
                    className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full relative shadow-2xl text-center overflow-hidden">
                    <button onClick={() => setShowMatchModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
                    
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>

                    {isSearching ? (
                        <div className="py-10 flex flex-col items-center">
                             <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mb-6"></motion.div>
                             <h2 className="text-xl font-bold text-white">Searching...</h2>
                             <p className="text-gray-400 text-sm mt-2">Finding a healing buddy for you.</p>
                        </div>
                    ) : matchedUser && !matchedUser.error ? (
                        <div className="py-4 flex flex-col items-center relative z-10">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                                <span className="text-3xl">👋</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-1">{matchedUser.username}</h2>
                            <p className="text-purple-300 text-xs uppercase tracking-widest mb-6">Level {matchedUser.level || 1} • Stranger</p>
                            
                            <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between group cursor-pointer" onClick={() => copyToClipboard(matchedUser.instagramId)}>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500">Instagram ID</p>
                                    <p className="text-lg font-mono text-white">@{matchedUser.instagramId}</p>
                                </div>
                                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition">
                                    {copied ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="text-gray-400"/>}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">{copied ? "Copied to clipboard!" : "Click to copy ID"}</p>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><Users size={32} className="text-gray-500"/></div>
                            <h2 className="text-lg font-bold text-white">No matches found</h2>
                            <p className="text-gray-400 text-sm mt-2">Looks like everyone is offline or sleeping.</p>
                            <button onClick={handleFindFriend} className="mt-6 text-purple-400 hover:text-purple-300 text-sm font-medium">Try Again</button>
                        </div>
                    )}
                </motion.div>
            </div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default Dashboard;