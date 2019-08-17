"user strict";
// mongoose
const User = require("../model/User");

// help
const { uploadFile } = require("../utils/upload");

exports.addUser = function*() {
  this.body = "ok";

  // let user = yield User.find({ name });
  // if (user) this.body = { err: "Tên đã tồn tại" };
  // else {
  //   let result = { success: false };
  //   let serverFilePath = path.join(__dirname, "upload-files");
  //   ctx = this;
  //   result = yield uploadFile(ctx, {
  //     fileType: "album", // common or album
  //     path: serverFilePath
  //   });

  //   ctx.body = result;
  // }
};
