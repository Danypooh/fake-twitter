document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#compose-body").value = "";

  document
    .querySelector("#compose-form")
    .removeEventListener("submit", newPost);
  document.querySelector("#compose-form").addEventListener("submit", newPost);
});

function newPost(event) {
  event.preventDefault();

  // Create a special FormData object from the form
  const formData = new FormData(event.target);

  // Convert FormData to a regular object
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  // Remove csrfmiddlewaretoken from formObject
  delete formObject["csrfmiddlewaretoken"];

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
