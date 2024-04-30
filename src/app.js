import express from 'express'
import cookieParser from 'cookie-parser';
import cors from "cors"
const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
    methods : ['GET', 'POST']
}))
app.use(express.json({
    limit : "16kb"
}))
app.use(express.urlencoded({
    limit : "16kb",
    extended : true
}))
app.use(express.static("public"))
app.use(cookieParser())


app.get("/", (req, res)=>{
    res.send("Hello from server")
})

// routes
import userRouter from "./routes/user.route.js"

app.use("/api/v1/users", userRouter)

export {app}