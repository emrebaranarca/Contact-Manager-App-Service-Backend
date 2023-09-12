const asyncHandler = require('express-async-handler')
const Contact=require("../models/contactModel")

exports.getContact=asyncHandler(async(req,res)=>{
    const contacts=await Contact.find({user_id:req.user.id})
    res.status(200).json(contacts)
})

exports.getContactById=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("don't have permission")
    }else{
        res.status(200).json(contact)
    }
      
})


exports.postContact=asyncHandler(async(req,res)=>{
    const {name,email,phoneNumber}=req.body
    if(!name || !email || !phoneNumber){
        res.status(400)
        throw new Error("All fields are mandatory !")
    }
    const contact=await Contact.create({
        name,email,phoneNumber,user_id:req.user.id
    });
    res.status(201).json(contact)
})


exports.deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("don't have permission")
    }
    await Contact.deleteOne({_id:req.params.id})
    res.status(200).json(contact)
})

exports.updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("don't have permission")
    }
    const updatedFields = {
        name: req.body.name, 
        email: req.body.email, 
        phoneNumber: req.body.phoneNumber 
    };
    const updateContact=await Contact.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        {new:true}
    )
    res.status(200).json(updateContact)
})