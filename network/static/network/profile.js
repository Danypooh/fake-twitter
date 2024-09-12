import { getProfileHtml, getFollowButtonHtml } from "./account/getHtml.js";
import { followRequest } from "./account/follow.js";
import { getNewPostData } from "./post/getData.js";
import { getPostsHtml } from "./post/getHtml.js";

document.addEventListener("DOMContentLoaded", function () {
  loadDOM();
});

function loadDOM() {
  if (isAuthenticated) {
    if (isUserProfile) {
      loadNewPostDOM();
    } else {
      loadFollowPostDOM();
    }
  }
  loadProfileDOM();
  loadAllUserPostDOM();
}

function loadProfileDOM() {
  getProfileHtml(profileId);
}

function loadFollowPostDOM() {
  const followForm = document.querySelector("#follow-form");
  getFollowButtonHtml(profileId);

  followForm.removeEventListener("submit", followRequest);
  followForm.addEventListener("submit", followRequest);
}

function loadNewPostDOM() {
  document.querySelector("#compose-body").value = "";

  document
    .querySelector("#compose-form")
    .removeEventListener("submit", getNewPostData);
  document
    .querySelector("#compose-form")
    .addEventListener("submit", getNewPostData);
}

function loadAllUserPostDOM() {
  const postsView = document.querySelector("#posts-view");
  getPostsHtml(profileUser);
}
