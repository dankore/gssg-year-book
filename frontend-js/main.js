import ToggleProfile from "./modules/toggleProfile";
import ToggleEditPage from "./modules/toggleEditPage";
import ToggleStats from "./modules/toggleStats";
import ToggleImage from "./modules/show_bigger_profile_image";

if (document.querySelector("#more-profile-btn")) {
  new ToggleProfile();
}
if (document.querySelector("#btn-optional-fields")) {
  new ToggleEditPage();
}
if (document.querySelector("#arrow-down")) {
  new ToggleStats();
}
if(document.querySelector("#profile-image") || document.querySelector("#close-image")){
    new ToggleImage();
}
