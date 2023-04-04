require("dotenv").config()
const express=require("express")
const app=express()
const {connection}=require("./config/database")
const cors=require("cors")
const { userRoute } = require("./Routes/users.routes")
const { calculateRoute } = require("./Routes/calculate.routes")


app.use(
    cors({
        origin:"*",
    })
)

app.use(express.json())

app.use("/users",userRoute)
app.use("/calculate",calculateRoute)

app.get("/",(req,res)=>{
    res.send("Welcome to mock 12")
})

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("connected to database")

    }catch(err){
        console.log('err', err)
    }
    console.log(`server is live at port:${process.env.port}`)
})