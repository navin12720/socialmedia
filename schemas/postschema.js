const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postschema = new Schema(
  {
    content: { type: String, trim: true },
    postedby: { type: Schema.Types.ObjectId, ref: "User" },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweets: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetdata: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true, versionKey: false }
);
const Post = mongoose.model("Post", postschema);
module.exports = Post;
