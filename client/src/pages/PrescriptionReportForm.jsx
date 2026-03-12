import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, FileText, Pill, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const PrescriptionReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId, patientName } = location.state || {};

  const doctor = JSON.parse(localStorage.getItem('user'));
  const [type, setType] = useState('prescription'); // 'prescription' or 'report'

  // Prescription States
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '', notes: '' }]);
  const [generalNotes, setGeneralNotes] = useState('');

  // Report States
  const [reportData, setReportData] = useState({ title: '', description: '', reportUrl: '' });

  const [isSaving, setIsSaving] = useState(false);

  // --- Medicine Handlers ---
  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', duration: '', notes: '' }]);
  const removeMedicine = (index) => setMedicines(medicines.filter((_, i) => i !== index));
  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSave = async () => {
    if (!patientId) return toast.error("Missing patient info!");
    
    // Validation
    if (type === 'prescription') {
      const isValid = medicines.every(med => med.name.trim() !== "" && med.dosage.trim() !== "" && med.duration.trim() !== "");
      if (!isValid) return toast.error("Please fill Medicine Name, Dosage, and Duration for all items.");
    } else {
      if (!reportData.title.trim() || !reportData.description.trim()) {
        return toast.error("Please fill Report Title and Description.");
      }
    }

    setIsSaving(true);
    try {
      if (type === 'prescription') {
        const res = await api.post('/doctor/prescription', {
          patientId,
          doctorId: doctor._id || doctor.id,
          medicines,
          generalNotes
        });
        toast.success(res.data.message || "Prescription Sent to Patient! 💊");
      } else {
        const res = await api.post('/doctor/report', {
          patientId,
          doctorId: doctor._id || doctor.id,
          ...reportData
        });
        toast.success(res.data.message || "Medical Report Saved! 📄");
      }
      navigate('/my-patients');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Issue for {patientName || 'Patient'}</h1>
            <p className="text-xs text-gray-500">Provide medical advice or reports</p>
          </div>
        </div>

        {/* Toggle Type */}
        <div className="flex gap-4 mb-10 bg-white/5 p-1 rounded-2xl border border-white/10">
           <button 
              onClick={() => setType('prescription')}
              className={`flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${type === 'prescription' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
           >
              <Pill size={18} /> Prescription
           </button>
           <button 
              onClick={() => setType('report')}
              className={`flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${type === 'report' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
           >
              <FileText size={18} /> Medical Report
           </button>
        </div>

        <motion.div 
            key={type}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 p-8 rounded-[40px] shadow-2xl relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 p-10 opacity-5 pointer-events-none`}>
                {type === 'prescription' ? <Pill size={120} /> : <FileText size={120} />}
            </div>

            {type === 'prescription' ? (
                <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-cyan-400" /> Medication Plan
                    </h3>
                    
                    {medicines.map((med, index) => (
                        <div key={index} className="space-y-4 p-5 bg-black/40 rounded-3xl border border-white/5 relative">
                            {medicines.length > 1 && (
                                <button onClick={() => removeMedicine(index)} className="absolute top-4 right-4 text-red-400/50 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    placeholder="Medicine Name (e.g. Paracetamol)"
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none text-sm"
                                    value={med.name} onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                                />
                                <input 
                                    placeholder="Dosage (e.g. 500mg - Twice daily)"
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none text-sm"
                                    value={med.dosage} onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    placeholder="Duration (e.g. 5 Days)"
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none text-sm"
                                    value={med.duration} onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                />
                                <input 
                                    placeholder="Special Notes (Optional)"
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 focus:border-cyan-500 outline-none text-sm"
                                    value={med.notes} onChange={(e) => updateMedicine(index, 'notes', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addMedicine}
                        className="w-full py-3 border border-dashed border-white/20 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus size={16} /> Add Another Medicine
                    </button>

                    <div className="mt-8">
                        <label className="text-xs text-gray-500 ml-2 mb-2 block">General Instructions</label>
                        <textarea 
                            rows="4"
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-cyan-500 outline-none text-sm resize-none"
                            placeholder="Advice, diet, or follow-up instructions..."
                            value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-purple-400" /> Diagnostic Summary
                    </h3>
                    
                    <div className="space-y-4">
                        <input 
                            placeholder="Report Title (e.g. Blood Test, Anxiety Assessment)"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none text-sm"
                            value={reportData.title} onChange={(e) => setReportData({...reportData, title: e.target.value})}
                        />
                        <textarea 
                            rows="6"
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-500 outline-none text-sm resize-none"
                            placeholder="Detailed findings and clinical observations..."
                            value={reportData.description} onChange={(e) => setReportData({...reportData, description: e.target.value})}
                        />
                        <input 
                            placeholder="Document Link / URL (Optional)"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none text-sm"
                            value={reportData.reportUrl} onChange={(e) => setReportData({...reportData, reportUrl: e.target.value})}
                        />
                    </div>
                </div>
            )}

            <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full mt-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${isSaving ? 'opacity-50' : 'hover:scale-[1.02] shadow-xl'} ${type === 'prescription' ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}
            >
                {isSaving ? 'Processing...' : <><Save size={20} /> Finalize & Send</>}
            </button>
        </motion.div>

      </div>
    </div>
  );
};

export default PrescriptionReportForm;
