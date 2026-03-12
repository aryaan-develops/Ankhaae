import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle, Smartphone, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const PaymentModal = ({ doctor, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('pay'); // 'pay' or 'success'
  const [method, setMethod] = useState('card'); // 'card' or 'upi'
  const [upiId, setUpiId] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        toast.error("User session expired!");
        setLoading(false);
        return;
    }

    // Process Booking
    try {
        await api.post('/doctor/book', {
            patientId: user._id || user.id,
            doctorId: doctor._id || doctor.id,
            date: new Date(),
            amount: doctor.fees,
            paymentId: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });

        setLoading(false);
        setStep('success');
        
        // 1.5 second baad close
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);

    } catch (error) {
        toast.error("Booking Failed! Refund initiated.");
        setLoading(false);
    }
  };

  // Dynamic QR Code URL (Google Chart API ya QRServer use kar sakte hain)
  // Ye real QR code dikhayega jo scan karne par Doctor ka naam dikhayega
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=doctor@ankhaee&pn=${doctor.username}&am=${doctor.fees}&cu=INR`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }} 
        className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-md w-full relative shadow-2xl overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"><X size={24}/></button>

        {step === 'pay' ? (
            <div>
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Complete Payment</h2>
                    <p className="text-xs text-gray-400">Total Amount: ₹{doctor.fees}</p>
                </div>

                {/* --- TABS (Card vs UPI) --- */}
                <div className="flex bg-black/40 p-1 rounded-xl mb-6">
                    <button 
                        onClick={() => setMethod('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${method === 'card' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                        <CreditCard size={16}/> Card
                    </button>
                    <button 
                        onClick={() => setMethod('upi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${method === 'upi' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                        <Smartphone size={16}/> UPI / QR
                    </button>
                </div>

                <form onSubmit={handlePay}>
                    {method === 'card' ? (
                        // --- CARD FORM ---
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 ml-1">Card Number</label>
                                <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none tracking-widest" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 ml-1">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 ml-1">CVV</label>
                                    <input type="password" placeholder="123" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none" required />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        // --- UPI / QR SECTION ---
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center space-y-4">
                            
                            <div className="bg-white p-3 rounded-xl shadow-lg">
                                {/* Auto-Generated QR Code Image */}
                                <img src={qrCodeUrl} alt="UPI QR" className="w-40 h-40 object-contain" />
                            </div>
                            <p className="text-xs text-gray-400">Scan via Paytm, GPay, or PhonePe</p>
                            
                            <div className="w-full relative">
                                <div className="absolute left-3 top-3.5 text-gray-500"><QrCode size={18}/></div>
                                <input 
                                    type="text" 
                                    placeholder="Enter UPI ID (e.g. user@ybl)" 
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-cyan-500 outline-none" 
                                    required // UPI mode mein ye zaroori hai
                                />
                            </div>
                        </motion.div>
                    )}

                    <button disabled={loading} className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/30 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                        {loading ? (
                            <>Processing <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span></>
                        ) : (
                            <><Lock size={16}/> {method === 'card' ? `Pay ₹${doctor.fees}` : 'Verify & Pay'}</>
                        )}
                    </button>
                </form>
            </div>
        ) : (
            // --- SUCCESS SCREEN ---
            <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_#22c55e]">
                    <CheckCircle size={40} className="text-white"/>
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                <p className="text-gray-400 mt-2">Appointment confirmed via {method === 'card' ? 'Card' : 'UPI'}.</p>
            </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentModal;