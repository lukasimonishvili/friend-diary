import React from "react";

import LogedIn from "./LogedIn";
import UnLogined from "./Unlogined";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? <LogedIn /> : <UnLogined />;
};

export default Profile;
