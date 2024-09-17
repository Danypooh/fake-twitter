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

async function savePostEdit(event) {
  event.preventDefault();

  // Get the post ID from the button's data attribute
  const postId = this.getAttribute("data-post-id");
  // Get the new content from the textarea
  const newContent = document.querySelector(`#edit-content-${postId}`).value;

  const url = `/posts/${postId}/edit/`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ content: newContent }),
    });

    if (!response.ok) {
      throw new Error("Failed to save post");
    }

    // Update the post content in the DOM
    const postContentDiv = document.querySelector(`#post-content-${postId}`);
    postContentDiv.innerHTML = newContent;
  } catch (error) {
    console.error("Error saving post:", error);
  }
}

async function toggleLike(postId) {
  const url = `/posts/${postId}/like`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    if (response.ok) {
      const result = await response.json();

      const heartIcon = document.querySelector(`#heart-icon-${postId}`);
      const likeCount = document.querySelector(`#like-count-${postId}`);

      likeCount.textContent = result.likes;

      // Toggle the heart icon color (filled or outline)
      if (result.liked) {
        heartIcon.style.color = "red";
      } else {
        heartIcon.style.color = "gray";
      }
    } else {
      console.error("Failed to toggle like", result.error);
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}

export { getNewPostData, getAllPostsData, savePostEdit, toggleLike };
