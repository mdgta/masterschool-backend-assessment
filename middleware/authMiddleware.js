import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
	try {
		// get token from header
		const {authorization: auth} = req.headers;
		if (!auth) {
			throw new Error("auth error: token not recognized");
		}
		const token = auth.slice(7); // bearer token
		// get _id from jwt payload
		const {JWT_SECRET} = process.env;
		const payload = jwt.verify(token, JWT_SECRET); // throws an error if invalid
		const {_id} = payload;
		// save user object and token in req object
		req.user = await User.findById(_id);
		req.token = token;
		// check if user was actually found and there wasn't any issue
		if (!req.user) {
			throw new Error("authentication error");
		}
		// token valid, but make sure that it's not in the badToken array
		if (req.user.badTokens.includes(token)) {
			throw new Error("jwt has been blacklisted by the server");
		}
		// continue to the next middleware
		next();
	} catch (err) {
		const {message} = err;
		res.status(400).json({message});
	}
});

export default authMiddleware;