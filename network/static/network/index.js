import { getFormObject } from "./utility.js";

document.addEventListener("DOMContentLoaded", function () {
  loadDOM();
});

function loadDOM() {
  loadNewPostDOM();
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

// Function to get CSRF token from the cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
