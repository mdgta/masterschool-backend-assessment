import express from "express";
import {getPhotos, getPhotoById, getPhotosByUser} from "../controllers/photoController.js";

const router = express.Router();

router.get("/", getPhotos);
router.get("/:id", getPhotoById);
router.get("/user/:username", getPhotosByUser);

export default router;