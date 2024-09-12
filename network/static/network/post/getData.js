import { getFormObject, getCookie } from "./../utility.js";
import { getPostLayout } from "./getHtml.js";

function getNewPostData(event) {
  event.preventDefault();
  const formObject = getFormObject(event.target);

  const url = "/posts";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include CSRF token in headers
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify(formObject),
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      const newPostLayout = getPostLayout(result.post);

      const postContainer = document.querySelector("#posts-container");
      postContainer.prepend(newPostLayout);

      // Clear the textarea after a successful post
      const textarea = document.querySelector("#compose-body");
      if (textarea) {
        textarea.value = "";
      }
    })
    .catch((error) => console.error("Error:", error));
}

function getAllPostsData(posts) {
  const url = `/posts/${posts}`;

  // fetch posts
  const allPosts = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((posts) => {
      return posts;
    })
    .catch((error) => {
      console.error("Error: ", error);
      return [];
    });

  return allPosts;
}

export { getNewPostData, getAllPostsData };
