export const redirect = direction => {
  console.log("rejected");
  if (direction === "back") {
    window.history.back();
  } else {
    window.location.replace(direction);
  }
};
