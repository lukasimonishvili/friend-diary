import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import shortid from "shortid";

import btn from "../assets/img/button.svg";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8e8e8;

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
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
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
  top: ${props => props.top};
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

const Vertical = styled.div`
  position: absolute;
  z-index: 1;
  width: 2px;
  height: calc(100% - 103px);
  top: 103px;
  left: ${props => props.left};
  background-color: #b0dbf4;
`;

const Form = styled.div`
  width: 100%;
  padding: 0 38px;
  padding-top: 35px;
`;

const Label = styled.label`
  display: block;
  font-size: 25px;
  color: #126dbc;
  margin-bottom: 25px;
  position: relative;
  z-index: 10;
  cursor: pointer;
`;

const Num = styled.span`
  padding-right: 38px;
`;

const Inp = styled.input`
  display: block;
  width: calc(100% - 32px);
  height: 25px;
  margin-left: 32px;
  border: none;
  background-color: transparent;
  border-bottom: 1px dashed #126dbc;
  color: #126dbc;
  margin-bottom: 25px;
  outline: transparent;
  font-size: 16px;
  position: relative;
  z-index: 10;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  background-image: url(${btn});
  background-size: 100% 100%;
  color: #126dbc;
  font-size: 21px;
  line-height: 35px;
  cursor: pointer;
  position: relative;
  z-index: 10;
`;

const Sticker = styled.img`
  position: absolute;
  width: 21%;
  height: auto;
  left: ${props => props.left};
  top: ${props => props.top};
  z-index: 4;
`;

const FillQuestions = () => {
  const ref = useRef();
  const [noteType, setNoteType] = useState("norm");
  const [horizontalLenght, setHorizontalLength] = useState({
    top: 0,
    count: 0
  });
  const [verticalLength, setVerticalLength] = useState(0);
  const [data, setData] = useState({
    questions: {
      list: [],
      stickers: []
    },
    texture: "norm"
  });

  function calculateHorizontalLineLength() {
    if (ref.current) {
      let result;
      let note = ref.current;
      let padding = +getComputedStyle(note).paddingTop.split("px")[0];
      let height = +getComputedStyle(note).height.split("px")[0] - padding;
      result = Math.floor(height / 25);
      setHorizontalLength({
        top: padding,
        count: result
      });
    }
  }

  function calculeteVerticalLineLength() {
    if (ref.current) {
      let result;
      let note = ref.current;
      let width = +getComputedStyle(note).width.split("px")[0];
      result = Math.floor(width / 25);
      setVerticalLength(result);
    }
  }

  function renderLines() {
    calculateHorizontalLineLength();
    calculeteVerticalLineLength();
  }

  useEffect(() => {
    renderLines();
    let payload = JSON.parse(window.localStorage.getItem("payload"));
    setData(payload);
    setNoteType(payload.texture);
    window.addEventListener("resize", renderLines);

    return () => {
      window.removeEventListener("resize", renderLines);
    };
  }, []);

  return (
    <Container>
      <Wrapper>
        <Note ref={ref} type={noteType}>
          <Form>
            {data.questions.list.map((question, index) => {
              let id = shortid.generate();
              return (
                <React.Fragment key={id}>
                  <Label htmlFor={id}>
                    <Num>{index + 1}</Num>
                    {question}
                  </Label>
                  <Inp id={id} type="text" />
                </React.Fragment>
              );
            })}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "25px"
              }}
            >
              <Button>gagzavna</Button>
            </div>
          </Form>
          {data.questions.stickers.map(sticker => (
            <Sticker
              key={shortid.generate()}
              alt=""
              src={require("../assets/img/stickers/" + sticker.image + ".png")}
              top={sticker.y}
              left={sticker.x}
            />
          ))}
          <RedLine />
          {[...Array(horizontalLenght.count)].map((e, i) => {
            return (
              <Horizontal
                key={shortid.generate()}
                top={(i + 1) * 25 + horizontalLenght.top + "px"}
              />
            );
          })}

          {noteType === "math" ? (
            [...Array(verticalLength)].map((e, i) => {
              return (
                <Vertical key={shortid.generate()} left={(i + 1) * 25 + "px"} />
              );
            })
          ) : (
            <></>
          )}
        </Note>
      </Wrapper>
    </Container>
  );
};

export default FillQuestions;
