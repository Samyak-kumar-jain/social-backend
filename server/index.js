import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from "dotenv"
import router from './routes/authroute.js';
import cors from 'cors';
// import  from './routes/post.route.js';


const app = express();
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());

dotenv.config();

try {
    await mongoose.connect(process.env.MONGODB_URI || 5000, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => console.log("App listening on port 5000"));
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
}

    app.use('/auth', router)
    // app.use('/post', router)


