const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicalReport = require('../models/MedicalReport');
const Payment = require('../models/Payment');

// 1. GET ALL DOCTORS (Search Feature)
router.get('/all', async (req, res) => {
  try {
    // Find users who are either marked as 'doctor' role OR have isDoctor: true
    const doctors = await User.find({ 
      $or: [
        { role: 'doctor' },
        { isDoctor: true }
      ]
    }).select('-password');
    
    console.log(`[DEBUG] /api/doctor/all hit. Found ${doctors.length} results.`);
    if (doctors.length === 0) {
        console.log("[DEBUG] No doctors found. Checking all users...");
        const allUsers = await User.find({}).limit(5).select('username role isDoctor');
        console.log("[DEBUG] Sample users in DB:", allUsers);
    }
    
    res.json(doctors);
  } catch (err) {
    console.error("Fetch doctors error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. BECOME A DOCTOR (Temporary API for testing)
// Isse tum kisi bhi user ko doctor bana sakte ho
router.put('/upgrade/:userId', async (req, res) => {
  try {
    const { specialization, experience, fees, about } = req.body;
    
    const user = await User.findByIdAndUpdate(req.params.userId, {
      role: 'doctor',
      isDoctor: true,
      specialization,
      experience,
      fees,
      about
    }, { new: true });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update Failed" });
  }
});

// 3. BOOK APPOINTMENT
router.post('/book', async (req, res) => {
    try {
        const { patientId, doctorId, date, amount, paymentId } = req.body;

        // 1. Create Appointment
        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            amount,
            status: 'confirmed', // Assuming pre-paid for now
            paymentStatus: 'paid'
        });
        await appointment.save();

        // 2. Save Payment Record
        const payment = new Payment({
            user: patientId,
            amount,
            purpose: `Appointment with Doctor`,
            paymentId,
            status: 'success'
        });
        await payment.save();

        res.status(201).json({ message: "Appointment Booked Successfully!", appointment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Booking Failed" });
    }
});

// 4. GIVE PRESCRIPTION
router.post('/prescription', async (req, res) => {
    try {
        const { patientId, doctorId, medicines, generalNotes } = req.body;
        
        // 1. Save Prescription in DB
        const prescription = new Prescription({
            patient: patientId,
            doctor: doctorId,
            medicines,
            generalNotes
        });
        await prescription.save();

        // 2. Automically send a message to the patient (Chat notification)
        const doctor = await User.findById(doctorId);
        const notification = new Message({
            senderId: doctorId,
            receiverId: patientId,
            text: `🩺 NEW PRESCRIPTION: Dr. ${doctor?.username || 'Doctor'} has issued a new prescription for you. Check your Medical History.`
        });
        await notification.save();

        res.status(201).json({ message: "Prescription Saved & Patient Notified!", prescription });
    } catch (err) {
        console.error("Prescription Error:", err);
        res.status(500).json({ message: "Failed to save prescription" });
    }
});

// 5. GIVE REPORT
router.post('/report', async (req, res) => {
    try {
        const { patientId, doctorId, title, description, reportUrl } = req.body;
        
        // 1. Save Report in DB
        const report = new MedicalReport({
            patient: patientId,
            doctor: doctorId,
            title,
            description,
            reportUrl
        });
        await report.save();

        // 2. Automically send a message to the patient (Chat notification)
        const doctor = await User.findById(doctorId);
        const notification = new Message({
            senderId: doctorId,
            receiverId: patientId,
            text: `📄 NEW MEDICAL REPORT: Dr. ${doctor?.username || 'Doctor'} uploaded a report: "${title}". Check your Medical History.`
        });
        await notification.save();

        res.status(201).json({ message: "Report Saved & Patient Notified!", report });
    } catch (err) {
        console.error("Report Error:", err);
        res.status(500).json({ message: "Failed to save report" });
    }
});

// 6. GET MEDICAL HISTORY (For Patient)
router.get('/history/:patientId', async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.params.patientId }).populate('doctor', 'username specialization').sort({ createdAt: -1 });
        const reports = await MedicalReport.find({ patient: req.params.patientId }).populate('doctor', 'username specialization').sort({ createdAt: -1 });
        res.json({ prescriptions, reports });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch history" });
    }
});

// 7. GET PAYMENT HISTORY
router.get('/payments/:userId', async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch payments" });
    }
});

router.get('/patients/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;

        // 1. Find all messages where receiver is this doctor
        // Using 'distinct' to get unique user IDs
        const senderIds = await Message.distinct('senderId', { receiverId: doctorId });

        // 2. Also find users whom the doctor messaged (in case doctor started chat)
        const receiverIds = await Message.distinct('receiverId', { senderId: doctorId });

        // 3. Combine unique IDs
        const allUserIds = [...new Set([...senderIds, ...receiverIds])];

        // 4. Fetch User details for these IDs
        const patients = await User.find({ _id: { $in: allUserIds } }).select('username email _id');

        res.json(patients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;