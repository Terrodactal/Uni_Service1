const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // 1. Added bcrypt to hash the password
require('dotenv').config();

const app = express();
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('User Service Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the User Schema (Added 'mobile' so Mongoose stops blocking it)
const userSchema = new mongoose.Schema({
    emailid: { type: String, required: true },
    pass: { type: String, required: true }, 
    role: { type: String, required: true },
    mobile: { type: String } // Added this line! (String is best for phone numbers)
});
const User = mongoose.model('User', userSchema, 'person_collections');

// --- APIs ---

// VIEW PROFILE API - GET /user/viewprofile
app.get('/viewprofile', async (req, res) => {
    try {
        const user = await User.findOne({ emailid: req.body.emailid });
        
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("[VIEW PROFILE ERROR]", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// UPDATE PROFILE API - PUT /user/updateprofile
app.put('/updateprofile', async (req, res) => {
    try {
        // 3. Check if the user included a new password in the request body
        // If they did, hash it and replace the plain-text one before saving
        if (req.body.pass) {
            req.body.pass = await bcrypt.hash(req.body.pass, 10);
        }

        const updatedUser = await User.findOneAndUpdate(
            { emailid: req.body.emailid }, 
            req.body, 
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User Not Found to Update" });
        }
        res.status(200).json({ message: "Profile successfully updated", user: updatedUser });
    } catch (error) {
        console.error("[UPDATE PROFILE ERROR]", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// START THE EXPRESS SERVER. 
app.listen(13.223.193.120, () => {
    console.log('User Microservice Started at Port No: 13.223.193.120');
});
