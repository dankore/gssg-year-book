const axios = require("axios");

export default class AddComments {
  constructor() {
    this.input = document.querySelector("#input-comment");
    this.addCommentButton = document.querySelector("#button-comment");
    this.commentsContainerUl = document.querySelector("#comment-container-ul");
    this.deleteCommentButton = document.querySelectorAll(
      "#delete-comment-button"
    );
    this.commentsCount = document.querySelector("#comment-count");
    this.commentWordContainer = document.querySelector("#comment-word");
    this.editCommentForm = document.querySelectorAll("#comment-edit-container");
    this.document = document;
    this.events();
  }
  // EVENTS
  events() {
    this.addCommentButton.addEventListener("click", () =>
      this.handleAddCommentClick()
    );

    this.document.addEventListener("click", e => {
      if (e.target && e.target.id == "delete-comment-button") {
        this.handleDeleteComment(e);
      }
      if (e.target && e.target.id == "edit-comment-button") {
        this.handleEditComment(e);
      }
    });
  }

  // METHODS
  handleEditComment(e) {
    const editCommentFormElem =
      e.target.parentElement.parentElement.parentElement.parentElement
        .children[2];

    if (editCommentFormElem.style.display == "none") {
      editCommentFormElem.style.display = "block";
    } else {
      editCommentFormElem.style.display = "none";
    }
  }

  handleDeleteComment(e) {
    if (confirm("Are you sure?")) {
      axios
        .post("/delete-comment", {
          commentId: e.target.getAttribute("data-id")
        })
        .then(_ => {
          this.handleCommentCountAndCommentGrammar(-1);

          e.target.parentElement.parentElement.parentElement.parentElement.remove();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  handleCommentCountAndCommentGrammar(count) {
    // INCREASE / DECREASE COMMENTS COUNT
    if (count == 1) {
      this.commentsCount.innerText = +this.commentsCount.innerText + 1; // INCREASE # OF COMMENTS
    } else {
      if (this.commentsCount.innerText == 1) {
        this.commentsCount.innerText = ""; // INSTEAD OF DISPLAYING ZERO, DISPLAY NOTHING
      } else {
        this.commentsCount.innerText = +this.commentsCount.innerText - 1; // DECREASE # OF COMMENTS
      }
    }
    // CHANGE FROM COMMENT TO COMMENTS AND VICE VERSA
    const currentCommentsCount = this.commentsCount.innerText;
    if (currentCommentsCount == 0) {
      this.commentWordContainer.innerText = "";
    } else if (currentCommentsCount == 1) {
      this.commentWordContainer.innerText = "comment";
    } else {
      this.commentWordContainer.innerText = "comments";
    }
  }

  handleAddCommentClick() {
    // IF INPUT BOX IS EMPTY, DO NOT SAVE
    if (!this.input.value) return;
    // SEND DATA TO DB
    axios.post("/get-comments", { comment: this.input.value }).then(res => {
      this.handleCommentCountAndCommentGrammar(1);

      this.injectIntoHtml(res.data);
    });
  }

  injectIntoHtml(data) {
    this.commentsContainerUl.insertAdjacentHTML(
      "afterbegin",
      this.dataTemplate(data)
    );
    this.input.value = "";
    this.input.focus();
  }

  dataTemplate(data) {
    return `
    <li id="li-comment" class="my-2 p-2 rounded">
      <div class="flex">
        <div class="flex mr-1">
          <a href="/profile/${data.visitorEmail}">
            <img src="${data.photo}" class="w-8 h-8 rounded-full" alt="profile pic"/>
          </a>
        </div>
        <div
          class="rounded px-2"
          style="overflow-wrap: break-word; min-width: 0px; width: 15rem; background-color: #F2F3F5;"
        >
          <a href="/profile/${data.visitorEmail}" class="font-medium">
            ${data.visitorFirstName}
          </a>
          <p>
            ${data.comment}
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center mt-2 text-xs">
        <p>
          ${data.commentDate}
        </p>

        <div class="flex">
        <!--__EDIT BUTTON_____________-->
          <label for="edit-comment-button" class="flex items-center cursor-pointer">
            <svg
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
            </svg>
            <input
              type="button"
              value="Edit"
              id="edit-comment-button"
              class="flex bg-white items-center cursor-pointer"
            />
          </label>
          <!--__EDIT BUTTON ENDS_____________-->

        

          <!-- DELETE BUTTON -->
          <label class="flex items-center ml-2 cursor-pointer" for="delete-comment-button">
            <svg
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
              </svg>
            <input
              type="button"
              value="Delete"
              id="delete-comment-button"
              data-id="${data.commentId}"
              class="flex bg-white items-center cursor-pointer"
            />
            </label>
            <!-- DELETE BUTTON ENDS -->
        </div>
      </div>
        
      <!--__EDIT FORM_____________-->
        <div
          id="comment-edit-container"
          class="absolute w-full -ml-2 -mt-10"
          style="display: none;"
        >
        <input
          type="text"
          name="comment"
          value="${data.comment}"
          class="w-full  p-2 bg-gray-200 border border-blue-400 rounded"
          >
        <input
          type="hidden"
          name="commentId"
          value="${data.commentId}"
        >
        <div class="flex justify-between">
          <button
            id="cancel-edit-comment"
            class="bg-green-600 text-white px-2 rounded"
          >
            Cancel
          </button>
          <button
            id="update-comment"
            class="bg-blue-600 text-white px-2 rounded"
          >
            Update
          </button>
        </div>
        </div>
       <!--__EDIT FORM ENDS_____________-->
    </li>`;
  }
  // END CLASS
}