import React, { useState } from "react";
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
import Filled from "./diary/Filled";
import EditDiary from "./diary/edit";
import EditQuestions from "./diary/editQuestions";
import { LangSwitcher } from "./i18n/langSwitcher";

import { I18nProvider, LOCALES } from "./i18n/index";

function App() {
  const [locale, setLocale] = useState(
    window.localStorage.getItem("lang") || "GEORGIAN"
  );

  return (
    <I18nProvider locale={LOCALES[locale]}>
      <LangSwitcher.Provider value={{ locale, setLocale }}>
        <Router>
          <Profile path="/" />
          <AuthGard
            path="create"
            cofirmed={() => {
              return <CreateDiary />;
            }}
            rejected="/"
          />
          <AuthGard
            path="create/questions"
            cofirmed={() => <QuestionsCreate />}
            rejected="/"
          />
          <EditDiary path="/edit/:id" />
          <EditQuestions path="/edit/questions/:id" />
          <Fill path="fill/:id" />
          <FillQuestions path="fill/questions/:id" />
          <Diary path="diary/:id" />
          <Read path="read" />
          <Complete path="complete" />
          <Filled path="filled" />
        </Router>
      </LangSwitcher.Provider>
    </I18nProvider>
  );
}

export default App;
