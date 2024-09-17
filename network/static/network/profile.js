import { getProfileHtml, getFollowButtonHtml } from "./account/getHtml.js";
import { followRequest } from "./account/follow.js";
import { getNewPostData } from "./post/getData.js";
import {
  getPostsHtml,
  getEditPostHtml,
  getLikePostHtml,
} from "./post/getHtml.js";

document.addEventListener("DOMContentLoaded", function () {
  loadDOM();
});

async function loadDOM() {
  if (isAuthenticated) {
    if (isUserProfile) {
      loadNewPostDOM();
    } else {
      loadFollowPostDOM();
    }
  }
  loadProfileDOM();
  await loadAllUserPostDOM();
  loadEditPostDOM();
  if (isAuthenticated) {
    loadLikePostDOM();
  }
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

async function loadAllUserPostDOM() {
  try {
    await getPostsHtml(profileUser); // Wait for posts to be loaded
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

function loadEditPostDOM() {
  const edit = document.querySelector(".edit");
  if (edit) {
    document.querySelectorAll(".edit").forEach((element) => {
      element.removeEventListener("click", getEditPostHtml);
      element.addEventListener("click", getEditPostHtml);
    });
  }
}

function loadLikePostDOM() {
  const like = document.querySelector(".like");
  if (like) {
    document.querySelectorAll(".like").forEach((element) => {
      element.removeEventListener("click", getLikePostHtml);
      element.addEventListener("click", getLikePostHtml);
    });
  }
}
