import { getAllPostsData } from "./getData.js";

function getPostsHtml(posts) {
  const postsContainer = document.querySelector("#posts-container");
  postsContainer.replaceChildren();

  // Calling a promise
  getAllPostsData(posts)
    .then((postsData) => {
      if (Array.isArray(postsData)) {
        postsData.forEach((post) => {
          const postLayout = getPostLayout(post);
          postsContainer.appendChild(postLayout);
        });
      } else {
        console.error("Posts data is not an array:", postsData);
      }
    })
    .catch((error) => {
      console.error("Failed to load posts:", error);
    });
}

function getPostLayout(post) {
  const item = document.createElement("div");
  item.className = "list-group-item list-group-item-action mb-2";
  item.style.cursor = "pointer";

  item.innerHTML = `
   <div class="card mb-4">
        <div class="card-header">
            <a class="nav-link" href="/${post.author}">
              <strong>${post.author}</strong>
            </a>
        </div>
        <div class="card-body">
            <a href="#" class="btn btn-sm btn-link">Edit</a>
            <p>${post.content}</p>
            <p class="text-muted">${post.created_at}</p>
            <span> <3 1</span> <a href="#" class="btn btn-sm btn-link">Comment</a>
        </div>
    </div>
  `;

  return item;
}

export { getPostsHtml };
