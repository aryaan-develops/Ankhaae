import { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Pill, Calendar, Download, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MedicalHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState({ prescriptions: [], reports: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('prescriptions');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/doctor/history/${user._id || user.id}`);
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-cyan-400">Medical History</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-white/5 p-1 rounded-2xl border border-white/10">
           <button 
              onClick={() => setActiveTab('prescriptions')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'prescriptions' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
           >
              Prescriptions
           </button>
           <button 
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
           >
              Medical Reports
           </button>
        </div>

        {loading ? (
             <p className="text-center text-gray-500 py-20">Loading your history...</p>
        ) : (
          <div className="space-y-6">
             {activeTab === 'prescriptions' ? (
                history.prescriptions.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Pill size={48} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500">No prescriptions yet.</p>
                    </div>
                ) : (
                    history.prescriptions.map((p) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={p._id} 
                            className="bg-white/5 border border-white/10 p-6 rounded-2xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Dr. {p.doctor?.username}</h3>
                                    <p className="text-xs text-cyan-400 uppercase tracking-widest">{p.doctor?.specialization}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                                        <Calendar size={12} /> {new Date(p.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {p.medicines.map((m, idx) => (
                                    <div key={idx} className="bg-black/20 p-3 rounded-xl flex justify-between items-center border border-white/5">
                                        <div>
                                            <p className="font-bold text-sm">{m.name}</p>
                                            <p className="text-xs text-gray-400">{m.dosage} • {m.duration}</p>
                                        </div>
                                        {m.notes && <p className="text-[10px] text-gray-500 italic">Note: {m.notes}</p>}
                                    </div>
                                ))}
                            </div>

                            {p.generalNotes && (
                                <div className="mt-4 p-3 bg-cyan-900/10 rounded-xl border border-cyan-500/20">
                                    <p className="text-xs text-cyan-200">Instructions: {p.generalNotes}</p>
                                </div>
                            )}
                        </motion.div>
                    ))
                )
             ) : (
                history.reports.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <FileText size={48} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500">No reports found.</p>
                    </div>
                ) : (
                    history.reports.map((r) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={r._id} 
                            className="bg-white/5 border border-white/10 p-6 rounded-2xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{r.title}</h3>
                                        <p className="text-xs text-gray-500 italic">Issued by Dr. {r.doctor?.username}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} /> {new Date(r.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{r.description}</p>
                            {r.reportUrl && (
                                <a 
                                    href={r.reportUrl} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-xs font-bold hover:bg-white/20 transition"
                                >
                                    <Download size={14} /> View Document
                                </a>
                            )}
                        </motion.div>
                    ))
                )
             )}
          </div>
        )}

      </div>
    </div>
  );
};

export default MedicalHistory;
