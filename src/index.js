import { app } from "./app.js";
import {connectDB} from "./db/index.js"
import dotenv from "dotenv"

dotenv.config({
    path : "./.env"
});

connectDB()
.then(
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    } ),
    app.on("error", (error)=>{
        console.error("Error while connecting to server ", error)
    })
).catch((error)=>{
    console.error("Mongodb connection failed !!! ", error);
})

