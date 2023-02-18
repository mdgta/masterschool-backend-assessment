import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Favorite from "../models/favoritePhotoModel.js";

export const get = asyncHandler(async (req, res) => {
	try {
		const {_id: userId} = req.user;
		const favorites = await Favorite.find({user: userId});
		if (!favorites  || !(favorites instanceof Array) || !favorites.length) {
			res.status(404);
			throw new Error("no favorites found");
		}
		res.json(favorites);
	} catch (err) {
		const {message} = err;
		res.status(res.statusCode || 500).json({message});
	}
});

export const add = asyncHandler(async (req, res) => {
	try {
		const {url, description, username, explanation} = req.body;
		if (!(url && description && username && explanation)) {
			res.status(400);
			throw new Error("cannot add new favorite: please add url, description, username and explanation");
		}
		const favorite = await Favorite.create({
				user: req.user._id,
				url,
				description,
				username,
				explanation
		});
		res.status(201).json(favorite);
	} catch (err) {
		const {message} = err;
		res.status(res.statusCode || 500).json({message});
	}
});

export const edit = asyncHandler(async (req, res) => {
	try {
		// const {id, explanation} = req.body;
		// if (!(id && explanation)) {
		// 	res.status(400);
		// 	throw new Error("edit error: please add the favorite entry's id and explanation");
		// }
		// const favorite = await Favorite.findById(id);
		// if (!favorite) {
		// 	throw new Error("favorite not found");
		// }
		// console.log({favorite, uid: req.user._id});
		// if (favorite.user.toString() !== req.user._id.toString()) {
		// 	throw new Error("edit error: you cannot edit this entry");
		// }
		// favorite.explanation = explanation;
		// const saved = await favorite.save();
		// res.status(200).json({saved});
		const {id, explanation} = req.body;
		if (!(id && explanation)) {
			res.status(400);
			throw new Error("edit error: please add the favorite entry's id and explanation");
		}
		const favorite = await Favorite.findOneAndUpdate({
			user: req.user._id,
			_id: id
		}, {
			explanation
		}, {
			new: true
		});
		if (!favorite) {
			res.status(400);
			throw new Error("update error. please check your favorite's id. you can only update your own entries");
		}
		res.status(200).json(favorite);
	} catch (err) {
		const {message} = err;
		res.status(res.statusCode || 500).json({message});
	}
});

export const remove = asyncHandler(async (req, res) => {
	try {
		const {id} = req.body;
		if (!id) {
			res.status(404);
			throw new Error("delete error: please provide id");
		}
		const deletion = await Favorite.findOneAndDelete({
			user: req.user._id,
			_id: id
		});
		if (!deletion) {
			res.status(500);
			throw new Error("delete error");
		}
		res.json(deletion);
	} catch (err) {
		const {message} = err;
		console.log("++", res.statusCode);
		res.status(res.statusCode || 500).json({message});
	}
});