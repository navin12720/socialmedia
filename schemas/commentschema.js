const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = new Schema(
  {
    comment: { type: String, required: true, trim: true },
    commentBy: { type: Schema.Types.ObjectId, ref: "User" },
    commentTo: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true, versionKey: false }
);
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
