import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Leaf, Sprout } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom"; // useNavigate import kiya
import toast from 'react-hot-toast'; // Toast import kiya

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook initialize kiya

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://ankahee-api.onrender.com/api/auth/login', { email, password });
      
      // Data save karo
      localStorage.setItem('token', res.data.token);
      // Ensure karo ki hum user object sahi se save kar rahe hain
      localStorage.setItem('user', JSON.stringify(res.data.user || res.data)); 
      
      // --- SUCCESS TOAST (Black Popup) ---
      toast.success('Welcome back! 🌱');
      
      // Smooth Redirect
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      // --- ERROR TOAST ---
      // Backend se jo error message aayega wo dikhayenge
      const errorMsg = err.response?.data?.message || 'Login failed! Check password.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden relative">
      
      {/* Background Image */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-0 bg-breathe-animate" 
        src="/loginI.jpg" 
        alt="Magical Background" 
      />
      
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0"></div>

      {/* --- Main Card --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 border border-white/20"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="bg-green-500/20 p-3 rounded-full"
          >
            <Sprout size={36} className="text-green-400" />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 font-serif text-white">Ankahee 🪶</h2>
        <p className="text-center text-gray-200 mb-8 text-sm">Apne tree ko paani diya aaj?</p>

        <form onSubmit={handleLogin} className="space-y-6">
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
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-300">
              New here?{' '}
              <Link to="/signup" className="text-green-400 hover:text-green-300 underline font-medium">
                Create Account
              </Link>
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-green-500/50 transition-all"
          >
            Log In
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;