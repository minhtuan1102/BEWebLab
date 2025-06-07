const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
  username: { type: String },
  password: { type: String },
});
 
module.exports = mongoose.model.Users || mongoose.model("Users", UserModel);
