const fs = require("fs");
const path = require("path");
// mongoose
const User = require("../model/User");

function upload(file) {
  const exFile = file.name.split(".")[file.name.split(".").length - 1];
  const typeFile = file.type === "image/jpeg" || "image/png" || "image/jpg";
  const randomName =
    Math.round(Math.random() * 10000000000).toString() + "." + exFile;

  if (!typeFile) throw { file: "Chỉ chấp nhận file ảnh" };

  // tien hanh upload anh
  const reader = fs.createReadStream(file.path);
  const stream = fs.createWriteStream(
    path.join(__dirname, "../uploads", randomName)
  );
  reader.pipe(stream);
  return randomName;
}

exports.addUser = async function(ctx) {
  try {
    const { name, age } = ctx.request.body;

    // xu ly name unique
    let user = await User.findOne({ name });
    if (user) throw { name: "Tên người dùng đã tồn tại" };

    const file = ctx.request.files.avatar;
    let randomName = await upload(file);

    // add user to database
    let _n = {
      name,
      age,
      avatar: randomName
    };

    let newUser = await new User(_n).save();

    ctx.body = { newUser };
  } catch (err) {
    ctx.response.status = 400;
    ctx.body = err;
  }
};

exports.editUser = async function(ctx) {
  try {
    const { name, age } = ctx.request.body;
    // get info user
    let user = await User.findOne({ name });
    if (!user) throw { name: "Không tồn tại user" };

    // delete file on server
    const avatarFile = ctx.request.files.avatar;
    if (avatarFile) {
      // xoa file
      const filePatch = path.join(__dirname, "../uploads/" + user.avatar);
      fs.unlinkSync(filePatch);
      let randomName = await upload(avatarFile);

      // add user to database
      let _n = {
        name,
        age,
        avatar: randomName
      };

      let editUserDone = await User.findOneAndUpdate(
        { name },
        { $set: _n },
        { new: true }
      );

      ctx.body = { user: editUserDone };
    }
  } catch (err) {
    ctx.response.status = 400;
    ctx.body = err;
  }
};

exports.getUser = async function(ctx) {
  try {
    let user = await User.find();
    ctx.body = { user };
  } catch (err) {
    ctx.response.status = 400;
    ctx.body = err;
  }
};
