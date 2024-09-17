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
    loadNewPostDOM();
  }
  await loadAllPostDOM();
  loadEditPostDOM();
  if (isAuthenticated) {
    loadLikePostDOM();
  }
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

async function loadAllPostDOM() {
  try {
    if (followingPosts) {
      await getPostsHtml("following");
    } else {
      await getPostsHtml("all");
    }
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
