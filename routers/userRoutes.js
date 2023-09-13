const express=require("express")
const router=express.Router()

const userController=require("../controllers/userContoller")
const validateToken=require("../middleware/validateTokenHandler")

router.post("/register",userController.registerUser)

router.post("/login",userController.loginUser)

router.get("/current",validateToken,userController.getUser)

router.post("/resetpassword",userController.requestReset)

router.post("/resetpassword/:token",userController.postReset)

module.exports=router

