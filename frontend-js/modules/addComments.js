const axios = require("axios");
import ReuseableHtml from "../helpers/html";

export default class AddComments {
  constructor() {
    this.input = document.querySelector("#input-comment");
    this.addCommentButton = document.querySelector("#button-comment");
    this.commentsContainerUl = document.querySelector("#comment-container-ul");
    this.editCommentButton = document.querySelectorAll(
      "#edit-comment-button-server-side"
    );
    this.updateButton = document.querySelectorAll("#update-comment-button");
    this.commentsCount = document.querySelector("#comment-count");
    this.commentWordContainer = document.querySelector("#comment-word");
    this.document = document;
    this.events();
  }
  // EVENTS
  events() {
    this.addCommentButton.addEventListener("click", () =>
      this.handleAddCommentClick()
    );
    Array.prototype.forEach.call(this.updateButton, updateBtn => {
      updateBtn.addEventListener("click", e => this.handleUpdateComment(e));
    });
    Array.prototype.forEach.call(this.editCommentButton, editBtn => {
      editBtn.addEventListener("click", e =>
        this.handleOpenCloseEditContainer(e)
      );
    });

    // HANDLES CLIENT SIDE EVENTS I.E <LI> TAGS INJECTED INTO THE DOM DYNAMICALLY
    this.document.addEventListener("click", e => {
      if (e.target && e.target.id == "delete-comment-button") {
        this.handleDeleteComment(e);
      }
      if (e.target && e.target.id == "edit-comment-button") {
        this.handleOpenCloseEditContainer(e);
      }
      if (e.target && e.target.id == "update-comment-button") {
        this.handleUpdateComment(e);
      }
      if (e.target && e.target.id == "cancel-edit-comment") {
        this.handleCancelEditCommentConatiner(e);
      }
    });

    // END EVENTS
  }

  // METHODS
  handleCancelEditCommentConatiner(e) {
    const editCommentContainer =
      e.target.parentElement.parentElement.parentElement.children[2];

    editCommentContainer.style.display = "none";
  }

  handleOpenCloseEditContainer(e) {
    const editCommentContainer =
      e.target.parentElement.parentElement.parentElement.children[2];
    const inputEditContainer = editCommentContainer.children[0];

    // TOGGLE EDIT CONTAINER
    if (editCommentContainer.style.display == "none") {
      editCommentContainer.style.display = "block";
      inputEditContainer.focus();
    } else {
      editCommentContainer.style.display = "none";
    }
  }

  handleUpdateComment(e) {
    const editCommentContainer =
      e.target.parentElement.parentElement.parentElement.children[2];
    const inputEditContainer = editCommentContainer.children[0];
    const timesStampContainerServerSide =
      e.target.parentElement.parentElement.parentElement.children[1]
        .children[0];
    const commentContainerServerSide =
      e.target.parentElement.parentElement.parentElement.children[0].children[1]
        .children[1];

    if (!inputEditContainer.value) return; // DIS-ALLOW EMPTY TEXT
    axios
      .post("/edit-comment", {
        commentId: inputEditContainer.getAttribute("data-id"),
        comment: inputEditContainer.value
      })
      .then(res => {
        commentContainerServerSide.innerText = res.data.comment;
        timesStampContainerServerSide.innerText = res.data.commentDate;
      })
      .catch(_ => {
        console.log("Error updating comment.");
      });

    editCommentContainer.style.display = "none";
  }

  handleDeleteComment(e) {
    if (confirm("Are you sure?")) {
      axios
        .post("/delete-comment", {
          commentId: e.target.getAttribute("data-id")
        })
        .then(_ => {
          this.handleCommentCountAndCommentGrammar(-1);

          e.target.parentElement.parentElement.parentElement.remove();
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
    axios
      .post("/get-comments", { comment: this.input.value })
      .then(res => {
        this.handleCommentCountAndCommentGrammar(1);

        // INSERT INTO DOM
        this.commentsContainerUl.insertAdjacentElement(
          "afterbegin",
          new ReuseableHtml().li(res.data)
        );
        this.input.value = "";
        this.input.focus();
      })
      .catch(err => {
        console.log(err);
      });
  }
  // END CLASS
}
