import ToggleProfile from "./modules/toggleProfile";
import ToggleEditPage from "./modules/toggleEditPage";
import ToggleStats from "./modules/toggleStats";

if (document.querySelector("#more-profile-btn")) {
  new ToggleProfile();
}
if (document.querySelector("#btn-optional-fields")) {
  new ToggleEditPage();
}
if (document.querySelector("#arrow-down")) {
  new ToggleStats();
}
