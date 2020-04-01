const axios = require("axios");
import ReuseableHtml from "../helpers/html";

export default class AddComments {
  constructor() {
    this.input = document.querySelector("#input-comment");
    this.commentsContainerUl = document.querySelector("#comment-container-ul");
    this.commentsCount = document.querySelector("#comment-count");
    this.commentWordContainer = document.querySelector("#comment-word");
    this.commentsSection = document.querySelector("#comments-section");
    this.modalOverlay = document.querySelector(".modal-overlay");
    this.events();
  }
  // EVENTS
  events() {
    // SHOW INPUT CONTENT IN TEXTAREA TAGS
    this.commentsSection.addEventListener("keyup", e => {
      e.target && "input-comment" == e.target.id && this.handleInputkeyUp(e);
    })
    // HANDLES CLIENT/SERVER SIDES EVENTS I.E <LI> TAGS INJECTED INTO THE DOM DYNAMICALLY
    this.commentsSection.addEventListener("click", e => {
      e.target && "add-comment-button" == e.target.id && this.handleAddCommentClick();
      e.target && "delete-comment-button" == e.target.id && this.handleDeleteComment(e);
      e.target && "edit-comment-button" == e.target.id && this.handleOpenCloseEditContainer(e);
      e.target && "update-comment-button" == e.target.id && this.handleUpdateComment(e);
      e.target && "cancel-comment-button" == e.target.id && this.handleCancelEditCommentConatiner(e);
    });

    // END EVENTS
  }

  // METHODS
  handleInputkeyUp(e){
    e.target.style.height = "1px";
    e.target.style.height = (25+e.target.scrollHeight) + "px";
    this.input.style.height = "1px";
    this.input.style.height = (25+this.input.scrollHeight)+"px";
  }
  
  handleCancelEditCommentConatiner(e) {
    const editCommentContainer =
      e.target.parentElement.parentElement.parentElement.children[2];
    
    this.modalOverlay.classList.remove("active");
    editCommentContainer.classList.remove("active");
    editCommentContainer.style.display = "none";
  }

  handleOpenCloseEditContainer(e) {
    const editCommentContainer =
      e.target.parentElement.parentElement.parentElement.children[2];
    const inputEditContainer = editCommentContainer.children[0];

      // TOGGLE EDIT CONTAINER
    if (editCommentContainer.style.display == "none") {
      editCommentContainer.style.display = "block";

      this.modalOverlay.classList.add("active");
      editCommentContainer.classList.add("active");

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
    
    this.modalOverlay.classList.remove("active");
    editCommentContainer.classList.remove("active");
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
        // IF NO PROFILE IMAGE, SET DEFAULT TO BLANK.PNG
        !res.data.photo ? 
           res.data.photo = "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/blank.png" : res.data.photo;
        
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
