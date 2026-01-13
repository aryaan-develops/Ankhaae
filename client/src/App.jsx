import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- 1. IMPORT KIYA

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import JournalHistory from './pages/JournalHistory';
import Panic from './pages/Panic';

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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal-history" element={<JournalHistory />} />
        <Route path="/panic" element={<Panic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;