import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";
import photoRouter from "./routes/photoRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// configure dotenv
dotenv.config();

// connect to database
connectDB();

// create server
const app = express();

// accept request body data
app.use(express.json());

// routes
app.get("/", (req, res) => {
	res.status(200).json({message: "Welcome to the Unsplash API!"});
});
app.use("/api/photos", photoRouter);
app.use("/api/auth", userRoutes);

// start server
const {PORT} = process.env;
app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});