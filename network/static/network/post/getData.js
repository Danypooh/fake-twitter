import { getFormObject, getCookie } from "./../utility.js";

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
      //load_posts()
      console.log("RESULT:", result);
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
