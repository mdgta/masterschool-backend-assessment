import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Favorite from "../models/favoritePhotoModel.js";

export const get = asyncHandler(async (req, res) => {
	const {_id: userId} = req.user;
	const favorites = await Favorite.find({user: userId});
	if (!favorites  || !(favorites instanceof Array) || !favorites.length) {
		res.status(404);
		throw new Error("no favorites found");
	}
	res.json(favorites);
});

export const add = asyncHandler(async (req, res) => {
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
});

export const edit = asyncHandler(async (req, res) => {
	const {id} = req.params;
	const {explanation} = req.body;
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
});

export const remove = asyncHandler(async (req, res) => {
	const {id} = req.params;
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
});