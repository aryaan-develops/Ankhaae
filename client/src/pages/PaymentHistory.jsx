import { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle2, XCircle, Calendar, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get(`/doctor/payments/${user._id || user.id}`);
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">Billing History</h1>
            <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Your transaction records</p>
          </div>
        </div>

        {loading ? (
             <p className="text-center text-gray-500 py-20">Loading payments...</p>
        ) : payments.length === 0 ? (
            <div className="text-center py-24 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                <CreditCard size={48} className="mx-auto text-gray-800 mb-6" />
                <h2 className="text-xl font-bold text-gray-400">No transactions yet</h2>
                <p className="text-gray-600 text-sm mt-2">When you book sessions, they will appear here.</p>
            </div>
        ) : (
          <div className="grid gap-4">
            {payments.map((p) => (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={p._id} 
                    className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between hover:border-emerald-500/30 transition-all group"
                >
                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${p.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400'}`}>
                            {p.status === 'success' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-200">{p.purpose}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} /> {new Date(p.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Hash size={12} /> ID: {p.paymentId.substring(0, 10)}...
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <p className="text-lg font-black text-white">₹{p.amount}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${p.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {p.status}
                        </p>
                    </div>
                </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentHistory;
