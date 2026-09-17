const express = require('express');
const app = express()

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer();

const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRETE = process.env.JWT_SECRETE;

function authToken(req, res, next) {
    console.log(req.headers.authorization)
    const header = req?.headers.authorization;
    const token = header && header.split(' ')[1];

    if (token == null) return res.status(401).json("Please send token");

    jwt.verify(token, JWT_SECRETE, (err, user) => {
        if (err) return res.status(403).json("Invalid token", err);
        req.user = user;
        next()
    })
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json("Unauthorized");
        }
        next();
    }
}

//REDIRECT TO THE USER MICROSERVICE
app.use('/user',authToken, authRole('user'), (req, res) => {
    console.log("INSIDE API GATEWAY USER ROUTE")
    proxy.web(req, res, { target: 'http://13.223.193.120' });
})

//REDIRECT TO THE ADMIN MICROSERVICE
app.use('/admin', authToken, authRole('admin'),(req, res) => {
    console.log("INSIDE API GATEWAY ADMIN ROUTE")
    proxy.web(req, res, { target: 'http://44.211.31.44' });
})

//REDIRECT TO THE LOGIN(Authentication) MICROSERVICE
app.use('/login', (req, res) => {
    proxy.web(req, res, { target: 'http://44.192.27.186' });
})

//REDIRECT TO THE LOGIN(Authentication) MICROSERVICE
app.use('/registration', (req, res) => {
    proxy.web(req, res, { target: 'http://44.192.27.186' });
})

app.listen(44.192.27.186, () => {
    console.log("API Gateway Service is running on PORT NO : 44.192.27.186")
})
