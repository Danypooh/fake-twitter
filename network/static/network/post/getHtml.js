import { getAllPostsData, savePostEdit, toggleLike } from "./getData.js";

async function getPostsHtml(posts) {
  const postsContainer = document.querySelector("#posts-container");
  postsContainer.replaceChildren();

  try {
    const postsData = await getAllPostsData(posts); // Wait for data to be fetched
    if (Array.isArray(postsData)) {
      postsData.forEach((post) => {
        const postLayout = getPostLayout(post);
        postsContainer.appendChild(postLayout);
      });
    } else {
      console.error("Posts data is not an array:", postsData);
    }
  } catch (error) {
    console.error("Failed to load posts:", error);
  }
}

function getPostLayout(post) {
  const item = document.createElement("div");
  item.className = "list-group-item list-group-item-action mb-2";
  item.style.cursor = "pointer";

  const isAuthor = userID === post.author_id;
  const editButtonHtml = isAuthor
    ? `<button class="btn btn-sm btn-link edit" data-post-id="${post.post_id}">Edit</button>`
    : "";

  const likeButtonHtml = `
       <div>
         <button class="btn btn-sm like" data-like-id="${post.post_id}">
            <span class="heart-icon" id="heart-icon-${
              post.post_id
            }" style="color: ${post.liked ? "red" : "gray"};">&#9829;</span>
         </button>
         <span class="like-count" id="like-count-${post.post_id}">
            ${post.likes}
         </span>
       </div>
      `;

  item.innerHTML = `
    <div class="card mb-4">
         <div class="card-header">
             <a class="nav-link" href="/${post.author}">
               <strong>${post.author}</strong>
             </a>
         </div>
         <div class="card-body">
             ${editButtonHtml}
             <p id="post-content-${post.post_id}">${post.content}</p>
             <p class="text-muted">${post.created_at}</p>
             ${likeButtonHtml}
             <a href="#" class="btn btn-sm btn-link">Comment</a>
         </div>
     </div>
   `;

  return item;
}

function getEditPostHtml(event) {
  event.preventDefault();

  const postId = this.getAttribute("data-post-id");
  getEditPostLayout(postId);
}

function getEditPostLayout(postId) {
  const postContentDiv = document.querySelector(`#post-content-${postId}`); // Get the post content div

  // Store the current content
  const originalContent = postContentDiv.innerHTML;

  // Replace the content with an editable form
  postContentDiv.innerHTML = `
    <textarea id="edit-content-${postId}" class="form-control mb-2">${originalContent}</textarea>
    <button class="btn btn-primary btn-sm save-edit" data-post-id="${postId}">Save</button>
    <button class="btn btn-secondary btn-sm cancel-edit" data-post-id="${postId}">Cancel</button>
  `;

  // Add event listeners for saving and canceling edits
  document.querySelector(".save-edit").addEventListener("click", savePostEdit);
  document.querySelector(".cancel-edit").addEventListener("click", function () {
    postContentDiv.innerHTML = originalContent; // Restore the original content if canceled
  });
}

function getLikePostHtml(event) {
  event.preventDefault();

  const postId = this.getAttribute("data-like-id");
  toggleLike(postId);
}

export { getPostsHtml, getPostLayout, getEditPostHtml, getLikePostHtml };
