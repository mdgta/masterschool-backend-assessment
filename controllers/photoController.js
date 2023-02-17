import axios from "axios"
import asyncHandler from "express-async-handler";

// fetch photo or photos (if id provided return single item; if omitted, return array)
const fetchToPhotos = async (id) => {
	const {UNSPLASH_URI, UNSPLASH_ACCESS_KEY} = process.env;
	const url = `${UNSPLASH_URI}/photos${typeof id !== "undefined" ? `/${id}` : ""}`;
	const response = await axios.get(url, {
		headers: {
			"Accept-Version": "v1",
			"Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`
		}
	});
	return response.data;
}

// get all photos
export const getPhotos = asyncHandler(async (req, res) => {
	try {
		const photos = await fetchToPhotos();
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
		const photos = await fetchToPhotos(id);
		res.status(200).json(photos);
	} catch (err) {
		console.error({err});
		res.status(500).json({message: "Server error. Please try again later."});
	}
});