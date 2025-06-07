const UserModel = require("../db/userModel.js");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

module.exports.getUsers = async (req, res) => {
  try {
    const Users = await UserModel.find();
    res.status(200).json(Users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUserData = req.body;
    const username = newUserData.username;

    const existUsername = await UserModel.findOne({ username });
    if (existUsername) {
      return res.status(400).json({ message: "Username đã được sử dụng" });
    }

    const newUser = new UserModel(newUserData);
    newUser.password = md5(newUser.password);
    const savedUser = await newUser.save();

    return res.status(200).json(savedUser);
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: err.message });
  }
};


module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndRemove(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const User = await UserModel.findById(id);

    if (!User) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(User);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.postUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const User = await UserModel.findOne({ username });

    if (User) {
      if (md5(password) === User.password) {
        const userId = User._id;
        const secretKey = "key_hongnv";
        const expiresIn = "1h";

        const token = jwt.sign({ userId }, secretKey, { expiresIn }); // Tạo token
        return res.json({ success: true, token });
      }
    }
    res
      .status(401)
      .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
