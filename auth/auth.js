const jwt = require("jsonwebtoken");
const UserModel = require("../db/userModel"); // ⚠️ import thêm dòng này

module.exports.requiredAuth = async function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const secretKey = "key_hongnv";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không có mã thông báo",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Mã thông báo đã giải mã:", decoded);

    // ⚠️ Tìm user trong MongoDB
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // ✅ Trả thêm thông tin người dùng
    return res.status(200).json({
      success: true,
      message: "Xác thực thành công",
      userId: user._id,
      UserName: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (err) {
    console.log("Lỗi xác thực:", err);
    return res.status(403).json({
      success: false,
      message: "Mã thông báo không hợp lệ hoặc đã hết hạn",
    });
  }
};

// const jwt = require("jsonwebtoken");
// const UserModel = require("../db/userModel");

// module.exports.requiredAuth = async function (req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   const secretKey = "key_hongnv";

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Không có mã thông báo",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);

//     const user = await UserModel.findById(decoded.userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy người dùng",
//       });
//     }

//     // ✅ Gắn thông tin user vào req để dùng ở controller
//     req.user = user;
//     req.userId = user._id;
//     next(); // --> tiếp tục sang controller
//   } catch (err) {
//     console.log("Lỗi xác thực:", err);
//     return res.status(403).json({
//       success: false,
//       message: "Mã thông báo không hợp lệ hoặc đã hết hạn",
//     });
//   }
// };
