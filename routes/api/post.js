const express = require("express");
const router = express.Router();
const User = require("../../schemas/usersschema");
const Post = require("../../schemas/postschema");
//to get post details
router.get("/", (req, res) => {
  Post.find()
    .populate("postedby")
    .populate("retweetdata")
    .sort({ createAt: 1 })
    .then(async (results) => {
      results = await User.populate(results, { path: "retweetdata.postedby" });
      return res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});
//to save post details
router.post("/", async (req, res) => {
  if (!req.body.content.trim()) {
    console.log("content not found");
    return res.sendStatus(400);
  }
  const postdata = {
    content: req.body.content,
    postedby: req.session.navin,
  };
  Post.create(postdata).then(async (newPost) => {
    newPost = await User.populate(newPost, { path: "postedby" });
    return res.status(200).send(newPost);
  });
});
//like post
router.put("/:id/like", async (req, res) => {
  const postid = req.params.id;
  const userid = req.session.navin._id;
  const isliked =
    req.session.navin.likes && req.session.navin.likes.includes(postid);
  const option = isliked ? "$pull" : "$addToSet";
  req.session.navin = await User.findByIdAndUpdate(
    userid,
    {
      [option]: { likes: postid },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });
  const post = await Post.findByIdAndUpdate(
    postid,
    {
      [option]: { likes: userid },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });

  res.status(200).send(post);
});
//retweet
router.post("/:id/retweet", async (req, res) => {
  const postid = req.params.id;
  const userid = req.session.navin._id;
  //delete if already retweet
  const deletePost = await Post.findOneAndDelete({
    postedby: userid,
    retweetdata: postid,
  }).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });
  let repost = deletePost;
  if (repost == null) {
    repost = await Post.create({ postedby: userid, retweetdata: postid }).catch(
      (err) => {
        console.log(err);
        req.sendStatus(400);
      }
    );
  }
  const option = deletePost ? "$pull" : "$addToSet";
  req.session.navin = await User.findByIdAndUpdate(
    userid,
    {
      [option]: { retweets: repost._id },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });
  const post = await Post.findByIdAndUpdate(
    postid,
    {
      [option]: { retweets: userid },
    },
    { new: true }
  ).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });
  res.status(200).send(post);
});
module.exports = router;
