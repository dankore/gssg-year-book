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

    Array.prototype.forEach.call(this.editCommentButton, editButton => {
      editButton.addEventListener("click", e => this.handleEditCommentServerSide(e));
    });

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
  handleEditCommentServerSide(e) {
    const editCommentContainer = e.target.parentElement.parentElement.parentElement.parentElement.children[2];
    
    // TOGGLE EDIT CONTAINER
    if (editCommentContainer.style.display == "none") {
      editCommentContainer.style.display = "block";
    } else {
      editCommentContainer.style.display = "none";
    }
    console.log('server')
    console.log(e.target);
    console.log(editCommentContainer);

  }

  handleEditComment(e) {
    const editCommentFormElem =
      e.target.parentElement.parentElement.parentElement.parentElement
        .children[2];
    const updateButton = editCommentFormElem.children[2].children[1];
   
    // TOGGLE EDIT CONTAINER
    if (editCommentFormElem.style.display == "none") {
      editCommentFormElem.style.display = "block";
    } else {
      editCommentFormElem.style.display = "none";
    }
     console.log('client')
    console.log(updateButton);

    // if (updateButton && updateButton.id == "update-comment") {
    //   updateButton.addEventListener("click", event =>
    //     this.actuallyUpdateComment(event)
    //   );
    // }
  }

  // actuallyUpdateComment(event) {
  //   const parentElement_of_editCommentForm =
  //     event.target.parentElement.parentElement;

  //   const editCommentForm = parentElement_of_editCommentForm.children[0];

  //   const commentContainer =
  //     event.target.parentElement.parentElement.parentElement.children[0]
  //       .children[1].children[1];

  //   const timeStampContainer =
  //     event.target.parentElement.parentElement.parentElement.children[1]
  //       .children[0];

  //   console.log(event.target, editCommentForm, commentContainer, timeStampContainer);

  //   if (!editCommentForm.value) return; // DIS-ALLOW EMPTY TEXT
  //   axios
  //     .post("/edit-comment", {
  //       commentId: event.target.getAttribute("data-id"),
  //       comment: editCommentForm.value
  //     })
  //     .then(res => {
  //       console.log(res.data);
  //       // TODO REMOVE LAST COMMENT AFTER UPDATE
  //       commentContainer.innerText = res.data.comment;
  //       timeStampContainer.innerText = res.data.commentDate;
  //     })
  //     .catch(_ => {
  //       console.log("Error updating comment.");
  //     });

  //   parentElement_of_editCommentForm.style.display = 'none';
  // }

  handleDeleteComment(e) {
    console.log(e.target.parentElement.parentElement.parentElement);
    console.log(e.target.getAttribute("data-id"))
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
