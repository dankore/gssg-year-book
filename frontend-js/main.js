import Profile from "./modules/profile";
import Toggle from "./modules/toggle";

if (document.querySelector("#more-profile-btn")) {
  new Profile();
}
if (document.querySelector("#btn-optional-fields")) {
  new Toggle();
}
