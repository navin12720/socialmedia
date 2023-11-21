const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userschema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilepic: { type: String, default: "/images/male.png" },
    likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    retweets: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true, versionKey: false }
);
const User = mongoose.model("User", userschema);
module.exports = User;
