document.addEventListener("DOMContentLoaded", async function () {
  const url = `/api/post/${requested_postid}/single`;
  const response = await fetch(url);
  const postdetails = await response.json();
  console.log(postdetails);
  const messages = document.querySelector(".messages");
  messages.innerHTML = createPost(postdetails.post);
  loadcomments(postdetails.comments);
});

function createPost(post) {
  // console.log(new Date(post.createdAt));
  const isRetweet = post.retweetdata !== undefined;
  const Retweetedby = isRetweet ? post.postedby.username : null;
  post = isRetweet ? post.retweetdata : post;
  let retweettext = "";
  if (isRetweet) {
    retweettext = `
    <span>
      <ion-icon name="repeat-outline"></ion-icon>
      Retweeted by <a href='/profile/${Retweetedby}'>@${Retweetedby}</a>
    </span>  
    `;
  }
  const img = post.postedby.profilepic;
  const activebtn = post.likes.includes(userLoggedIn._id) ? "active" : "";
  const activeretbtn = post.retweets.includes(userLoggedIn._id) ? "active" : "";
  let date = new Date(post.createdAt);
  let data = `
  <div class="post" data-id='${post._id}'>
    <div class="retweettext">${retweettext}</div>
    <div class="content">
      <div class="user-pic" >
      <img src='${img}' alt='profile image' width="100px " >
      </div>
      <div class="message-container">
        <div class="header">
          <div class="username">
            <a herf="#">${post.postedby.name}</a>
            <span>@${post.postedby.username}</span>
          </div>
          <span class="time">${timeFormat(new Date(), date)}</span>
        </div>
        <div class="body">${post.content}</div>
          <div class="footer">
            <button class="trigger">
              <ion-icon name="chatbubble-outline"></ion-icon>
            </button>
            <button class="retweetbtn ${activeretbtn}">
              <ion-icon name="repeat-outline"></ion-icon>
              <span>${post.retweets.length || ""}</span>
            </button>
            <button class="likebtn ${activebtn}">
              <ion-icon name="heart-outline"></ion-icon>
              <span>${post.likes.length || ""}</span>
            </button>
          </div>
        <!---Comment---->
          <div class="comment-section" data-id='${post._id}'>
            <div class="textareadiv">
              <textarea 
                placeholder="Your Comments" 
                class="txtcomment" 
                data-id='${post._id}'></textarea>
                <ion-icon name="close-outline" class="btnclear"></ion-icon>  
              <button class="btnsend">
                Send<ion-icon name="send-outline"></ion-icon></button>
            </div>
            <div class="comment-container">
              <div class="comments">
              </div>
            </div>  
          </div>
        <!----comment End--->
        </div>  
      </div>    
    </div>`;
  return data;
}
//load comments
function loadcomments(comments) {
  const commentcontainer = document.querySelector(".comments");
  console.log(commentcontainer);
  comments.forEach((comment) => {
    commentcontainer.innerHTML += `
          <div class="comment">
            <div class="user-pic">
              <img src="${
                comment.commentBy.profilepic
              }" alt="profilepic" width="100px">
            </div>
            <div class="comment-body">
              <div class="comment-header">
                <div class="username">
                  <a href="#">${comment.commentBy.name}</a>
                  <span>@${comment.commentBy.username}</span>
                </div>
                <span class="time">${timeFormat(
                  new Date(),
                  new Date(comment.createdAt)
                )}</span>
              </div>
              <div class="comment-message">
                <p>${comment.comment}</p>
              </div>
            </div>
          </div>
    `;
  });
}
