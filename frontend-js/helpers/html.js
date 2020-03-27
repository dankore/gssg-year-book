export default class ReuseableHtml {
  constructor() {
    //
  }
}

ReuseableHtml.prototype.li = data => {
  const li = document.createElement("li");
  li.id = "li-comment";
  li.classList.add("my-2", "p-2", "rounded");

  const divCommentPhoto = document.createElement("div");
  divCommentPhoto.classList.add("flex");

  const divPhoto = document.createElement("div");
  divPhoto.classList.add("flex", "mr-1");

  const link = document.createElement("a");
  link.setAttribute("href", `/profile/${data.visitorEmail}`);

  const img = document.createElement("img");
  img.setAttribute("src", `${data.photo}`);
  img.classList.add("w-8", "h-8", "rounded-full");
  img.setAttribute("alt", "profile pic");

  // DIV FIRST NAME AND COMMENT AND LINK
  const firstNameCommentDiv = document.createElement("div");
  firstNameCommentDiv.classList.add("rounded", "px-2");
  firstNameCommentDiv.setAttribute(
    "style",
    "overflow-wrap:break-word;min-width:0px;width:15rem;background-color:#F2F3F5;"
  );
  const link2 = document.createElement("a");
  link2.setAttribute("href", `${data.photo}`);
  link2.classList.add("font-medium");
  link2.innerText = `${data.visitorFirstName}`;
  const commentBox = document.createElement("p");
  commentBox.innerText = `${data.comment}`;

  // DATE, EDIT, DELETE
  // WRAPPER DIV
  const dateEditDeleteDiv = document.createElement("div");
  dateEditDeleteDiv.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "mt-2",
    "text-xs"
  );
  // COMMENT DATE CONTAINER
  const commentDateBox = document.createElement("p");
  commentDateBox.innerText = `${data.commentDate}`;

  // EDIT AND DELETE BUTTONS WRAPPER
  const editDeleteWrapper = document.createElement("div");
  editDeleteWrapper.classList.add("flex");

  // EDIT BUTTON
  const editLabel = document.createElement("label");
  editLabel.setAttribute("for", "edit-comment-button");
  editLabel.classList.add("flex", "items-center", "cursor-pointer");

  const inputEdit = document.createElement("input");
  inputEdit.setAttribute("type", "button");
  inputEdit.setAttribute("value", "Edit");
  inputEdit.id = "edit-comment-button";
  inputEdit.classList.add("flex", "bg-white", "items-center", "cursor-pointer");

  // DELETE BUTTON
  const deleteLabel = document.createElement("label");
  deleteLabel.setAttribute("for", "delete-comment-button");
  deleteLabel.classList.add("flex", "items-center", "ml-2", "cursor-pointer");

  const inputDelete = document.createElement("input");
  inputDelete.setAttribute("type", "button");
  inputDelete.setAttribute("value", "Delete");
  inputDelete.setAttribute("data-id", `${data.commentId}`);
  inputDelete.id = "delete-comment-button";
  inputDelete.classList.add(
    "flex",
    "bg-white",
    "items-center",
    "cursor-pointer"
  );
  // DATE, EDIT, DELETE ENDS

  // EDIT COMMENT FORM
  const editCommentWrapper = document.createElement("div");
  editCommentWrapper.id = "edit-comment-container";
  editCommentWrapper.classList.add("absolute", "w-full", "-ml-2", "-mt-10");
  editCommentWrapper.style.display = "none";
  // INPUT
  const editcommentInput = document.createElement("input");
  editcommentInput.setAttribute("type", "text");
  editcommentInput.setAttribute("value", `${data.comment}`);
  editcommentInput.classList.add(
    "w-full",
    "p-2",
    "bg-gray-200",
    "border",
    "border-blue-400",
    "rounded"
  );
  // INPUT HIDDEN
  const editcommentInputHidden = document.createElement("input");
  editcommentInputHidden.setAttribute("type", "hidden");
  editcommentInputHidden.setAttribute("value", `${data.commentId}`);
  // CANCEL AND UPDATE BUTTONS
  // WRAPPER
  const editCommentControlsWrapper = document.createElement("div");
  editCommentControlsWrapper.classList.add("flex", "justify-between");
  // CANCEL BUTTON
  const editCommentCancelButton = document.createElement("button");
  editCommentCancelButton.id = "cancel-edit-comment";
  editCommentCancelButton.classList.add(
    "bg-green-600",
    "text-white",
    "px-2",
    "rounded"
  );
  const editCommentCancelButtonText = document.createTextNode("Cancel");
  editCommentCancelButton.appendChild(editCommentCancelButtonText);
  // UPDATE BUTTON
  const editCommentUpdateButton = document.createElement("button");
  editCommentUpdateButton.id = "update-comment";
  editCommentUpdateButton.classList.add(
    "bg-blue-600",
    "text-white",
    "px-2",
    "rounded"
  );
  const editCommentUpdateButtonText = document.createTextNode("Update");
  editCommentUpdateButton.appendChild(editCommentUpdateButtonText);
  // EDIT COMMENT FORM ENDS

  // APPEND SECTION
  link.appendChild(img);
  divPhoto.appendChild(link);

  firstNameCommentDiv.appendChild(link2);
  firstNameCommentDiv.appendChild(commentBox);

  divCommentPhoto.appendChild(divPhoto);
  divCommentPhoto.appendChild(firstNameCommentDiv);

  dateEditDeleteDiv.appendChild(commentDateBox);
  editLabel.appendChild(inputEdit);
  editLabel.innerHTML =
    `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="15"
        height="15"
    >
        <path
        fill="green"
        class="heroicon-ui"
        d="M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z"
        />
    </svg>` + editLabel.innerHTML;
  deleteLabel.appendChild(inputDelete);
  deleteLabel.innerHTML =
    `<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="15"
        height="15"
        >
        <path
            fill="red"
            class="heroicon-ui"
            d="M8 6V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2h5a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8H3a1 1 0 1 1 0-2h5zM6 8v12h12V8H6zm8-2V4h-4v2h4zm-4 4a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1z"
        />
    </svg>` + deleteLabel.innerHTML;
  // ADD LABELS TO WRAPPER DIV
  editDeleteWrapper.appendChild(editLabel);
  editDeleteWrapper.appendChild(deleteLabel);
  // ADD ABOVE WRAPPER TO PARENT WRAPPER
  dateEditDeleteDiv.appendChild(editDeleteWrapper);
  // EDIT COMMENT CONTAINER
  editCommentControlsWrapper.appendChild(editCommentCancelButton);
  editCommentControlsWrapper.appendChild(editCommentUpdateButton);
  editCommentWrapper.appendChild(editcommentInput);
  editCommentWrapper.appendChild(editcommentInputHidden);
  editCommentWrapper.appendChild(editCommentControlsWrapper);

  li.appendChild(divCommentPhoto);
  li.appendChild(dateEditDeleteDiv);
  li.appendChild(editCommentWrapper);

  return li;
};
