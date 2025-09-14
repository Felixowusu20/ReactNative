import express from "express"
import dotenv from "dotenv"
import { sql } from "./src/config/db.js"
import rateLimiting from "./src/middleware/rateLimiting.js"
import transactionsRoute from "./src/routes/transactionsRoute.js"

dotenv.config()
const app = express()
// middleware
app.use(rateLimiting)
app.use(express.json())
const PORT = process.env.PORT ||5001

async function initDB(){
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT  CURRENT_DATE
            )`
            console.log("database initialize successfully")
    }catch(error){
        console.log("Error initializing the DB" ,error)
        process.exit(1)
    }
}
app.use("/api/transactions",transactionsRoute)
app.get("/healthycheck" ,(req,res)=>{
    try {
        res.status(201).json({message:"Great  the Api is working perfectly fine"})
        
    } catch (error) {
        console.log("Error getting the healthy check for the api")
        res.status(500).json({message:"Internal server error"})
        
    }
})

initDB().then(()=>{
    app.listen(PORT,()=>{
    console.log("sever is running on port:",PORT)
})
})