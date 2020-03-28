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

  // EDIT BUTTONedit-comment-button
  const inputEdit = document.createElement("input");
  inputEdit.setAttribute("type", "button");
  inputEdit.setAttribute("value", "Edit");
  inputEdit.id = "edit-comment-button";
  inputEdit.classList.add("flex", "bg-white", "items-center", "cursor-pointer");

  // DELETE BUTTON
  const inputDelete = document.createElement("input");
  inputDelete.setAttribute("type", "button");
  inputDelete.setAttribute("value", "Delete");
  inputDelete.setAttribute("data-id", `${data.commentId}`);
  inputDelete.id = "delete-comment-button";
  inputDelete.classList.add(
    "flex",
    "ml-3",
    "bg-white",
    "text-red-600",
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
  editcommentInput.setAttribute("data-id", `${data.commentId}`);
  editcommentInput.classList.add(
    "w-full",
    "p-2",
    "bg-gray-200",
    "border",
    "border-blue-400",
    "rounded"
  );

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
  editCommentUpdateButton.id = "update-comment-button";
  editCommentUpdateButton.setAttribute("data-id", `${data.commentId}`);
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

  // ADD LABELS TO WRAPPER DIV
  editDeleteWrapper.appendChild(inputEdit);
  editDeleteWrapper.appendChild(inputDelete);
  // ADD ABOVE WRAPPER TO PARENT WRAPPER
  dateEditDeleteDiv.appendChild(editDeleteWrapper);
  // EDIT COMMENT CONTAINER
  editCommentControlsWrapper.appendChild(editCommentCancelButton);
  editCommentControlsWrapper.appendChild(editCommentUpdateButton);
  editCommentWrapper.appendChild(editcommentInput);
  editCommentWrapper.appendChild(editCommentControlsWrapper);

  li.appendChild(divCommentPhoto);
  li.appendChild(dateEditDeleteDiv);
  li.appendChild(editCommentWrapper);

  return li;
};
