import { useEffect, useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Flower2, TrendingUp, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MoodBloom = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moodCounts, setMoodCounts] = useState({});
  const [dominantMood, setDominantMood] = useState('Neutral');

  useEffect(() => {
    const fetchMoodData = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) return navigate('/login');
      
      const user = JSON.parse(userData);
      try {
        const userId = user._id || user.id;
        const res = await api.get(`/journal/user/${userId}`);
        const data = res.data;
        setJournals(data);

        // Calculate Mood Counts
        const counts = data.reduce((acc, curr) => {
          acc[curr.mood] = (acc[curr.mood] || 0) + 1;
          return acc;
        }, {});
        setMoodCounts(counts);

        // Determine Dominant Mood
        const sortedMoods = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        if (sortedMoods.length > 0) {
          setDominantMood(sortedMoods[0][0]);
        }
      } catch (err) {
        console.error("Failed to fetch mood data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoodData();
  }, [navigate]);

  const moodConfig = {
    Happy: { color: 'from-yellow-400 to-orange-500', icon: '🌻', shadow: 'shadow-yellow-500/50', msg: 'Your inner garden is basking in sunlight.' },
    Neutral: { color: 'from-blue-400 to-cyan-500', icon: '🌿', shadow: 'shadow-cyan-500/50', msg: 'You are in a state of peaceful balance.' },
    Anxious: { color: 'from-purple-400 to-indigo-500', icon: '🎐', shadow: 'shadow-indigo-500/50', msg: 'A gentle breeze is passing through. Stay grounded.' },
    Depressed: { color: 'from-gray-500 to-slate-700', icon: '🌫️', shadow: 'shadow-slate-500/50', msg: 'The clouds are heavy, but they will pass. Be kind to yourself.' },
    Angry: { color: 'from-red-500 to-orange-700', icon: '🔥', shadow: 'shadow-red-500/50', msg: 'Transform this heat into energy for growth.' },
    Panic: { color: 'from-rose-600 to-pink-800', icon: '⛈️', shadow: 'shadow-rose-500/50', msg: 'Take deep breaths. You are safe here.' },
  };

  const currentConfig = moodConfig[dominantMood] || moodConfig['Neutral'];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden font-sans">
      
      {/* Background Video/Image from Public Folder */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-black">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20 scale-105 blur-[2px]">
          <source src="/dashboard_bg1.mp4" type="video/mp4" />
        </video>
        <img src="/signup6.png" className="absolute top-0 left-0 w-full h-full object-cover opacity-20 mix-blend-screen" alt="" />
      </div>

      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition backdrop-blur-md">
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 text-transparent bg-clip-text">Mood & Bloom</h1>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1">Emotional Bloom Analytics</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
            <TrendingUp size={20} className="text-gray-400" />
          </div>
        </div>

        {loading ? (
             <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">Analyzing your energy...</p>
             </div>
        ) : journals.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl mb-6">
                    <Flower2 size={48} className="text-gray-700 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-300">No Seeds Planted Yet</h2>
                    <p className="text-gray-500 max-w-xs mt-2">Start journaling to see your emotional garden bloom.</p>
                </div>
                <button onClick={() => navigate('/journal')} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition">Start Journaling</button>
            </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Dominant Mood Visualizer */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]"
            >
               {/* Ambient Glow */}
               <div className={`absolute inset-0 bg-gradient-to-b opacity-20 ${currentConfig.color}`}></div>
               
               {/* The Flower/Icon */}
               <motion.div 
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className={`text-[120px] z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]`}
               >
                  {currentConfig.icon}
               </motion.div>

               <div className="z-10 text-center mt-8">
                  <h2 className="text-5xl font-serif font-bold mb-2">{dominantMood}</h2>
                  <p className="text-gray-400 max-w-md italic">{currentConfig.msg}</p>
               </div>

               {/* Stats at bottom */}
               <div className="mt-12 flex gap-4 z-10">
                  <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-sm">
                    <span className="text-gray-500">Total Entries:</span> <span className="font-bold ml-2">{journals.length}</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-sm">
                    <span className="text-gray-500">Bloom Rate:</span> <span className="font-bold ml-2 text-green-400">Stable</span>
                  </div>
               </div>
            </motion.div>

            {/* Right: Breakdown & Insights */}
            <div className="space-y-6">
                
                {/* Mood Breakdown */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white/5 border border-white/10 rounded-[30px] p-6"
                >
                   <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                     <TrendingUp size={16} /> Mood Distribution
                   </h3>
                   <div className="space-y-4">
                      {Object.entries(moodCounts).map(([mood, count]) => (
                        <div key={mood} className="space-y-2">
                           <div className="flex justify-between text-xs font-medium">
                              <span className="flex items-center gap-2">
                                {moodConfig[mood]?.icon} {mood}
                              </span>
                              <span>{Math.round((count / journals.length) * 100)}%</span>
                           </div>
                           <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(count / journals.length) * 100}%` }}
                                 transition={{ duration: 1, delay: 0.5 }}
                                 className={`h-full bg-gradient-to-r ${moodConfig[mood]?.color || 'from-gray-400 to-gray-600'}`}
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>

                {/* AI Insight */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-purple-500/20 rounded-[30px] p-6 relative group"
                >
                   <div className="absolute top-4 right-4 text-purple-400 opacity-30 group-hover:opacity-100 transition">
                      <Sparkles size={20} />
                   </div>
                   <h3 className="text-sm font-bold uppercase tracking-widest text-purple-300 mb-4">Garden Intelligence</h3>
                   <p className="text-sm text-purple-100/80 leading-relaxed font-serif italic">
                      "I've noticed a pattern of {dominantMood.toLowerCase()} energy lately. This is a fertile time for reflection. Consider focusing on deep breathing exercises during your next session."
                   </p>
                   <div className="mt-6 flex items-center gap-2 text-[10px] text-purple-400">
                      <Info size={12} /> Personalized Advice based on your entries.
                   </div>
                </motion.div>

                {/* Quick Link */}
                <button 
                  onClick={() => navigate('/panic')}
                  className="w-full bg-white text-black font-bold p-5 rounded-[30px] hover:bg-gray-200 transition flex items-center justify-between group"
                >
                  <span>Need instant calm?</span>
                  <div className="p-2 bg-black rounded-full text-white group-hover:rotate-45 transition">
                    <ArrowLeft size={16} className="rotate-180" />
                  </div>
                </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default MoodBloom;
