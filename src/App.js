import React from "react";
import "./App.css";
import { Router } from "@reach/router";
import AuthGard from "./shared/authGuard";

import Profile from "./profile/Profile";
import CreateDiary from "./diary/create";
import QuestionsCreate from "./diary/createQuestions";
import Fill from "./diary/fill";
import FillQuestions from "./diary/fillQuestions";
import Complete from "./diary/complete";
import Diary from "./profile/Diary";
import Read from "./diary/read";

// function serUser() {
//   window.localStorage.setItem(
//     "user",
//     JSON.stringify({
//       id: "23222",
//       name: "Luka",
//       lastName: "Simonishvili",
//       friends: [
//         {
//           id: "23224",
//           name: "gocha",
//           lastName: "gabiskiria"
//         },
//         {
//           id: "2124224",
//           name: "mari",
//           lastName: "ochigava"
//         }
//       ]
//     })
//   );
// }

function App() {
  // serUser();
  return (
    <Router>
      <Profile path="/" />
      <AuthGard path="create" cofirmed={() => <CreateDiary />} rejected="/" />
      <AuthGard
        path="create/questions"
        cofirmed={() => <QuestionsCreate />}
        rejected="/"
      />
      <Fill path="fill/:id" />
      <FillQuestions path="fill/questions/:id" />
      <Diary path="diary/:id" />
      <Read path="read" />
      <Complete path="complete" />
    </Router>
  );
}

export default App;
