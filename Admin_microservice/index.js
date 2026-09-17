const express = require('express');
const mongoose = require('mongoose'); // Needed for MongoDB operations
require('dotenv').config(); // Needed to load your MONGO_URI

const app = express();
app.use(express.json()); // Essential: Allows your app to read JSON from Postman

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Admin Service Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 2. Define the User Schema (matching your DB)
const userSchema = new mongoose.Schema({
    emailid: { type: String, required: true },
    pass: { type: String, required: true },
    role: { type: String, required: true }
});
const User = mongoose.model('User', userSchema, 'person_collections');

// --- APIs ---

// SEARCH API - GET /admin/searchuser
app.get('/searchuser', async (req, res) => {
    try {
        // Searches the database by the emailid provided in Postman's body
        const user = await User.findOne({ emailid: req.body.emailid });
        
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// VIEW API - GET /admin/viewalluser
app.get('/viewalluser', async (req, res) => {
    try {
        // An empty .find({}) object returns every document in the collection
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// DELETE API - DELETE /admin/deluser
app.delete('/deluser', async (req, res) => {
    try {
        // Finds the exact user by emailid and deletes them in one step
        const deletedUser = await User.findOneAndDelete({ emailid: req.body.emailid });
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User Not Found to Delete" });
        }
        res.status(200).json({ message: "User successfully deleted", user: deletedUser });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// START THE EXPRESS SERVER. 
app.listen(5003, () =>
    console.log('EXPRESS Server Started at Port No:5003'));
