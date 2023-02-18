import mongoose from "mongoose";

const connect = () => {
	try {
		const {MONGO_URI} = process.env;
		console.log("MongoDB: connecting...");
		mongoose.connect(MONGO_URI);
		console.log("MongoDB: connected!");
	} catch (err) {
		process.exit(1);
	}
}

export default connect;