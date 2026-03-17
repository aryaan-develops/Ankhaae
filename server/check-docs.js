require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        const users = await mongoose.connection.db.collection('users').find({
            $or: [
                { role: 'doctor' },
                { isDoctor: true }
            ]
        }).toArray();
        console.log("Found doctors:", users.length);
        users.forEach(u => console.log(`- ${u.username} (role: ${u.role}, isDoctor: ${u.isDoctor})`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
