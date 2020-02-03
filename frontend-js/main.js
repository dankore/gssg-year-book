import Profile from "./modules/toggleProfile";
import Toggle from "./modules/toggleEditPage";

if (document.querySelector("#more-profile-btn")) {
  new Profile();
}
if (document.querySelector("#btn-optional-fields")) {
  new Toggle();
}
