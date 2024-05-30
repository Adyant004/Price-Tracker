import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async() => {
    mongoose.set('strictQuery',true);

    if(!process.env.MONGO_DB_URI) return console.log("MONGODB URI is not defined")

    if(isConnected) return console.log("Using existing database connection")

    try{
        await mongoose.connect(process.env.MONGO_DB_URI);

        isConnected = true;

        console.log('Mongoose is connected')

    } catch(error : any) {
        throw new Error(error.message)
    }
}