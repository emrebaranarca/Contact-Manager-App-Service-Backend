const express = require('express')
const app = express()
const connectDb=require("./config/dbConnection")
connectDb()

const dotenv=require('dotenv').config()

const port = process.env.PORT;

const contactRouter=require("./routers/contactRoutes")
const userRouter=require("./routers/userRoutes")
const errorHandler=require("./middleware/errorHandler")

app.use(express.json())
app.use("/api/contact",contactRouter)
app.use("/api/user",userRouter)
app.use(errorHandler)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})