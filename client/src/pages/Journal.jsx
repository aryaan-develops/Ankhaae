import { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast'; // <--- 1. Import Toast
import { Save, ArrowLeft, History, Trophy, AlertTriangle, Smile, Meh, CloudRain, Frown, Flame, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import desktopBg from '../assets/dashboard.jpg'; 
import mobileBg from '../assets/signup8.png';

const Journal = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState('Neutral');
  const [content, setContent] = useState('');
  
  // Naye States
  const [dailyWin, setDailyWin] = useState('');
  const [dailyChallenge, setDailyChallenge] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) navigate('/login');
    else setUser(JSON.parse(userData));
  }, [navigate]);

  const moodOptions = [
    { label: 'Happy', icon: <Smile size={24} />, color: 'bg-green-500/20 text-green-400 border-green-500/50' },
    { label: 'Neutral', icon: <Meh size={24} />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
    { label: 'Anxious', icon: <CloudRain size={24} />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
    { label: 'Depressed', icon: <Frown size={24} />, color: 'bg-gray-600/20 text-gray-400 border-gray-500/50' },
    { label: 'Angry', icon: <Flame size={24} />, color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' },
    { label: 'Panic', icon: <AlertOctagon size={24} />, color: 'bg-red-500/20 text-red-400 border-red-500/50' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation Toast
    if (!content.trim()) return toast.error("Kuch toh likho! 📝");

    setIsSubmitting(true);
    try {
      await api.post('/journal/create', {
        userId: user._id || user.id,
        mood,
        content,
        dailyWin,
        dailyChallenge
      });
      
      // Success Toast
      toast.success('Journal Saved! Aapka mann halka hua. 🌱');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Error Toast
      toast.error('Failed to save. Shayad server band hai.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative flex flex-col items-center font-sans overflow-y-auto pb-10">
      
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-20">
        <img className="hidden md:block w-full h-full object-cover" src={desktopBg} alt="BG" />
        <img className="block md:hidden w-full h-full object-cover" src={mobileBg} alt="BG" />
      </div>
      <div className="fixed top-0 left-0 w-full h-full bg-black/70 -z-10"></div>

      {/* Header */}
      <div className="w-full max-w-3xl p-6 flex items-center justify-between z-10">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif tracking-wide">Daily Check-in</h1>
        
        {/* --- HISTORY BUTTON --- */}
        <button 
            onClick={() => navigate('/journal-history')} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/40 border border-blue-500/30 transition text-sm"
        >
          <History size={18} /> History
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl px-6 flex flex-col gap-6 z-10">
        
        {/* 1. Mood */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
          <label className="text-gray-400 text-sm mb-4 block">Mood right now?</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {moodOptions.map((opt) => (
              <button key={opt.label} onClick={() => setMood(opt.label)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${mood === opt.label ? `${opt.color} scale-105 shadow-lg` : 'bg-white/5 border-transparent opacity-60 hover:opacity-100'}`}>
                {opt.icon} <span className="text-xs mt-2">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Win & Challenge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Win Input */}
            <div className="bg-green-900/10 backdrop-blur-xl p-4 rounded-2xl border border-green-500/20">
                <div className="flex items-center gap-2 mb-2 text-green-400">
                    <Trophy size={18} /> <span className="text-sm font-medium">Daily Win</span>
                </div>
                <input 
                    type="text" 
                    value={dailyWin}
                    onChange={(e) => setDailyWin(e.target.value)}
                    placeholder="Ek choti si jeet..." 
                    className="w-full bg-transparent border-none focus:outline-none text-white placeholder-green-500/30"
                />
            </div>

            {/* Challenge Input */}
            <div className="bg-orange-900/10 backdrop-blur-xl p-4 rounded-2xl border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2 text-orange-400">
                    <AlertTriangle size={18} /> <span className="text-sm font-medium">Daily Challenge/Lesson</span>
                </div>
                <input 
                    type="text" 
                    value={dailyChallenge}
                    onChange={(e) => setDailyChallenge(e.target.value)}
                    placeholder="Aaj kya seekha ya kya galat hua?" 
                    className="w-full bg-transparent border-none focus:outline-none text-white placeholder-orange-500/30"
                />
            </div>
        </div>

        {/* 3. Main Content */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your heart out..."
            className="w-full h-48 bg-transparent text-lg text-white/90 placeholder-white/30 focus:outline-none resize-none font-serif"
          ></textarea>
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-700 p-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:shadow-green-500/30 transition-all disabled:opacity-50">
          {isSubmitting ? 'Saving...' : <><Save size={20} /> Save Entry</>}
        </motion.button>

      </motion.div>
    </div>
  );
};

export default Journal;