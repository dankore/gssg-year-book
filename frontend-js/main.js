import ToggleProfile from "./modules/toggleProfile";
import ToggleEditPage from "./modules/toggleEditPage";
import ToggleStats from "./modules/toggleStats";
import ToggleImage from "./modules/show_bigger_profile_image";
import ConfirmDelete from "./modules/confirmDelete";
import RegistrationFormLiveValidation from "./modules/registrationFormLiveValidation";
import Filter from "./modules/filter";

if (document.querySelector("#more-profile-btn")) {
  new ToggleProfile();
}
if (document.querySelector("#btn-optional-fields")) {
  new ToggleEditPage();
}
if (document.querySelector("#arrow-down")) {
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
if (document.querySelector("#filter-icon")) {
  new Filter();
}
