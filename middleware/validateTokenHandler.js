const asyncHandler=require("express-async-handler")
const jwt=require("jsonwebtoken")
const dotenv=require('dotenv').config()

const validateToken=asyncHandler(async(req,res,next)=>{
    let token
    const authHeader=req.headers.Authorization || req.headers.authorization
    if(authHeader){
        token=authHeader.split(" ")[1]
        if(!token){
            res.status(401)
            throw new Error("token is not validation")
        }
        jwt.verify(token,process.env.ACCES_TOKEN_SECRET,(err,decode)=>{
            if(err){
                res.status(401)
                throw new Error("unauthorized")
            }
            req.user=decode.user
            next()
        })
    }
})


module.exports=validateToken