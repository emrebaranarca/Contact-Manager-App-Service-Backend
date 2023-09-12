const asyncHandler=require("express-async-handler")
const User=require("../models/userModel")
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const dotenv=require('dotenv').config()

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