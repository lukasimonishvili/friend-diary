import React from "react";

import QuestionsCreate from "./createQuestions";

const EditQuestions = (props) => {
  let edit = { hash: props.id };
  return <QuestionsCreate edit={edit} />;
};

export default EditQuestions;
