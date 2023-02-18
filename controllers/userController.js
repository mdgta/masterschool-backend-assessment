import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// provided user id and token, blacklist it in the user's badTokens array
const revokeToken = async (id, token) => {
	const user = await User.findById(id);
	if (!user) {
		// shouldn't ever happen, but just in case
		throw new Error("Token cannot be revoked: unable to find the associated user");
	}
	const {badTokens} = user;
	// add token to array of bad tokens
	if (!badTokens.includes(token)) {
		badTokens.push(token);
		// save
		return await user.save();
	}
	return false;
}

// go through expired tokens from the badTokens array and delete them
const cleanupOldTokens = async (user) => {
	const {JWT_SECRET} = process.env;
	const {badTokens} = user;
	const {length: oldLen} = badTokens;
	const expiredRemoved = badTokens.filter(token => {
		console.log("===========\n" + token);
		try {
			const verified = jwt.verify(token, JWT_SECRET);
			console.log({verified});
			return true && jwt.verify(token, JWT_SECRET);
		} catch (err) {
			console.log("not verified");
			return false;
		}
	});
	console.log(expiredRemoved.length, expiredRemoved);
	if (oldLen > expiredRemoved.length) {
		user.badTokens = expiredRemoved;
		//const saved = await user.save();
		//const updated = await user.update({badTokens: expiredRemoved});
		const saved = await user.save();
		console.log({saved});
	}
	console.log(`login: ${(oldLen - expiredRemoved.length) || "no"} tokens have been removed from badTokens`);
}

// register
export const register = asyncHandler(async (req, res) => {
	try {
		const {email, username, password} = req.body;
		// check if email is already in use
		const existingUser = await User.findOne({email});
		if (existingUser) {
			throw new Error("Email already exists.");
		}
		// can create account
		// ideally i'd do stuff like checking pass strength, but this is not in the rubriks so what the hell :p
		if (password === "hunter2") {
			// oh heck, why not lol
			res.status(400).json({
				message: "password cannot be hunter2. you can copy this text to try it for yourself. note that i don't know that your password was gonna be hunter2, for me it shows up as *******, i simply copy & pasted it and sent it to you back!"
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = await User.create({
			email,
			username,
			password: hashedPassword
		});
		res.status(200).json({
			email: user.email,
			username: user.username
		});
	} catch (err) {
		const {message} = err;
		res.status(404).json({message});
	}
});

// login
export const login = asyncHandler(async (req, res) => {
	try {
		const {email, password} = req.body;
		if (!(email && password)) {
			// wasn't in the rubrics, but this is causing issues
			throw new Error("login: please provide email and password");
		}
		const user = await User.findOne({email});
		if (!user) {
			throw new Error("invalid credentials");
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			throw new Error("invalid credentials");
		}
		const {JWT_SECRET} = process.env;
		console.log({JWT_SECRET});
		const token = jwt.sign({_id: user._id}, JWT_SECRET, {
			expiresIn: "30d"
		});
		// return new token
		res.status(200).json({token});
		// after sending the token, do some cleanup to remove old tokens (no need to await since there are no more actions to be performed)
		await cleanupOldTokens(user);
	} catch (err) {
		const {message} = err;
		res.status(404).json({message});
	}
});

// logout (revokes the current token)
export const logout = asyncHandler(async (req, res) => {
	try {
		const {user, token} = req;
		const revoked = await revokeToken(user._id, token);
		console.log({revoked});
		res.json({message: "Token revoked"});
	} catch (err) {
		const {message} = err;
		res.status(404).json({message});
	}
});

export const me = asyncHandler(async (req, res) => {
	const {user} = req;
	const userObject = user.toObject();//user._doc
	// properties that will not be returned to the user
	const privateEntries = ["_id", "__v", "password", "badTokens"];
	// entries without privateEntries
	const allowedEntries = Object.entries(user._doc).filter(([key, value]) => !privateEntries.includes(key));
	console.log({allowedEntries});
	// turn safe entries back into object
	const safeUserData = Object.fromEntries(allowedEntries);
	console.log({safeUserData});
	// return object
	res.json(safeUserData);
});