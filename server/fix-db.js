require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log("Connected");
        const res = await mongoose.connection.db.collection('users').updateOne(
            { username: 'mohit' }, 
            { $set: { role: 'doctor', isDoctor: true, specialization: 'Therapist', fees: 200, experience: 5, about: 'Helping you heal.' } }
        );
        console.log("Updated mohit:", res.modifiedCount);
        
        const count = await mongoose.connection.db.collection('users').countDocuments({ role: 'doctor' });
        console.log("Doctors in DB count:", count);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fix();
