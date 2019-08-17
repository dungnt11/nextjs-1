const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true }
  },
  age: {
    type: Number,
    required: true,
    index: true
  },
  avatar: {
    type: String,
    index: true,
    default: "no-avatar.jpg"
  },
  update: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// ghi lai thoi gian cap nhat
UserSchema.pre("save", function(next) {
  this.updated = Date.now();
  next();
});

// tim kiem user duy nhat
UserSchema.static.findByUser = function(name) {
  return this.findOne({ name });
};

module.exports = User = mongoose.model("users", UserSchema);
