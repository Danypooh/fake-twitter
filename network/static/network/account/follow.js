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
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // Update the follow/unfollow button text
        const followButton = document.querySelector("#follow-btn");
        followButton.value = data.following ? "Unfollow" : "Follow";

        // Update follower/following counts dynamically
        const followersCountElement =
          document.querySelector("#followers-count");
        const followingCountElement =
          document.querySelector("#following-count");

        // Assuming the backend returns updated counts in `data`
        followersCountElement.textContent = `Followers: ${data.followers_count}`;
        followingCountElement.textContent = `Following: ${data.following_count}`;
      } else {
        console.log(data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

export { followRequest };
