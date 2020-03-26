import ToggleProfile from "./modules/toggleProfile";
import ToggleEditPage from "./modules/toggleEditPage";
import ToggleStats from "./modules/toggleStats";
import ToggleImage from "./modules/show_bigger_profile_image";
import ConfirmDelete from "./modules/confirmDelete";
import RegistrationFormLiveValidation from "./modules/registrationFormLiveValidation";
import Filter from "./modules/filter";
import EditCancelUpdateComments from "./modules/comments-edit-cancel-update-btn";
import ShowAllComments from "./modules/comments-show-all";
import Likes from "./modules/likes";
import ShowNames from "./modules/show-those-liked-a-profile";
import ClickToComment from "./modules/clickToComment";
import AddComment from "./modules/addComments";

if (document.querySelector("#more-profile-btn")) {
  new ToggleProfile();
}
if (document.querySelector("#btn-optional-fields")) {
  new ToggleEditPage();
}
if (document.querySelector("#bar-chart-icon-container")) {
  new ToggleStats();
}
if (document.querySelector("#profile-image")) {
  new ToggleImage();
}
if (document.querySelector("#anchor-tag")) {
  new ToggleImage();
}
if (document.querySelector("#delete-profile")) {
  new ConfirmDelete();
}
if (document.querySelector("#registration-form")) {
  new RegistrationFormLiveValidation();
}
if (document.querySelector("#filter-icon-container")) {
  new Filter();
}
// if (document.querySelectorAll("#edit-button")) {
//   new EditCancelUpdateComments();
// }
if (document.querySelector("#show-all-comments-toggle")) {
  new ShowAllComments();
}
if (document.querySelector("#likes-button")) {
  new Likes();
}
if (document.querySelector("#likes-container")) {
  new ShowNames();
}
if (document.getElementById("click-to-comment")) {
  new ClickToComment();
}
if (document.getElementById("button-comment")) {
  new AddComment();
}