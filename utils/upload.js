const inspect = require("util").inspect;
const path = require("path");
const fs = require("fs");
const Busboy = require("busboy");

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 *
 * @desc lấy phần mở rộng tên file
 */

function getSuffixName(fileName) {
  let nameList = fileName.split(".");
  return nameList[nameList.length - 1];
}

/**
 *
 * @desc Thực hiện upload
 */
function uploadFile(ctx, options) {
  let req = ctx.req;
  let res = ctx.res;
  let busboy = new Busboy({ headers: req.headers });

  let fileType = options.fileType || "common";
  let filePath = path.join(options.path, fileType);

  return new Promise((resolve, reject) => {
    console.log("upload start");
    let result = {
      success: false,
      formData: {}
    };

    // xử lý file
    busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
      // tạo tên file
      let fileName =
        Math.random()
          .toString(16)
          .substr(2) +
        "." +
        getSuffixName(filename);

      let _uploadFilePath = path.join(filePath, fileName);
      let saveTo = path.join(_uploadFilePath);

      // chuyển cho ông tiếp theo
      file.pipe(fs.createWriteStream(saveTo));

      file.on("end", function() {
        result.success = true;
        result.message = "upload success";

        console.log("upload success！");
        resolve(result);
      });
    });

    // xử lý các trường khác
    busboy.on("field", function(
      fieldname,
      val,
      fieldnameTruncated,
      valTruncated,
      encoding,
      mimetype
    ) {
      result.formData[fieldname] = inspect(val);
    });

    // Xử lý hoàn tất
    busboy.on("finish", function() {
      resolve(result);
    });

    // bắt lỗi
    busboy.on("error", function(err) {
      reject(result);
    });

    req.pipe(busboy);
  });
}

module.exports = {
  uploadFile
};
