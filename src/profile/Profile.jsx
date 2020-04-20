import React from "react";

import LogedIn from "./LogedIn";
import UnLogined from "./Unlogined";

const Profile = (props) => {
  let userId = props.location.search.split("userId=")[1];

  if (userId) {
    window.localStorage.setItem("user", userId);
  } else {
    window.localStorage.setItem("user", "27");
  }

  let redirect = window.localStorage.getItem("redirect");
  if (redirect) {
    window.localStorage.removeItem("redirect");
    window.location.replace(redirect);
  }

  const user = JSON.parse(localStorage.getItem("user"));

  return user ? <LogedIn /> : <UnLogined />;
};

export default Profile;
