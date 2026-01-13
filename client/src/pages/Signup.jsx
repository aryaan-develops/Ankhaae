import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, Sprout } from 'lucide-react'; // Sprout icon add kiya nature feel ke liye
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Toast import

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Backend request
      await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      
      // --- SUCCESS TOAST ---
      toast.success('Account Created! Welcome to Ankahee 🌱');
      
      // Redirect to Login
      navigate('/login'); 
      
    } catch (err) {
      console.error(err);
      // --- ERROR TOAST ---
      const errorMsg = err.response?.data?.message || 'Signup failed! Email already exists.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden relative">
      
      {/* Background Image */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-0 bg-breathe-animate" 
        src="/signup6.png" 
        alt="Magical Background" 
      />
      
      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 border border-white/20"
      >
        <div className="flex justify-center mb-4">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="bg-green-500/20 p-3 rounded-full"
          >
            <Sprout size={36} className="text-green-400" />
          </motion.div>
        </div>
        
        {/* --- ATTRACTIVE TITLE (Gradient Text) --- */}
        <h2 className="text-3xl font-bold text-center mb-2 font-serif bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300 text-transparent bg-clip-text drop-shadow-sm">
           Ankahee
        </h2>
        <p className="text-center text-gray-300 mb-6 text-sm">Apna healing tree aaj hi lagayein.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full bg-slate-900/60 border border-slate-500 text-white rounded-lg p-3 focus:outline-none focus:border-green-400 transition-colors placeholder-gray-500"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-slate-900/60 border border-slate-500 text-white rounded-lg p-3 focus:outline-none focus:border-green-400 transition-colors placeholder-gray-500"
              placeholder="you@healing.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-900/60 border border-slate-500 text-white rounded-lg p-3 focus:outline-none focus:border-green-400 transition-colors placeholder-gray-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-green-500/50 transition-all mt-2"
          >
            Start Journey
          </motion.button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-green-400 hover:text-green-300 underline font-medium underline-offset-4">
                    Log In
                </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;