import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Stethoscope, Clock, IndianRupee, MessageCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PaymentModal from '../components/PaymentModal'; // <--- 1. Import Modal

const FindDoctor = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Payment States
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Kaunsa doctor select hua
  const [showPayment, setShowPayment] = useState(false);      // Modal dikhana hai ya nahi

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('https://ankahee-api.onrender.com/api/doctor/all');
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Server busy. Localhost check karo.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // 2. Chat Button Logic
  const startChat = (doc) => {
    if (!user) { toast.error("Login to chat"); return; }
    navigate('/chat', { state: { doctorName: doc.username, doctorId: doc._id, userId: user._id || user.id, userName: user.username } });
  };

  // 3. Book Now -> Open Modal
  const handleBookClick = (doc) => {
      if (!user) { toast.error("Login first!"); return; }
      setSelectedDoctor(doc);
      setShowPayment(true);
  };

  // 4. Payment Success -> Show Final Toast
  const handlePaymentSuccess = () => {
      toast.success(`Booking Confirmed! 📅\nMeeting link sent to email.`);
      setShowPayment(false);
      setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 relative font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900/20 via-black to-black -z-10"></div>

      <div className="max-w-4xl mx-auto flex items-center gap-4 mb-8 z-10 relative">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          Professional Therapists
        </h1>
      </div>

      {loading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div></div>
      ) : doctors.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 p-10 bg-white/5 rounded-3xl border border-white/10 max-w-2xl mx-auto flex flex-col items-center">
              <AlertCircle size={48} className="mb-4 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-300">No Therapists Available</h2>
              <p className="text-sm mt-2">Register a doctor account to see list.</p>
          </div>
      ) : (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {doctors.map((doc) => (
            <div key={doc._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"><Stethoscope size={24} /></div>
                        <div>
                            <h3 className="text-lg font-bold">{doc.username}</h3>
                            <p className="text-sm text-cyan-400">{doc.specialization || "Therapist"}</p>
                        </div>
                    </div>
                    <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-1"><IndianRupee size={12}/> {doc.fees}/hr</div>
                </div>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">{doc.about || "Healing begins here."}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1"><Clock size={14}/> {doc.experience || 1}+ Years Exp.</span>
                    <span className="flex items-center gap-1">⭐ 5.0 Rating</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => startChat(doc)} className="py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition flex items-center justify-center gap-2 text-gray-300 hover:text-cyan-400">
                        <MessageCircle size={16}/> Chat
                    </button>
                    
                    {/* 👇 Updated Book Button */}
                    <button 
                        onClick={() => handleBookClick(doc)}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold transition shadow-lg">
                        Book Now
                    </button>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* 👇 5. Payment Modal Render */}
      {showPayment && selectedDoctor && (
        <PaymentModal 
            doctor={selectedDoctor} 
            onClose={() => setShowPayment(false)} 
            onSuccess={handlePaymentSuccess} 
        />
      )}

    </div>
  );
};

export default FindDoctor;