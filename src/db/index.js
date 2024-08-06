import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connected Succesfully!!!")
    } catch (error) {
        console.log("Mongodb Connection Failed : ", error)
        process.exit(1);
    }
}

export default connectDB