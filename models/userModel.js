import {Schema, model} from "mongoose";

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, "username required"]
	},
	email: {
		type: String,
		required: [true, "email required"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "password required"]
	},
	badTokens: {
		type: Array,
		default: []
	}
}, {
	timestamps: true
});

export default model("User", userSchema);