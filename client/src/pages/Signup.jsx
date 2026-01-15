import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence add kiya animation ke liye
import { Sprout, Stethoscope } from 'lucide-react'; // Stethoscope icon doctor ke liye
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();

  // State mein naye doctor fields add kiye
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default 'user' rahega
    specialization: '',
    fees: '',
    experience: '',
    about: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Backend request
      await axios.post('https://ankahee-api.onrender.com/api/auth/signup', formData);
      
      // Success Message based on Role
      if (formData.role === 'doctor') {
        toast.success('Clinic Registered! Welcome Doctor 🩺');
      } else {
        toast.success('Account Created! Welcome to Ankahee 🌱');
      }
      
      navigate('/login'); 
      
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Signup failed! Email already exists.';
      toast.error(errorMsg);
    }
  };

  // Helper to check if mode is doctor
  const isDoc = formData.role === 'doctor';

  return (
    <div className="h-screen flex items-center justify-center overflow-y-auto relative py-10 bg-[#0a0a0a]">
      
      {/* Background Image */}
      <img
        className="fixed top-0 left-0 w-full h-full object-cover z-0 bg-breathe-animate opacity-60" 
        src="/signup6.png" 
        alt="Magical Background" 
      />
      
      {/* Dark Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/70 z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 my-10"
      >
        {/* --- ICON HEADER --- */}
        <div className="flex justify-center mb-4">
          <motion.div 
            key={formData.role} // Key change hone par animation hoga
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-4 rounded-full ${isDoc ? 'bg-cyan-500/20' : 'bg-green-500/20'}`}
          >
            {isDoc ? <Stethoscope size={36} className="text-cyan-400" /> : <Sprout size={36} className="text-green-400" />}
          </motion.div>
        </div>
        
        {/* --- TITLE --- */}
        <h2 className={`text-3xl font-bold text-center mb-2 font-serif bg-gradient-to-r text-transparent bg-clip-text drop-shadow-sm ${isDoc ? 'from-cyan-300 via-blue-400 to-indigo-300' : 'from-green-300 via-emerald-400 to-teal-300'}`}>
           {isDoc ? 'Join as Therapist' : 'Join Ankahee'}
        </h2>
        <p className="text-center text-gray-300 mb-6 text-sm">
            {isDoc ? 'Help others heal and grow.' : 'Apna healing tree aaj hi lagayein.'}
        </p>

        {/* --- ROLE TOGGLE BUTTONS --- */}
        <div className="flex justify-center mb-6">
            <div className="bg-black/30 p-1 rounded-full flex border border-white/10">
                <button 
                    onClick={() => setFormData({...formData, role: 'user'})}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isDoc ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 'text-gray-400 hover:text-white'}`}>
                    User 🌱
                </button>
                <button 
                    onClick={() => setFormData({...formData, role: 'doctor'})}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isDoc ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]' : 'text-gray-400 hover:text-white'}`}>
                    Doctor 🩺
                </button>
            </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Common Fields */}
          <div>
            <label className="block text-xs text-gray-400 mb-1 ml-1">Username</label>
            <input 
              type="text" name="username"
              className={`w-full bg-slate-900/60 border text-white rounded-lg p-3 focus:outline-none transition-colors placeholder-gray-500 ${isDoc ? 'focus:border-cyan-400 border-slate-500' : 'focus:border-green-400 border-slate-500'}`}
              placeholder="Your Name"
              value={formData.username} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 ml-1">Email</label>
            <input 
              type="email" name="email"
              className={`w-full bg-slate-900/60 border text-white rounded-lg p-3 focus:outline-none transition-colors placeholder-gray-500 ${isDoc ? 'focus:border-cyan-400 border-slate-500' : 'focus:border-green-400 border-slate-500'}`}
              placeholder="you@healing.com"
              value={formData.email} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 ml-1">Password</label>
            <input 
              type="password" name="password"
              className={`w-full bg-slate-900/60 border text-white rounded-lg p-3 focus:outline-none transition-colors placeholder-gray-500 ${isDoc ? 'focus:border-cyan-400 border-slate-500' : 'focus:border-green-400 border-slate-500'}`}
              placeholder="••••••••"
              value={formData.password} onChange={handleChange} required
            />
          </div>

          {/* --- DOCTOR SPECIFIC FIELDS (Smooth Animation) --- */}
          <AnimatePresence>
            {isDoc && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }} 
                    className="space-y-4 overflow-hidden pt-2"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 ml-1">Specialization</label>
                            <input type="text" name="specialization" className="w-full bg-cyan-900/20 border border-cyan-500/30 text-white rounded-lg p-3 focus:border-cyan-400 focus:outline-none placeholder-gray-500 text-sm" placeholder="e.g. Psychologist" value={formData.specialization} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 ml-1">Experience</label>
                            <input type="number" name="experience" className="w-full bg-cyan-900/20 border border-cyan-500/30 text-white rounded-lg p-3 focus:border-cyan-400 focus:outline-none placeholder-gray-500 text-sm" placeholder="Years" value={formData.experience} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1 ml-1">Consultation Fees (₹)</label>
                        <input type="number" name="fees" className="w-full bg-cyan-900/20 border border-cyan-500/30 text-white rounded-lg p-3 focus:border-cyan-400 focus:outline-none placeholder-gray-500 text-sm" placeholder="e.g. 500" value={formData.fees} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1 ml-1">About You</label>
                        <textarea name="about" rows="2" className="w-full bg-cyan-900/20 border border-cyan-500/30 text-white rounded-lg p-3 focus:border-cyan-400 focus:outline-none placeholder-gray-500 text-sm resize-none" placeholder="Short bio for patients..." value={formData.about} onChange={handleChange} required></textarea>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition-all mt-4 
                ${isDoc ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/50' : 'bg-gradient-to-r from-green-500 to-emerald-700 hover:shadow-green-500/50'}`}
          >
            {isDoc ? 'Register Clinic' : 'Start Journey'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className={`hover:underline font-medium underline-offset-4 ${isDoc ? 'text-cyan-400 hover:text-cyan-300' : 'text-green-400 hover:text-green-300'}`}>
                    Log In
                </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;