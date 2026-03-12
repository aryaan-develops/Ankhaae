import { useEffect, useState } from 'react';
import api from '../api';
import { ArrowLeft, MessageCircle, User, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Current Logged in Doctor
  const doctor = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Fetch users who chatted with me
        const res = await api.get(`/doctor/patients/${doctor._id || doctor.id}`);
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if(doctor) fetchPatients();
  }, []);

  const openChat = (patient) => {
    navigate('/chat', { 
        state: { 
            doctorName: patient.username, // UI ke liye naam 
            doctorId: patient._id,       // Chat logic ke liye ID (Patient ID hi pass hogi)
            userId: doctor._id || doctor.id, // Meri ID (Doctor)
            userName: doctor.username 
        } 
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-cyan-400">My Patients / Chats</h1>
      </div>

      {loading ? (
          <p className="text-center text-gray-500">Loading chats...</p>
      ) : patients.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
              <p>No chats yet. Wait for patients to message you.</p>
          </div>
      ) : (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map((p) => (
            <div key={p._id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{p.username}</h3>
                        <p className="text-xs text-gray-500">Patient</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => navigate('/issue-medical', { state: { patientId: p._id, patientName: p.username } })} className="p-3 bg-purple-600 rounded-full hover:bg-purple-500 transition shadow-lg">
                        <FilePlus size={20} />
                    </button>
                    <button onClick={() => openChat(p)} className="p-3 bg-cyan-600 rounded-full hover:bg-cyan-500 transition shadow-lg">
                        <MessageCircle size={20} />
                    </button>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyPatients;