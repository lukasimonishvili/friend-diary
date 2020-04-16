import React from "react";
import CreateDiary from "./create";

const EditDiary = (props) => {
  let edit = {
    userId: window.localStorage.getItem("user"),
    hash: props.id,
  };
  return <CreateDiary edit={edit} />;
};

export default EditDiary;
