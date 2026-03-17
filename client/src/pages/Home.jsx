import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  UserCircle, 
  MessageSquare, 
  ShieldAlert, 
  BookOpen, 
  CloudRain, 
  Stethoscope,
  ChevronRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import CustomCursor from '../components/CustomCursor';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    className="group bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
  >
    <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform">
      <Icon className="w-8 h-8 text-blue-400" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/50 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const Home = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Stethoscope,
      title: "Consult with Experts",
      description: "Connect with verified mental health professionals through our secure finding system.",
      delay: 0.1
    },
    {
      icon: BookOpen,
      title: "Emotional Sanctuary",
      description: "Express your unspoken thoughts in a safe, encrypted digital journal designed for reflection.",
      delay: 0.2
    },
    {
      icon: ShieldAlert,
      title: "Panic Shield",
      description: "Instant access to grounding techniques and emergency support when things get overwhelming.",
      delay: 0.3
    },
    {
      icon: Sparkles,
      title: "Mood Bloom",
      description: "Interactive tools to track your emotional growth and nurture your mental well-being daily.",
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <CustomCursor />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video - Optimized */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 will-change-transform"
        >
          <source src="/login1.mp4" type="video/mp4" />
        </video>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020205]/10 via-transparent to-[#020205]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020205_100%)] opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out px-6 md:px-8 ${
              scrolled ? 'py-4 bg-[#020205]/95 backdrop-blur-md border-b border-white/5' : 'py-6 md:py-8 bg-transparent'
            } flex justify-between items-center`}
          >
            <Link to="/" className="flex items-center gap-3 group relative z-50">
              <img 
                src="/feather1.png" 
                alt="Ankhaee Logo" 
                className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-110 group-hover:rotate-12"
              />
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white">Ankhaee</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/dashboard" className="px-6 py-2.5 font-bold text-white/80 hover:text-white transition-colors bg-white/5 rounded-full border border-white/10 flex items-center gap-2 group">
                <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
                Dashboard
              </Link>
              <Link to="/login" className="px-6 py-2.5 font-bold hover:text-blue-400 transition-colors">Log In</Link>
              <Link to="/signup" className="px-8 py-2.5 bg-white text-black rounded-full font-black hover:bg-blue-400 hover:text-white transition-all transform active:scale-95 shadow-xl">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden relative z-50 p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-0 bg-[#020205] z-40 flex flex-col items-center justify-center gap-8 p-10"
                >
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-white hover:text-blue-400 transition-colors">Dashboard</Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-white hover:text-blue-400 transition-colors">Log In</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black px-10 py-5 bg-white text-black rounded-full hover:bg-blue-400 hover:text-white transition-all shadow-2xl">
                    Get Started
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center"
          >
            <span className="inline-block px-6 py-2 mb-8 text-sm font-bold tracking-[0.3em] text-blue-400 border border-blue-400/30 rounded-full bg-blue-400/5 backdrop-blur-md uppercase animate-pulse">
              Your Mental Wellness Companion
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter mb-10">
              HEAL IN<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-[length:200%_auto] animate-gradient">
                SILENCE.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/50 max-w-3xl font-light leading-relaxed mb-12">
              Building a sanctuary for the words left unspoken. Ankahee helps you find 
              mental peace, professional guidance, and a path to emotional resilience.
            </p>
            <div className="flex gap-6">
              <Link to="/signup" className="group px-10 py-5 bg-blue-600 rounded-full font-black text-lg flex items-center gap-3 hover:bg-blue-500 transition-all hover:pr-12 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                Start Your Journey
                <ChevronRight className="w-6 h-6 transition-all group-hover:translate-x-2" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-[1px] h-20 bg-gradient-to-b from-blue-500 to-transparent"></div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-blue-500/50">Details Below</span>
        </div>
      </section>

      {/* Why Ankahee? */}
      <section id="features" className="py-32 px-6 relative overflow-hidden">
        {/* Section Background Image - Brightened */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/loginI.jpg" 
            alt="Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[#020205] bg-opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                Empowering Your<br />
                <span className="text-blue-500">Mental Peace.</span>
              </h2>
              <p className="text-xl text-white/50 mb-10 leading-relaxed font-light">
                Mental health isn't a destination, it's a practice. Ankahee provides 
                the digital tools and professional network to make your well-being 
                a sustainable part of your daily life.
              </p>
              <div className="space-y-6">
                {[
                  "Connect with certified doctors easily.",
                  "Personalized AI-powered mood tracking.",
                  "Private and secure emotional journaling.",
                  "Real-time support during panic episodes."
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-glow"></div>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto rounded-[4rem] relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] group"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/signup.jpg" 
              alt="Join Ankahee" 
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>

          <div className="relative z-10 p-8 md:p-24 flex flex-col items-center md:items-start text-center md:text-left max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight text-white drop-shadow-2xl">
                READY TO START<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">FEELING BETTER?</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 mb-12 font-light leading-relaxed max-w-xl">
                Join our community of resilience. Your first step towards mental peace starts here, in the comfort of your haven.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                <Link to="/signup" className="group relative px-10 py-5 bg-white text-black rounded-full font-black text-xl overflow-hidden transition-all hover:pr-16 shadow-2xl active:scale-95">
                  <span className="relative z-10 transition-all group-hover:mr-2 text-center w-full">JOIN ANKAHEE</span>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 opacity-0 transition-all group-hover:opacity-100 group-hover:right-8 text-blue-600" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-10">
          <Link to="/" className="flex items-center gap-3">
             <img src="/feather1.png" alt="Ankhaee" className="h-8 w-auto object-contain" />
             <span className="text-xl font-bold tracking-tight text-white">Ankhaee</span>
          </Link>
          <p className="text-white/30 text-sm">
            © 2026 Ankahee Mental Health. All rights unspoken.
          </p>
        </div>
      </footer>

      <style jsx="true">{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        @keyframes glow {
          0%, 100% { opacity: 1; filter: blur(2px); }
          50% { opacity: 0.5; filter: blur(8px); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
