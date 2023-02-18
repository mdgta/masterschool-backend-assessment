import express from "express";
import {get, add, edit, remove} from "../controllers/favoritesController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.route("/")
	.get(get)
	.post(add);

router.route("/:id")
	.patch(edit) // using patch rather put because this is only for updating a specific field
	.delete(remove);

export default router;