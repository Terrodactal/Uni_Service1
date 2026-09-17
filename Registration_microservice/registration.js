const express = require('express');
const bcrypt = require('bcrypt');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbconnect.js');
const PersonModel = require('./person_schema.js');

/*
In the postman use the following URL
localhost:5000/reg

{
  "name":"Joe",
  "email":"a@gmail.com",
  "password":"abc",
  "mobile": 12345678,
  "role": "student"
}

*/

function uniqueid(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

//REG API
app.post('/reg', async (req, res) => {
  console.log("REG API EXECUTED");
  
  try {
    // Check if user with this email already exists
    const existingUser = await PersonModel.findOne({ emailid: req.body.email });
    if (existingUser) {
      return res.status(400).send('EMAIL ALREADY EXISTS IN DATABASE');
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const pobj = new PersonModel({
      id: uniqueid(1000, 9999),
      name: req.body.name,
      emailid: req.body.email,
      pass: hashedPassword,
      mobile: req.body.mobile,
      role: req.body.role
    });//CLOSE PersonModel
  
    //INSERT/SAVE THE RECORD/DOCUMENT
    pobj.save()
      .then(inserteddocument => {
        res.status(200).send('DOCUMENT INSERTED IN MONGODB DATABASE');
      })//CLOSE THEN
      .catch(err => {
        res.status(500).send({ message: err.message || 'Error in Employee Save ' })
      });//CLOSE CATCH

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ message: 'Internal server error during registration' });
  }
});//CLOSE POST METHOD

// START THE EXPRESS SERVER. 5001 is the PORT NUMBER
app.listen(44.192.27.186:5001, () => console.log('EXPRESS Server Started at Port No: 44.192.27.186:5001'));
