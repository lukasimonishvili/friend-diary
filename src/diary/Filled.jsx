import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";
import { Link } from "@reach/router";
import Div100vh from "react-div-100vh";

import btn from "../assets/img/button.svg";
import bodyImage from "../assets/img/body.jpg";

const Container = styled(Div100vh)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8e8e8;
  background-image: url(${bodyImage});
  background-size: cover;
  background-position: top right;

  @media screen and (max-width: 727px) {
    padding-left: 30px;
    padding-right: 30px;
  }

  @media screen and (max-height: 848px) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 667px;
  height: 828px;
  box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 727px) {
    width: 100%;
  }

  @media screen and (max-height: 848px) {
    height: 100%;
  }
`;

const Note = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 17px;
  background-color: #f1f7fb;
  padding-top: 78px;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    height: 5px;
    width: 5px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 10px;
    background-image: -webkit-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }
`;

const Horizontal = styled.div`
  position: absolute;
  z-index: 1;
  top: ${(props) => props.top};
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #b0dbf4;
`;

const RedLine = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 60px;
  width: 1px;
  height: 100%;
  background-color: #e55858;
`;

const Title = styled.h3`
  color: #126dbc;
  width: 100%;
  font-size: 32px;
  position: absolute;
  text-align: center;
  left: 0;
  top: 25%;
  z-index: 30;
`;

const Button = styled(Link)`
  cursor: pointer;
  position: absolute;
  border: none;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  background-color: transparent;
  background-image: url(${btn});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #126dbc;
  font-size: 21px;
  z-index: 30;
`;

const Filled = () => {
  const ref = useRef();

  function calculateHorizontalLineLength() {
    if (ref.current) {
      let result;
      let note = ref.current;
      let padding = +getComputedStyle(note).paddingTop.split("px")[0];
      let height = +getComputedStyle(note).height.split("px")[0] - padding;
      result = Math.floor(height / 25);
      setHorizontalLength({
        top: padding,
        count: result,
      });
    }
  }
  const [horizontalLenght, setHorizontalLength] = useState({
    top: 0,
    count: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      calculateHorizontalLineLength();
    }, 1000);

    window.addEventListener("resize", calculateHorizontalLineLength);

    return () => {
      window.removeEventListener("resize", calculateHorizontalLineLength);
    };
  }, []);

  return (
    <Container>
      <Wrapper>
        <Note ref={ref}>
          <Title>es dRiuri ukve Sevsebuli gaqvT</Title>
          <Button to="/">ukan</Button>
          <RedLine />
          {[...Array(horizontalLenght.count)].map((e, i) => {
            return (
              <Horizontal
                key={shortid.generate()}
                top={i * 25 + horizontalLenght.top + "px"}
              />
            );
          })}
        </Note>
      </Wrapper>
    </Container>
  );
};

export default Filled;
