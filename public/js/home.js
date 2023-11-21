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
  const img = post.postedby.profilepic;
  const activebtn = post.likes.includes(userLoggedIn._id) ? "active" : "";
  let date = new Date(post.createdAt);
  let data = `
  <div class="post" data-id='${post._id}'>
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
        <button><ion-icon name="chatbubble-outline"></ion-icon></button>
        <button class="retweetbtn"><ion-icon name="repeat-outline"></ion-icon></button>
        <button class="likebtn ${activebtn}">
          <ion-icon name="heart-outline"></ion-icon>
          <span>${post.likes.length || ""}</span>
        </button>
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
    console.log(posts);
    // likebtn.querySelector("span").textContent = posts.likes.length || "";
    // if (posts.likes.includes(userLoggedIn._id)) {
    //   likebtn.classList.add("active");
    // } else {
    //   likebtn.classList.remove("active");
    // }
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
/************************************************************ */
function timeFormat(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHours = msPerMinute * 60;
  const msPerDay = msPerHours * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerMonth * 365;

  const diff = current - previous;
  if (diff < msPerMinute) {
    if (diff / 1000 < 30) return "Just now";
    return Math.round(diff / 1000) + "seconds ago";
  } else if (diff < msPerHours) {
    return Math.round(diff / msPerMinute) + "minutes ago";
  } else if (diff < msPerDay) {
    return Math.round(diff / msPerHours) + "hours ago";
  } else if (diff / msPerMonth) {
    return Math.round(diff / msPerDay) + "days ago";
  } else if (diff / msPerYear) {
    return Math.round(diff / msPerMonth) + "months ago";
  } else {
    return Math.round(diff / msPerYear) + "years ago";
  }
}
