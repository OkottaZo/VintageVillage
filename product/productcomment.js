// 1. Read comments from localStorage
function getComments() {
    const comments = localStorage.getItem("product_comments");
    return comments ? JSON.parse(comments) : [];
}

// 2. Save comments to localStorage
function saveComments(comments) {
    localStorage.setItem("product_comments", JSON.stringify(comments));
}

// 3. Display comments on the page
function displayComments() {
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "";

    const comments = getComments();

    comments.forEach(comment => {
        const div = document.createElement("div");
        div.className = "comment";

        div.innerHTML = `
            <strong>${comment.name}</strong>
            <p>${comment.text}</p>
        `;

        commentsList.appendChild(div);
    });
}

// 4. Handle comment submission
document.getElementById("comment-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("comment-name").value;
    const text = document.getElementById("comment-text").value;

    const newComment = {
        name: name,
        text: text
    };

    const comments = getComments();
    comments.push(newComment);
    saveComments(comments);

    displayComments();
    this.reset();
});

// 5. Load comments when page loads
displayComments();
