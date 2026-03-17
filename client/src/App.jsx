import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- 1. IMPORT KIYA

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import JournalHistory from './pages/JournalHistory';
import Panic from './pages/Panic';
import FindDoctor from './pages/FindDoctor';
import Chat from './pages/Chat';
import MyPatients from './pages/MyPatients';
import MoodBloom from './pages/MoodBloom';
import MedicalHistory from './pages/MedicalHistory';
import PaymentHistory from './pages/PaymentHistory';
import PrescriptionReportForm from './pages/PrescriptionReportForm';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      {/* 2. YE LINE SABSE ZAROORI HAI 👇 */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      {/* ------------------------------- */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal-history" element={<JournalHistory />} />
        <Route path="/panic" element={<Panic />} />
        <Route path="/find-doctor" element={<FindDoctor />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/my-patients" element={<MyPatients />} />
        <Route path="/mood-bloom" element={<MoodBloom />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/issue-medical" element={<PrescriptionReportForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;