import axios from "axios"
import asyncHandler from "express-async-handler";

// fetch photo or photos (if id provided return single item; if omitted, return array)
const unsplashFetch = async (extraPath, params) => {
	const {UNSPLASH_URI, UNSPLASH_ACCESS_KEY} = process.env;
	let url = `${UNSPLASH_URI}${extraPath ?? ""}`;
	const config = {
		headers: {
			"Accept-Version": "v1",
			"Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`
		}
	};
	// add optional parameters (might not even use this...)
	if (params instanceof Object) {
		config.params = params;
	}
	const response = await axios.get(url, config);
	return response.data;
}

// reduce single photo object
const reducePhotoObject = ({id, user, description, urls}) => {
	return {
		id,
		user: user.name,
		description: description ?? "No description provided.",
		url: urls.raw
	}
}

// get all photos
export const getPhotos = asyncHandler(async (req, res) => {
	try {
		const photos = await unsplashFetch("/photos");
		res.status(200).json(photos);
	} catch (err) {
		console.error({err});
		res.status(500).json({message: "Server error. Please try again later."});
	}
});

// get photo by id
export const getPhotoById = asyncHandler(async (req, res) => {
	try {
		const {id} = req.params;
		const photos = await unsplashFetch(`/photos/${id}`);
		res.status(200).json(photos);
	} catch (err) {
		console.error({err});
		res.status(500).json({message: "Server error. Please try again later."});
	}
});

///
// get photo by id
export const getPhotosByUser = asyncHandler(async (req, res) => {
	try {
		const {username} = req.params;
		const photos = await unsplashFetch(`/users/${encodeURIComponent(username)}/photos`);
		const reducedPhotos = photos.map(reducePhotoObject);
		res.status(200).json(reducedPhotos);
	} catch (err) {
		console.error({err});
		const {message} = err;
		res.status(500).json({message});
	}
});