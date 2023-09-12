const express=require('express')
const router=express.Router()
const contactController=require("../controllers/contactController")
const validateToken=require("../middleware/validateTokenHandler")


router.get("/",validateToken,contactController.getContact)

router.get("/:id",validateToken,contactController.getContactById)

router.post("/",validateToken,contactController.postContact)

router.delete("/:id",validateToken,contactController.deleteContact)

router.put("/:id",validateToken,contactController.updateContact)



module.exports=router