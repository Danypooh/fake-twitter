import { getCookie } from "./../utility.js";

function followRequest(event) {
  event.preventDefault();

  const url = "/follow";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include CSRF token in headers
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ target_user_id: profileId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update UI
        const followButton = document.querySelector("#follow-btn");
        followButton.textContent = data.following ? "Unfollow" : "Follow";
      } else {
        console.log(data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

export { followRequest };
