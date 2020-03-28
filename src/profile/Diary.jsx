import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";
import { Link } from "@reach/router";

import Loading from "../shared/spinner";
import Share from "../diary/share";

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

const Note = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 78px;
  border-radius: 17px;
  background-color: #f1f7fb;
  padding-left: 40px;
  padding-right: 30px;
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

  @media screen and (max-width: 727px) {
    padding-left: 15px;
  }

  @media screen and (max-height: 848px) {
  }
`;

const NoteWrapper = styled.div`
  width: 667px;
  height: 828px;
  overflow: hidden;
  position: relative;

  @media screen and (max-width: 727px) {
    width: 100%;
  }

  @media screen and (max-height: 848px) {
    height: 100%;
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

  @media screen and (max-width: 727px) {
    left: 30px;
  }
`;

const Title = styled.h2`
  text-align: end;
  width: 100%;
  font-size: 24px;
  line-height: 40px;
  color: #126dbc;
  margin-top: -50px;
  margin-bottom: 48px;
  padding-right: 24px;
`;

const Filler = styled.div`
  font-size: 25px;
  color: #126dbc;
  display: block;
  margin-bottom: 25px;

  & span {
    padding-right: 35px;

    @media screen and (max-width: 727px) {
      padding-right: 15px;
    }
  }
`;

const FillerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 20;
`;

const Read = styled(Link)`
  font-size: 18px;
  line-height: 25px;
  color: #126dbc;
  padding: 0 15px;
  background-image: url(${btn});
  background-size: 100% 100%;
  background-position: center;
  margin-bottom: 25px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  margin-bottom: 25px;
`;

const Button = styled.div`
  font-size: 13px;
  padding: 22px 0;
  cursor: pointer;
  color: #126dbc;
  background-image: url(/static/media/button.1ecc2f97.svg);
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 20;
`;

const Diary = props => {
  let ref = useRef();

  const [horizontalLenght, setHorizontalLength] = useState({
    top: 0,
    count: 0
  });
  const [showShare, setShowShare] = useState(props.share || false);
  const [list, setList] = useState([]);
  let savedIndex = -1;

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

  function toggleShareView() {
    let curren = showShare;
    setShowShare(!curren);

    calculateHorizontalLineLength();
  }

  function handleMouseOver(data) {
    window.localStorage.setItem("answer", JSON.stringify(data));
  }

  useEffect(() => {
    calculateHorizontalLineLength();
    setList([
      {
        name: "luka simoniSvili",
        list: [
          { question: "ra aris Seni gen gegma?", answers: "araferi brat" },
          {
            question: "araspravedlivi xeli ra pontSi aiwia?",
            answers: "vozdux obSi brat"
          }
        ]
      },
      {
        name: "vaJa orosani",
        list: [
          { question: "ori zangi Ramea?", answers: "Sav ferze nu Radaob brat" },
          { question: "kai biWiba Tu torti?", answers: "CurCxela" }
        ]
      },
      {
        name: "kote marabdiSvili",
        list: [
          { question: "1-2 Cayra ar gaqvs Zma?", answers: "aafeTqe" },
          { question: "ra mieci?", answers: "kudi" }
        ]
      }
    ]);

    window.addEventListener("resize", calculateHorizontalLineLength);

    return () => {
      window.removeEventListener("resize", calculateHorizontalLineLength);
    };
  }, []);

  return showShare ? (
    <Share back={toggleShareView} />
  ) : (
    <Container>
      <NoteWrapper>
        <Note ref={ref}>
          <Title>Cemi dRiuri</Title>
          {list.map((filler, index) => (
            <FillerWrapper
              onMouseOver={() => {
                handleMouseOver(filler.list);
              }}
              key={shortid.generate()}
            >
              <Filler>
                <span>{index + 1}</span>
                {filler.name}
              </Filler>
              <Read to="/read">naxva</Read>
            </FillerWrapper>
          ))}
          <ButtonWrapper>
            <Button onClick={toggleShareView}>gauzuare megobrebs</Button>
          </ButtonWrapper>
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
      </NoteWrapper>
    </Container>
  );
};

export default Diary;
