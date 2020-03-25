import * as utils from "../utlis";

const AuthGard = props => {
  const logedIn = !!JSON.parse(localStorage.getItem("user"));
  //logedIn must be boolean;

  return logedIn ? props.cofirmed() : utils.redirect(props.rejected);
};

export default AuthGard;
