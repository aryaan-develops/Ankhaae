import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Calendar, Trophy, AlertTriangle, Trash2, Sparkles } from 'lucide-react'; // Sparkles icon add kiya
import { useNavigate } from 'react-router-dom';
import desktopBg from '../assets/dashboard.jpg'; 
import mobileBg from '../assets/signup8.png';

const JournalHistory = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) return navigate('/login');
      
      const user = JSON.parse(userData);
      try {
        const userId = user._id || user.id; 
        const res = await axios.get(`http://localhost:5000/api/journal/user/${userId}`);
        setJournals(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, [navigate]);

  const handleDelete = async (journalId) => {
    if (!window.confirm("Delete this memory?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/journal/${journalId}`);
      setJournals(journals.filter((j) => j._id !== journalId));
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="min-h-screen text-white relative flex flex-col items-center font-sans overflow-y-auto pb-10">
      
      <div className="fixed top-0 left-0 w-full h-full -z-20">
        <img className="hidden md:block w-full h-full object-cover grayscale opacity-50" src={desktopBg} alt="BG" />
        <img className="block md:hidden w-full h-full object-cover grayscale opacity-50" src={mobileBg} alt="BG" />
      </div>
      <div className="fixed top-0 left-0 w-full h-full bg-black/80 -z-10"></div>

      {/* Header */}
      <div className="w-full max-w-4xl p-6 flex items-center gap-4 z-10 sticky top-0 bg-black/20 backdrop-blur-md">
        <button onClick={() => navigate('/journal')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-serif">Your Journey</h1>
      </div>

      {/* History Cards */}
      <div className="w-full max-w-4xl px-6 grid gap-6 z-10">
        {loading ? <p className="text-center text-gray-400">Loading...</p> : journals.length === 0 ? <p className="text-center text-gray-400">No journals yet.</p> : (
          journals.map((journal) => (
            <div key={journal._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition group relative">
              
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                <div>
                   <span className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                      <Calendar size={12} /> {new Date(journal.createdAt).toLocaleDateString()}
                   </span>
                   <span className={`px-2 py-1 rounded text-xs border ${
                      journal.mood === 'Happy' ? 'border-green-500 text-green-400' : 'border-gray-500 text-gray-400'
                   }`}>{journal.mood}</span>
                </div>
                <button onClick={() => handleDelete(journal._id)} className="p-2 text-red-400/50 hover:text-red-400 transition">
                  <Trash2 size={18} />
                </button>
              </div>

              <p className="text-white/90 font-serif leading-relaxed whitespace-pre-wrap mb-6">{journal.content}</p>

              {/* --- AI RESPONSE SECTION (NEW) --- */}
              {journal.aiResponse && (
                <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2 text-purple-300">
                        <Sparkles size={16} /> <span className="text-sm font-bold uppercase tracking-wider">AI Companion</span>
                    </div>
                    <p className="text-purple-100 text-sm italic leading-relaxed">"{journal.aiResponse}"</p>
                </div>
              )}

              {/* Wins & Lessons */}
              {(journal.dailyWin || journal.dailyChallenge) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 bg-black/20 -mx-6 -mb-6 p-4 rounded-b-2xl">
                    {journal.dailyWin && (<div className="text-sm"><p className="text-green-400 flex items-center gap-2 mb-1"><Trophy size={14}/> Win</p><p className="text-gray-300">{journal.dailyWin}</p></div>)}
                    {journal.dailyChallenge && (<div className="text-sm"><p className="text-orange-400 flex items-center gap-2 mb-1"><AlertTriangle size={14}/> Lesson</p><p className="text-gray-300">{journal.dailyChallenge}</p></div>)}
                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalHistory;