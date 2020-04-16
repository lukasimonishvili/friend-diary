import React from "react";
import { IntlProvider } from "react-intl";

import { LOCALES } from "./locales.js";
import messages from "./messages/index.js";

const Provider = ({ children, locale = LOCALES.ENGLISH }) => {
  return (
    <IntlProvider
      locale={locale}
      textComponent={React.Fragment}
      messages={messages[locale]}
    >
      {children}
    </IntlProvider>
  );
};

export default Provider;
