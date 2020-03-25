import React from "react";
import styled from "styled-components";

import Button from "../shared/button";

import backgroundImage from "../assets/img/main-background.png";

const StyledBackground = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
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
  return (
    <StyledBackground>
      <StyledTitle>megobrobis dRiuri</StyledTitle>
      <Button link="/create" text="male" />
    </StyledBackground>
  );
};

export default UnLogined;
