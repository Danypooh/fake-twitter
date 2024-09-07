import { getNewPostData } from "./post/getData.js";
import { getPostsHtml } from "./post/getHtml.js";

document.addEventListener("DOMContentLoaded", function () {
  loadDOM();
});

function loadDOM() {
  if (isAuthenticated) {
    loadNewPostDOM();
  }
  loadAllPostDOM();
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

function loadAllPostDOM() {
  const postsView = document.querySelector("#posts-view");
  getPostsHtml("all");
}
