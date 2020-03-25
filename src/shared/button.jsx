import React from "react";
import styled from "styled-components";
import buttinImage from "../assets/img/button.svg";
import { Link } from "@reach/router";

const StyledButton = styled.button`
  position: absolute;
  bottom: 10%;
  left: 0;
  z-index: 10;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  font-size: 48px;
  line-height: 80px;
  border: none;
  background-color: transparent;
  outline: transparent;
  background-image: url(${buttinImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
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

const Button = props => {
  return props.link ? (
    <StyledLink to={props.link}>{props.text}</StyledLink>
  ) : (
    <StyledButton
      onClick={() => {
        props.click();
      }}
    >
      {props.text}
    </StyledButton>
  );
};

export default Button;
