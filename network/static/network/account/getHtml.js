import { getProfileData } from "./getData.js";

function getFollowButtonHtml(profile_id) {
  const form = document.querySelector("#follow-form");

  getProfileData(profile_id)
    .then((profileData) => {
      const followLayout = getFollowButtonLayout(profileData);
      form.appendChild(followLayout);
    })
    .catch((error) => {
      console.error("Failed to load profile data:", error);
    });
}

function getFollowButtonLayout(profile) {
  const button = document.createElement("input");
  button.id = "follow-btn";
  button.className = "btn btn-primary";
  button.type = "submit";
  button.value = profile.following ? "Unfollow" : "Follow";

  return button;
}

function getProfileHtml(profile_id) {
  const profileContainer = document.querySelector("#profile-container");
  profileContainer.replaceChildren();

  // Calling a promise
  getProfileData(profile_id)
    .then((profileData) => {
      const profileLayout = getProfileLayout(profileData);
      profileContainer.appendChild(profileLayout);
    })
    .catch((error) => {
      console.error("Failed to load profile data:", error);
    });
}

function getProfileLayout(profile) {
  const item = document.createElement("div");
  item.className = "row mt-3";

  item.innerHTML = `
    <div class="col-md-6">
        <h4>Followers: ${profile.followers_count}</h4>
    </div>
    <div class="col-md-6">
        <h4>Following: ${profile.following_count}</h4>
    </div>
  `;

  return item;
}

export { getProfileHtml, getFollowButtonHtml };
