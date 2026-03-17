import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';
import { Users, Stethoscope, BookOpen, ShieldAlert, Trash2, Power, Search, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalDoctors: 0, totalJournals: 0 });
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'user', 'doctor'

    useEffect(() => {
        // Authenticate as Admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            toast.error("Unauthorized Access!");
            navigate('/login');
            return;
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch dashboard data");
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
            await api.put(`/admin/user/${id}/status`, { status: newStatus });
            toast.success(`User ${newStatus === 'active' ? 'Activated' : 'Suspended'}`);
            fetchData();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure? This action is permanent!")) return;
        try {
            await api.delete(`/admin/user/${id}`);
            toast.success("User Deleted Permanently");
            fetchData();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const filteredUsers = users.filter(u => 
        (activeTab === 'all' || u.role === activeTab) &&
        (u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="h-screen bg-[#020205] flex items-center justify-center text-white font-black text-4xl animate-pulse">ANKHAAE ADMIN...</div>;

    return (
        <div className="min-h-screen bg-[#020205] text-white p-4 md:p-10 font-sans selection:bg-red-500/30">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                        <ShieldAlert className="text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Control</h1>
                        <p className="text-xs text-white/40 font-bold tracking-[0.3em] uppercase">Managing The Unsaid Sanctuary</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/')} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all flex items-center gap-2 font-bold text-sm">
                        <Home size={16} /> Home
                    </button>
                    <button 
                        onClick={() => { localStorage.clear(); navigate('/login'); }} 
                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/20 transition-all flex items-center gap-2 font-bold text-sm"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="glass-premium p-8 rounded-[2.5rem] border border-blue-500/20 shadow-[0_20px_40px_rgba(37,99,235,0.1)]">
                    <Users className="text-blue-400 mb-6" size={32} />
                    <h3 className="text-4xl font-black mb-1">{stats.totalUsers}</h3>
                    <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Total Patients</p>
                </div>
                <div className="glass-premium p-8 rounded-[2.5rem] border border-cyan-500/20 shadow-[0_20px_40px_rgba(8,145,178,0.1)]">
                    <Stethoscope className="text-cyan-400 mb-6" size={32} />
                    <h3 className="text-4xl font-black mb-1">{stats.totalDoctors}</h3>
                    <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Active Doctors</p>
                </div>
                <div className="glass-premium p-8 rounded-[2.5rem] border border-purple-500/20 shadow-[0_20px_40px_rgba(147,51,234,0.1)]">
                    <BookOpen className="text-purple-400 mb-6" size={32} />
                    <h3 className="text-4xl font-black mb-1">{stats.totalJournals}</h3>
                    <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Journal Entries</p>
                </div>
            </div>

            {/* Management Section */}
            <div className="max-w-7xl mx-auto glass-premium rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/2">
                    <div className="flex bg-black/40 p-1 rounded-full border border-white/10 w-full md:w-auto">
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 md:flex-none px-8 py-2.5 rounded-full text-sm font-black uppercase transition-all ${activeTab === 'all' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                        >
                            All Users
                        </button>
                        <button 
                            onClick={() => setActiveTab('user')}
                            className={`flex-1 md:flex-none px-8 py-2.5 rounded-full text-sm font-black uppercase transition-all ${activeTab === 'user' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            Patients
                        </button>
                        <button 
                            onClick={() => setActiveTab('doctor')}
                            className={`flex-1 md:flex-none px-8 py-2.5 rounded-full text-sm font-black uppercase transition-all ${activeTab === 'doctor' ? 'bg-cyan-600 text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            Doctors
                        </button>
                    </div>
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Find by name or email..." 
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-blue-400/50 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-[10px] uppercase font-black tracking-[0.2em] text-white/30">
                                <th className="px-8 py-5">Entity Name</th>
                                <th className="px-8 py-5">Contact Details</th>
                                <th className="px-8 py-5">Role/Status</th>
                                <th className="px-8 py-5 text-right">Sanctuary Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredUsers.map((u, idx) => (
                                    <motion.tr 
                                        key={u._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border ${u.role === 'doctor' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                                    {u.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-lg">{u.username}</span>
                                                    <span className="text-[10px] text-white/30 uppercase tracking-widest">ID: {u._id.slice(-8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-white/60 font-medium">{u.email}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase text-center w-24 ${u.role === 'doctor' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {u.role}
                                                </span>
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase text-center w-24 ${u.status === 'suspended' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                                    {u.status || 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 text-white/50">
                                                <button 
                                                    onClick={() => handleToggleStatus(u._id, u.status)}
                                                    className={`p-3 rounded-xl transition-all border ${u.status === 'suspended' ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20'}`}
                                                    title={u.status === 'suspended' ? "Activate User" : "Suspend User"}
                                                >
                                                    <Power size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-bold"
                                                    title="Permanently Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
