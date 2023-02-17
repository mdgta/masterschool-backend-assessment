import dotenv from "dotenv";
import express from "express";

// configure dotenv
dotenv.config();

// create server
const app = express();

// routes
app.get("/", (req, res) => {
	res.status(200).json({message: "Welcome to the Unsplash API!"});
});

// start server
const {PORT} = process.env;
app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});