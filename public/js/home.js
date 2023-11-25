const postTextarea = document.getElementById("postTextarea");
const btnPost = document.getElementById("btnPost");
postTextarea.addEventListener("keyup", function (e) {
  const textBox = e.target;
  const value = textBox.value.trim();
  if (value == "") {
    btnPost.disabled = true;
    return;
  }
  btnPost.disabled = false;
});
getallpost();
async function getallpost() {
  const url = "http://localhost:3000/api/post";
  const response = await fetch(url);
  const posts = await response.json();
  posts.forEach((post) => {
    const messages = document.querySelector(".messages");
    const content = createPost(post);
    messages.innerHTML = content + messages.innerHTML;
  });
}
//save user post details
btnPost.addEventListener("click", function (e) {
  e.preventDefault();
  const url = "http://localhost:3000/api/post";
  const data = new URLSearchParams();
  data.append("content", postTextarea.value);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8"
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // console.log(xhr.responseText);
      const posts = JSON.parse(xhr.responseText);
      const messages = document.querySelector(".messages");
      const htmldata = createPost(posts);
      messages.insertAdjacentHTML("afterbegin", htmldata);
      postTextarea.value = "";
      btnPost.disabled = true;
    } else if (xhr.readyState === 4) {
      console.error("request failed with status: " + xhr.status);
    }
  };
  xhr.send(data);
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
            <!-----user comment start---->
              
            <!-----user comment end---->
            </div>
            
          </div>
        <!----comment End--->
        </div>  
      </div>    
    </div>`;
  return data;
}
//like
document.addEventListener("click", async function (event) {
  const target = event.target;
  if (target.classList.contains("likebtn")) {
    const likebtn = target;
    const postid = getpostid(likebtn);
    //console.log(postid);
    const uri = `http://localhost:3000/api/post/${postid}/like`;
    const response = await fetch(uri, { method: "PUT" });
    const posts = await response.json();
    // console.log(posts);
    likebtn.querySelector("span").textContent = posts.likes.length || "";
    if (posts.likes.includes(userLoggedIn._id)) {
      likebtn.classList.add("active");
    } else {
      likebtn.classList.remove("active");
    }
  }
});
//retweet
document.addEventListener("click", async function (event) {
  const target = event.target;
  if (target.classList.contains("retweetbtn")) {
    const likebtn = target;
    const postid = getpostid(likebtn);
    //console.log(postid);
    const uri = `http://localhost:3000/api/post/${postid}/retweet`;
    const response = await fetch(uri, { method: "POST" });
    const posts = await response.json();
    // console.log(posts);
    likebtn.querySelector("span").textContent = posts.retweets.length || "";
    if (posts.likes.includes(userLoggedIn._id)) {
      likebtn.classList.add("active");
    } else {
      likebtn.classList.remove("active");
    }
  }
});
function getpostid(element) {
  const isRoot = element.classList.contains("post");
  const rootelement = isRoot == "true" ? element : element.closest(".post");
  const postid = rootelement.dataset.id;
  if (postid === undefined) {
    return alert("Post Id Undefined");
  }
  return postid;
}

//comment
document.addEventListener("click", async function (event) {
  const target = event.target;
  if (target.classList.contains("trigger")) {
    const commentbtn = target;
    const postid = getpostid(commentbtn);
    //console.log(postid);
    const commentsection = commentbtn.parentElement.nextElementSibling;
    commentsection.classList.toggle("commentActive");
    if (commentsection.classList.contains("commentActive")) {
      //fetch User comment from DB
      const url = `/api/post/${postid}/usercomment`;
      const response = await fetch(url);
      const comments = await response.json();
      const commentcontainer =
        commentsection.querySelector(".comment-container");
      let htmlcomment = "";
      comments.forEach((comment) => {
        htmlcomment += `
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
      commentcontainer.innerHTML = htmlcomment;
    }
  }
  if (target.classList.contains("btnclear")) {
    const textarea = target.previousElementSibling;
    textarea.value = "";
    textarea.focus();
  }
  if (target.classList.contains("btnsend")) {
    const textarea = target.previousElementSibling.previousElementSibling;
    const postid = textarea.dataset.id;
    if (textarea.value.trim() != "") {
      const url = `/api/post/${postid}/comment`;
      const data = new URLSearchParams();
      data.append("comment", textarea.value.trim());
      const response = await fetch(url, { method: "POST", body: data });
      const comment = await response.json();
      const commentcontainer = textarea.parentElement.nextElementSibling;
      commentcontainer.innerHTML += `
            <div class="comment">
              <div class="user-pic">
                <img src="${
                  userLoggedIn.profilepic
                }" alt="profilepic" width="100px">
              </div>
              <div class="comment-body">
                <div class="comment-header">
                  <div class="username">
                    <a href="#">${userLoggedIn.name}</a>
                    <span>@${userLoggedIn.username}</span>
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
      textarea.value = "";
    } else {
      textarea.value = "";
      textarea.focus();
    }
  }
});
/************************************************************ */
function timeFormat(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHours = msPerMinute * 60;
  const msPerDay = msPerHours * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerMonth * 365;

  const diff = current - previous;
  if (diff < msPerMinute) {
    if (diff / 1000 < 30) return " Just now";
    return Math.round(diff / 1000) + " seconds ago";
  } else if (diff < msPerHours) {
    return Math.round(diff / msPerMinute) + " minutes ago";
  } else if (diff < msPerDay) {
    return Math.round(diff / msPerHours) + " hours ago";
  } else if (diff / msPerMonth) {
    return Math.round(diff / msPerDay) + " days ago";
  } else if (diff / msPerYear) {
    return Math.round(diff / msPerMonth) + " months ago";
  } else {
    return Math.round(diff / msPerYear) + " years ago";
  }
}
