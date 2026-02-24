import mongoose from "mongoose";


const connectDB = async()=>{
    try {
       const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
       console.log("DB connection successfull at ",connectionInstance.connection.host);
    } catch (error) {
        console.log("Error connecting DB :",error);
    }

};

export default connectDB;