const express = require("express");
const router = express.Router();
const {
  getPhotos,
  getPhotoById,
  getCountPT,
  UploadPhoto,
  writeCM,
  getOnePhoto
} = require("../controllers/PhotoController.js");
const { requiredAuth } = require("../auth/auth.js");

router.post("/photo", UploadPhoto);
router.post("/comment", writeCM);


router.get("/", getPhotos);
router.get("/:id", getPhotoById);
router.get("/getCountPT/:id", getCountPT);
router.get("/:id/:photoId", getOnePhoto);

module.exports = router;
