const { now } = require("mongoose");
const PhotoModel = require("../db/photoModel.js");

module.exports.getPhotos = async (req, res) => {
  try {
    const Photos = await PhotoModel.find();
    res.status(200).json(Photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.createPhoto = async (req, res) => {
  try {
    const newPhotoData = req.body;

    const newPhoto = new PhotoModel(newPhotoData);
    const savedPhoto = await newPhoto.save();

    res.status(201).json(savedPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPhoto = await PhotoModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedPhoto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPhoto = await PhotoModel.findByIdAndRemove(id);

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports.getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Populate thông tin người viết comment (first_name, last_name)
    const photos = await PhotoModel.find({ user_id: id }).populate(
      "comments.user_id",
      "first_name last_name"
    );

    if (!photos || photos.length === 0) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.status(200).json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getOnePhoto = async (req, res) => {
  try{
    const{ id, photoId } = req.params;
    const photo = await PhotoModel.findOne({
      _id: photoId,
      user_id: id
    });
    if (!photo) {
      return res.status(404).json({ message: "Photo not found for this user." });
    }
    return res.status(200).json(photo);
    } catch (err){
      res.status(500).json({ error: err.message });
    }
}

module.exports.getCountPT = async (req, res) => {
  try {
    const { id } = req.params;
    const photoCount = await PhotoModel.countDocuments({ user_id: id });
    const photos = await PhotoModel.find({ user_id: id });
    const totalComments = photos.reduce((total, photo) => {
      if (photo.comments) {
        return total + photo.comments.length;
      } else {
        return total;
      }
    }, 0);
    res.status(200).json({ count: photoCount, totalComments: totalComments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports. UploadPhoto = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ error: "No photo uploaded" });
    }

    const uploadedFile = req.files.photo[0];

    const newPhoto = new PhotoModel({
      file_name: uploadedFile.path,
      user_id: req.body.userId,
      date_time: Date.now(),
      // comments: req.body.comment,
    });
    console.log(req.body);
    const savedPhoto = await newPhoto.save();
    return res.status(201).json({
      message: "Photo uploaded successfully",
      photo: savedPhoto,
      photo_id: savedPhoto._id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.writeCM = async (req, res) => {
  try {
    const { photoId, comment ,user_id} = req.body;
    console.log(photoId);
    console.log(user_id);

    const Photo = await PhotoModel.findOne({ _id: photoId });
    const newComment = {
      comment: comment,
      user_id: user_id, // Thêm user_id vào comment
      date_time: Date.now(), // Thêm thời gian hiện tại
    };
    Photo?.comments?.push(newComment);
    const updatedPhoto = await Photo.save();
    res.status(200).json({ success: true, photo: updatedPhoto });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};





