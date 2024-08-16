import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import morgan from "morgan";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan("dev"))


app.get("/", (req, res) => {
    res.send("Server Running!!!");
})

import userRouter from "./routes/user.routes.js"
import errorMiddleware from "./utils/errorResponse.js";
app.use("/users", userRouter)

app.use(errorMiddleware);

export { app }
