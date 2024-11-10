import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import jwt from "jsonwebtoken"
import { sendOtp } from "./mail.js";
import dbConnect from "./dbConnect.js";
import {Register} from "./register_model.js"
dotenv.config({
    path: "./.env"
})

const app = express();
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({extended:false}))




app.get('/',(req,res)=>{
    res.json("Welcome to Server")
})

//Route for Registration          

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpTimestamp = Date.now();
    const token = jwt.sign({ username, email, password,otp, otpTimestamp }, '321', { expiresIn: '15m' });
    
    if (email) {
        try {
            await sendOtp(email,otp)
            res.status(200).json({
                message: 'Otp Sent Successfully!!',
                token, // Send the token to the client
                redirect: '/otp' // Redirect to OTP page
            });
            console.log("Otp Sent Successfully!!");
            //console.log("Session data after registration:", req.session.userData);

        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).send('Error sending OTP');
        }
    } else {
        res.status(400).send('Email is required');
    }
});

app.post('/otp',async(req,res)=>{

    const token = req.headers['authorization']?.split(' ')[1]; // Assuming 'Bearer <token>'
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const code = req.body.otp
        const currentTime = Date.now()
        const decoded = jwt.verify(token, '321');
        const { otp, otpTimestamp } = decoded;
        // Access the user data from the decoded token
        const { username, email, password } = decoded;
        

        if (code===otp && currentTime-otpTimestamp<120000) {
            const registerUser = new Register({
                username, 
                email, 
                password
            })
            const Registered = await registerUser.save();
            return res.status(200).json({
                message: 'Registration successful!',
                redirect: '/login' // Redirect to quiz page
            });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})


app.post('/login',async(req,res)=>{
    try {
        const Username = req.body.username
        const Password = req.body.password

        const userlogin = await Register.findOne({username:Username})

        if (!userlogin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if(userlogin.password===Password && userlogin.username===Username){
            // Generate a JWT token
            const token = jwt.sign({ username: userlogin.username, password: userlogin.password }, '321', { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful',token, redirect: '/' });

        }
        else{
            return res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('User cannot be logged in, invalid credentials');
    }
})

dbConnect()

app.listen(process.env.PORT,()=>{
    console.log(`App is listning on PORT : ${process.env.PORT}`)
})