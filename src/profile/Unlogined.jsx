import React, { useContext } from "react";
import styled from "styled-components";
import Div100vh from "react-div-100vh";
import Button from "../shared/button";

import buttinImage from "../assets/img/button.svg";
import backgroundImage from "../assets/img/main-background.png";

import { FormattedMessage } from "react-intl";
import { LangSwitcher } from "../i18n/langSwitcher";

const StyledLink = styled.a`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  color: white;
  font-size: 48px;
  line-height: 80px;
  background-image: url(${buttinImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const StyledBackground = styled(Div100vh)`
  position: relative;
  width: 100%;
  background-color: #99c8b9;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const StyledTitle = styled.h2`
  position: absolute;
  top: 15%;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 56px;
  line-height: 92px;
`;

const UnLogined = () => {
  const { locale, setLocale } = useContext(LangSwitcher);

  return (
    <StyledBackground>
      <StyledTitle>
        <FormattedMessage id="unlogined" />
      </StyledTitle>
      <StyledLink href="https://megobrebi.ge/auth/redirect/facebook">
        <FormattedMessage id="start" />
      </StyledLink>
      {window.localStorage.getItem("test") != "true" ? (
        <React.Fragment></React.Fragment>
      ) : (
        <div>
          <button
            onClick={() => {
              window.localStorage.setItem("lang", "ENGLISH");
              setLocale("ENGLISH");
            }}
          >
            en
          </button>
          <button
            onClick={() => {
              window.localStorage.setItem("lang", "GEORGIAN");
              setLocale("GEORGIAN");
            }}
          >
            ka
          </button>
          <button
            onClick={() => {
              window.localStorage.setItem("lang", "RUSSIAN");
              setLocale("RUSSIAN");
            }}
          >
            ru
          </button>
        </div>
      )}
    </StyledBackground>
  );
};

export default UnLogined;
