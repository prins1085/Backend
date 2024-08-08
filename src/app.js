import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/api/v1/test", (req, res) => {
    res.send(201).json("Backend Called")
});

import userRouter from "./routes/user.routes.js"
import errorMiddleware from "./utils/errorResponse.js";
app.use("/api/v1/users", userRouter)

app.use(errorMiddleware);

export { app }
