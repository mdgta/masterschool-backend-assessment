import {Schema, model} from "mongoose";

const favoritePhotosSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,

	},
	url: String,
	description: String,
	username: String,
	explanation: String
});

export default model("FavoritePhoto", favoritePhotosSchema);