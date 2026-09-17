const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRETE = process.env.JWT_SECRETE;
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    emailid: { type: String, required: true },
    pass: { type: String, required: true }, 
    role: { type: String, required: true }
});

const User = mongoose.model('User', userSchema, 'person_collections');

app.post("/login", async (req, res) => {
    const { emailid, password, role } = req.body;

    try {
        const user = await User.findOne({ emailid: emailid });

        if (!user) {
            console.log(`[LOGIN FAILED] Email: "${emailid}" - Reason: User not found in database.`);
            return res.status(400).send("Invalid credentials or role"); 
        }

        // Check if the provided role matches the database role
        if (user.role !== role) {
            console.log(`[LOGIN FAILED] Email: "${emailid}" - Reason: Role mismatch (Provided: "${role}", Expected: "${user.role}").`);
            return res.status(400).send("Invalid credentials or role");
        }

        const isPasswordValid = await bcrypt.compare(password, user.pass);

        if (!isPasswordValid) {
            console.log(`[LOGIN FAILED] Email: "${emailid}" - Reason: Incorrect password.`);
            return res.status(400).send("Invalid credentials or role");
        }

        console.log(`[LOGIN SUCCESS] Email: "${emailid}" with role "${role}" logged in successfully.`);
        const token = jwt.sign({ emailid: user.emailid, role: user.role }, JWT_SECRETE, { expiresIn: '24h' });
        return res.json({ token });
        
    } catch (error) {
        console.error(`[LOGIN ERROR] Email: "${emailid}" - Reason: Server/Database error -`, error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(5002, () => {
    console.log('Authentication Service Server is running on PORT NO:5002');
});
