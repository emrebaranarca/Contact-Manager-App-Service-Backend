const asyncHandler=require("express-async-handler")
const User=require("../models/userModel")
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const dotenv=require('dotenv').config()
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if(!username||!email||!password){
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    const availableUser=await User.findOne({ email })
    if(availableUser){
        res.status(400);
        throw new Error("User already registered!");
    }
    const hashedPassword=await bcrypt.hash(password,11)
    await User.create({ username,email,password:hashedPassword }).then((user)=>{
        if(user){
            res.status(201).json(user);
        }else{
            res.status(400);
            throw new Error("User data is not valid");
        }
    })

    res.json({ message: "Register the user" });
})

exports.loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    const user=await User.findOne({email})

    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign(
            {
              user: {
                username: user.username,
                email: user.email,
                id: user.id,
              }
            },
            process.env.ACCES_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.status(200).json(accessToken)
    }else{
        res.status(401)
        throw new Error("email or password is not valid")
    }
})

exports.getUser=asyncHandler(async(req,res)=>{
    res.status(200).json(req.user)

})



exports.requestReset=asyncHandler(async(req,res)=>{
    console.log("test")
    const email=req.body.email
    console.log(email)
    const user=await User.findOne({email})
    if(!user){
        res.status(404)
        throw new Error("user not found")
    }
    console.log(user)
    const token = crypto.randomBytes(32).toString('hex')
    console.log(token)
    user.resetToken=token
    user.resetTokenExpiration = Date.now() + 3600000
    console.log(user.resetToken)

    try{
        await user.save()
      }catch (error) {
        console.error(error)
        res.status(500).json({ message: 'error' });
      }

    const transporter = nodemailer.createTransport({
         service: "gmail",
         host:"smpt.gmail.com",
         port: 465,
         secure: true,
         auth: {
             user: process.env.EMAIL_ADRESS,
             pass: process.env.APP_PASSWORD
         }
     });

     const mailOptions = {
         from: "emrebaran.arca@gmail.com",
         to: user.email, // list of receivers
         subject: "Hello ✔", // Subject line
         text: "Hello world?" // plain text body
    }

    await transporter.sendMail(mailOptions,(error,info)=>{
         if(error){
             return res.status(500).json(error)
         }
         res.status(200).json({ message: `${user.resetToken}` });
     })

})

exports.postReset=asyncHandler(async(req,res)=>{

    console.log("test")
    const token=req.params.token
    console.log(token)
    const newPassword=req.body.newPassword
    console.log(newPassword)
    const user=await User.findOne({resetToken:token})
    console.log(user)
     if(!user){
         res.status(404)
         throw new Error("user not found")
     }
     const hashedPassword=await bcrypt.hash(newPassword,11)
     console.log(hashedPassword)
    user.password=hashedPassword
    user.resetToken=undefined
    user.resetTokenExpiration=undefined

    await user.save()
    res.status(200).json(user)


})