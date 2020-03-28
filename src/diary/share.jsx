import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import shortid from "shortid";
import { Link } from "@reach/router";

import fb from "../assets/img/facebook.svg";
import ig from "../assets/img/instagram.svg";
import wts from "../assets/img/whatsup.svg";
import msg from "../assets/img/messanger.svg";
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
  padding-left: 69px;
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
    /* width: 100%; */
    padding-left: 40px;
  }

  @media screen and (max-height: 848px) {
    /* height: 100%; */
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
  z-index: 1;
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
  margin-bottom: 38px;
  padding-right: 24px;
`;

const Label = styled.h5`
  font-size: 10px;
  line-height: 12px;
  font-family: "Lato" !important;
  font-weight: 900;
`;

const LinkLong = styled.p`
  width: 100%;
  margin-top: 8px;
  line-height: 41px;
  border: 1px solid rgba(18, 109, 188, 0.52);
  background-color: #f5f5f5;
  text-align: center;
  font-size: 14px;
  font-family: "Lato" !important;
  font-weight: 900;
  color: #707070;
  margin-bottom: 25px;
  cursor: pointer;
  word-wrap: break-word;
  padding: 0 10px;

  @media screen and (max-width: 500px) {
    font-size: 10px;
    line-height: 20px;
  }

  @keyframes bounce {
    0% {
      transform: scale(1.5);
    }

    25% {
      transform: scale(0.9);
    }

    50% {
      transform: scale(1.2);
    }

    75% {
      transform: scale(0.7);
    }

    100% {
      transform: scale(1);
    }
  }
`;

const Socials = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const Social = styled.a`
  width: 26px;
  margin-left: 22px;
  cursor: pointer;

  &:first-child {
    margin-left: 0;
  }

  & img {
    width: 100%;
    height: auto;
  }
`;

const Friends = styled.ul`
  padding: 25px;
  border: 1px solid rgba(18, 109, 188, 0.25);
  margin-top: 25px;

  @media screen and (max-width: 500px) {
    padding: 10px;
  }
`;

const Friend = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;

  &:first-child {
    margin-top: 0;
  }
`;

const FullName = styled.span`
  font-size: 14px;
  line-height: 17px;
  font-family: "Lato" !important;
  font-weight: 900;

  @media screen and (max-width: 500px) {
    font-size: 10px;
  }
`;

const Invite = styled.button`
  width: 93px;
  line-height: 23px;
  color: white;
  font-size: 11px;
  border: 1px solid rgba(18, 109, 188, 0.25);
  background-color: #126dbc;
  font-family: "Lato" !important;
  font-weight: 900;
  cursor: pointer;
  margin-left: 15px;

  @media screen and (max-width: 500px) {
    width: 50px;
  }
`;

const Button = styled.div`
  text-align: center;
  color: #126dbc;
  font-size: 21px;
  line-height: 35px;
  border: none;
  background-color: transparent;
  outline: transparent;
  background-image: url(${btn});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  position: relative;
  background-color: transparent;
  margin: 35px 0;
  padding: 17px 0;

  @media screen and (max-width: 500px) {
    font-size: 13px;
    line-height: 15px;
    padding: 14px 0;
    margin: 15px 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const Share = props => {
  const [horizontalLenght, setHorizontalLength] = useState({
    top: 0,
    count: 0
  });
  const [firendList, setFriednList] = useState([]);

  let ref = useRef(null);

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

  function onBackClick() {
    props.back();
  }

  useEffect(() => {
    calculateHorizontalLineLength();
    setFriednList([
      "გოჩა გავაშელი",
      "მარიამ გამოდი",
      "მაკა ჩაიპეროვი",
      "Giorgi mixaria",
      "vaja gvelovi"
    ]);
    window.addEventListener("resize", calculateHorizontalLineLength);

    return () => {
      window.removeEventListener("resize", calculateHorizontalLineLength);
    };
  }, []);

  let href = window.location.href;

  function copyText(e) {
    e.persist();
    var from = e.target;
    var range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(from);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    e.target.style.animation = "bounce 1s";

    setTimeout(() => {
      e.target.style.animation = "none";
    }, 1000);
  }

  return (
    <Container>
      <NoteWrapper>
        <Note ref={ref}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <Title>moiwvie megobrebi</Title>
            <Label>დღიურის ბმული (click to copy)</Label>
            <LinkLong onClick={copyText}>{href}</LinkLong>
            <Label>გაუგზავნე დღიური</Label>
            <Socials>
              <div
                style={{ fontFamily: "'Lato' !important" }}
                className="sharethis-inline-share-buttons"
              ></div>
              {/* <Social href="http://www.facebook.com" target="_blank">
                <img alt="" src={fb} />
              </Social>
              <Social href="http://www.instagram.com" target="_blank">
                <img alt="" src={ig} />
              </Social>
              <Social href="https://www.whatsapp.com" target="_blank">
                <img alt="" src={wts} />
              </Social>
              <Social href="https://www.messenger.com" target="_blank">
                <img alt="" src={msg} />
              </Social> */}
            </Socials>
            <Friends>
              {firendList.map(friend => (
                <Friend key={shortid.generate()}>
                  <FullName>{friend}</FullName>
                  <Invite>Invite</Invite>
                </Friend>
              ))}
            </Friends>
            <ButtonWrapper>
              <Button onClick={onBackClick}>dRiuris naxva</Button>
            </ButtonWrapper>
          </div>
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

export default Share;
