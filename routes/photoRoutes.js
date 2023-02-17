import express from "express";
import {getPhotos, getPhotoById} from "../controllers/photoController.js";

const router = express.Router();

router.get("/", getPhotos);
router.get("/:id", getPhotoById);

export default router;