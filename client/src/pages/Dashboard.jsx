import { useEffect, useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogOut, BookOpen, AlertCircle, Quote, Trophy, Instagram, Save, X, Users, Lock, Copy, Check, Stethoscope, Flower2, Sparkles, MessageSquareHeart, CreditCard, FileText, Home as HomeIcon } from 'lucide-react'; 
import { useNavigate, Link } from 'react-router-dom';
// Note: Images/Videos are now used from the public folder directly

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
  const [buddyMsg, setBuddyMsg] = useState("");

  const buddyPhrases = [
    "Remember, your healing takes time. You're doing great!",
    "One journal entry at a time, you're growing stronger.",
    "Proud of you for checking in today! 🌱",
    "How are you really feeling? The garden is listening.",
    "Small steps lead to big blooms. Keep going!"
  ];

  useEffect(() => {
    setBuddyMsg(buddyPhrases[Math.floor(Math.random() * buddyPhrases.length)]);
  }, []);

  useEffect(() => {
    const fetchUserAndData = async () => {
      const localData = localStorage.getItem('user');
      setTodaysQuote(quotes[Math.floor(Math.random() * quotes.length)]);

      if (!localData) {
        // Guest User Setup
        const guestUser = { username: "Explorer", role: "user", isGuest: true };
        setUser(guestUser);
        setXp(0);
        setLevel(1);
        setProgress(0);
        return; 
      }
      
      const parsedUser = JSON.parse(localData);
      // Pehle local data set kar do
      setUser(parsedUser);
      setXp(parsedUser.xp || 0);
      setLevel(parsedUser.level || 1);
      setProgress(((parsedUser.xp || 0) % 50) / 50 * 100);

      try {
        // 2. Phir Background mein Live Data fetch karo (Role update check karne ke liye)
        const userId = parsedUser._id || parsedUser.id;
        const res = await api.get(`/auth/user/${userId}`);
        const freshUser = res.data;
        
        // State update karo fresh data se
        setUser(freshUser);
        setXp(freshUser.xp || 0);
        setLevel(freshUser.level || 1);
        setInstaId(freshUser.instagramId || "");
        setProgress(((freshUser.xp || 0) % 50) / 50 * 100);

        // LocalStorage ko bhi update kar do taaki agli baar fresh mile
        localStorage.setItem('user', JSON.stringify(freshUser));

      } catch (err) {
        console.error("Network Error: Using local data only.");
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
        await api.put('/auth/update-insta', { userId, instagramId: instaId });
        toast.success("Profile Updated! Ready to connect. 🤝");
        setShowSocialModal(false);
    } catch (error) { 
        toast.error("Update failed. Server issue."); 
    } finally { 
        setIsSavingSocial(false); 
    }
  };

  const handleFindFriend = async () => {
    if (user.isGuest) {
      toast.error("Please login to find a buddy! 🤝");
      navigate('/login');
      return;
    }

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
            const res = await api.get(`/auth/find-friend/${userId}`);
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
    <div className="min-h-screen text-white relative flex flex-col items-center font-sans overflow-y-auto pb-20 selection:bg-cyan-500/30">
      
      {/* Background Layer (Fixed at the very bottom) */}
      <div className="fixed inset-0 -z-30 overflow-hidden bg-[#020202]">
        {/* Cinematic Background Image with Breathe Animation */}
        <motion.img 
          src="/boat.jpg" 
          alt="Peaceful Boat" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          animate={{
            scale: [1.05, 1.15, 1.05],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Radial Glow for Depth */}
        <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Overlays for Contrast */}
      <div className="fixed inset-0 bg-black/40 -z-20"></div>
      <div className="fixed inset-0 backdrop-blur-[1px] -z-20"></div>

      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 w-full max-w-6xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-4 md:mt-0"
      >
        <div className="glass-premium px-5 py-2 rounded-full flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">🌱</div>
          <h1 className="text-sm font-bold tracking-tight">Hi, {user.username}</h1>
        </div>
        <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
            <Link to="/" className="flex items-center gap-2 glass-premium px-5 py-2 rounded-full hover:bg-white/10 transition-all text-white/70 hover:text-white flex-1 md:flex-none justify-center">
                <HomeIcon size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Home</span>
            </Link>
            {!user.isGuest ? (
              <>
                <button onClick={() => setShowSocialModal(true)} className="flex items-center justify-center w-10 h-10 glass-premium rounded-full hover:bg-pink-500/20 transition-all">
                    <Instagram size={18} className="text-white/70" />
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 glass-premium px-5 py-2 rounded-full hover:bg-red-500/20 transition-all text-white/70 hover:text-white flex-1 md:flex-none justify-center">
                    <LogOut size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 glass-premium px-6 py-2 rounded-full bg-green-500/10 hover:bg-green-500/20 transition-all border border-green-500/30 flex-1 md:flex-none justify-center">
                <span className="text-xs font-black uppercase tracking-widest text-green-400">Login</span>
              </Link>
            )}
        </div>
      </motion.div>

      {/* --- BENTO GRID START --- */}
      <div className="z-10 w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* 1. HERO CARD (Quote) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-2 lg:col-span-3 glass-premium p-6 md:p-10 rounded-[30px] md:rounded-[40px] relative overflow-hidden group min-h-[250px] md:min-h-[300px] flex flex-col justify-center"
        >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
            <Quote size={48} className="text-white/5 absolute top-6 left-6 md:top-8 md:left-8" />
            
            <h2 className="text-xl md:text-3xl lg:text-4xl font-serif italic leading-tight text-white/90 relative z-10 pr-6 md:pr-10">
                "{todaysQuote}"
            </h2>
            <div className="flex items-center gap-3 mt-6 md:mt-8 relative z-10">
                <div className="w-10 h-[1px] bg-white/20"></div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Daily Insight</p>
            </div>
        </motion.div>

        {/* 2. PROGRESS CARD */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-1 glass-premium glass-glow-green p-6 md:p-8 rounded-[30px] md:rounded-[40px] flex flex-col items-center justify-between text-center min-h-[250px] md:min-h-[300px]"
        >
            <div className="bg-yellow-500/10 p-4 md:p-5 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.2)] mb-4 md:mb-0">
                <Trophy size={28} className="text-yellow-400" />
            </div>
            
            <div className="mb-4 md:mb-0">
                <h3 className="text-lg md:text-xl font-bold">Level {level}</h3>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mt-1">
                    {level === 1 ? "Seedling" : "Rising Sapling"}
                </p>
            </div>

            <div className="w-full space-y-2 mb-4 md:mb-0">
                <div className="w-full h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${progress}%` }} 
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-600 shadow-[0_0_15px_#10b981]"
                    ></motion.div>
                </div>
                <div className="flex justify-between text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-tighter">
                    <span>{xp % 50} / 50 XP</span>
                    <span>To Level {level + 1}</span>
                </div>
            </div>

            <button 
                onClick={() => navigate('/mood-bloom')}
                className="w-full py-3 md:py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 group"
            >
                <Flower2 size={12} className="group-hover:rotate-45 transition" /> View Mood Bloom
            </button>
        </motion.div>

        {/* 3. QUICK ACTION TILES */}
        <div className="md:col-span-3 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            
            {/* Journal */}
            <motion.button 
                whileHover={{ y: -5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                onClick={() => {
                  if (user.isGuest) { toast.error("Please login to Journal! 📖"); navigate('/login'); }
                  else navigate('/journal');
                }}
                className="glass-premium p-6 rounded-[30px] flex flex-col gap-4 text-left transition-all group"
            >
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition"><BookOpen size={24}/></div>
                <div><span className="block font-bold text-sm">Journal</span><span className="text-[10px] text-white/40 uppercase font-black">{user.isGuest ? '🔒 Locked' : 'Reflect'}</span></div>
            </motion.button>

            {/* Panic */}
            <motion.button 
                whileHover={{ y: -5, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                onClick={() => {
                  if (user.isGuest) { toast.error("Please login for support! 🆘"); navigate('/login'); }
                  else navigate('/panic');
                }}
                className="glass-premium p-6 rounded-[30px] flex flex-col gap-4 text-left transition-all group border-red-500/20"
            >
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 group-hover:scale-110 transition"><AlertCircle size={24}/></div>
                <div><span className="block font-bold text-sm">Panic</span><span className="text-[10px] text-white/40 uppercase font-black">{user.isGuest ? '🔒 Locked' : 'Get Calm'}</span></div>
            </motion.button>

            {/* Connect / Friends */}
            <motion.button 
                whileHover={level >= 5 ? { y: -5, backgroundColor: 'rgba(236, 72, 153, 0.1)' } : {}}
                onClick={handleFindFriend}
                className={`glass-premium p-6 rounded-[30px] flex flex-col gap-4 text-left transition-all group ${level < 5 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition ${level < 5 ? 'bg-gray-800 text-gray-400' : 'bg-pink-500/10 text-pink-400'}`}>
                    {level < 5 ? <Lock size={24}/> : <Users size={24}/>}
                </div>
                <div><span className="block font-bold text-sm">{level < 5 ? 'Locked' : 'Connect'}</span><span className="text-[10px] text-white/40 uppercase font-black">{level < 5 ? 'Lvl 5 Req' : 'Find Buddy'}</span></div>
            </motion.button>

            {/* Therapist / Patients */}
            <motion.button 
                whileHover={{ y: -5, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                onClick={() => {
                  if (user.isGuest) { toast.error("Login to consult a doc! 🩺"); navigate('/login'); }
                  else navigate(user.role === 'doctor' ? '/my-patients' : '/find-doctor');
                }}
                className={`glass-premium p-6 rounded-[30px] flex flex-col gap-4 text-left transition-all group ${user.isGuest ? 'opacity-50' : ''}`}
            >
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                    {user.role === 'doctor' ? <Users size={24}/> : <Stethoscope size={24}/>}
                </div>
                <div><span className="block font-bold text-sm tracking-tighter">{user.role === 'doctor' ? 'Patients' : 'Therapist'}</span><span className="text-[10px] text-white/40 uppercase font-black">{user.isGuest ? '🔒 Locked' : 'Healing'}</span></div>
            </motion.button>

            {/* Medical Records */}
            <motion.button 
                whileHover={{ y: -5, backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
                onClick={() => navigate('/medical-history')}
                className="glass-premium p-6 rounded-[30px] flex flex-col gap-4 text-left transition-all group"
            >
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition"><FileText size={24}/></div>
                <div><span className="block font-bold text-sm">{user.role === 'doctor' ? 'Records' : 'History'}</span><span className="text-[10px] text-white/40 uppercase font-black">Logs</span></div>
            </motion.button>

            {/* Billing */}
            <motion.button 
                whileHover={{ y: -5, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                onClick={() => navigate('/payment-history')}
                className="glass-premium p-6 rounded-[30px] flex flex-col gap-4 text-left transition-all group"
            >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition"><CreditCard size={24}/></div>
                <div><span className="block font-bold text-sm">{user.role === 'doctor' ? 'Earnings' : 'Billing'}</span><span className="text-[10px] text-white/40 uppercase font-black">Payments</span></div>
            </motion.button>

        </div>

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

      {/* --- AI WELLNESS COMPANION (Bonsai Buddy) --- */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="absolute bottom-full right-0 mb-4 mr-2 w-64 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl scale-0 group-hover:scale-100 transition-all origin-bottom-right duration-300">
           <div className="flex items-center gap-2 mb-2 text-green-400">
              <Sparkles size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Bonsai Buddy</span>
           </div>
           <p className="text-xs text-gray-300 leading-relaxed font-serif">
              "{buddyMsg} You've gained {xp} XP so far!"
           </p>
           <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-black/80 border-r border-b border-white/10 rotate-45"></div>
        </div>
        
        <button className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all animate-bounce-slow text-white">
           <MessageSquareHeart size={28} />
        </button>
      </motion.div>

    </div>
  );
};

export default Dashboard;