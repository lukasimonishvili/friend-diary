import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";
import { Link } from "@reach/router";
import Div100vh from "react-div-100vh";
import { FormattedMessage } from "react-intl";

import Loading from "../shared/spinner";
import bodyImage from "../assets/img/body.jpg";

import axios from "axios";

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

const Note = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 78px;
  border-radius: 17px;
  background-color: #f1f7fb;
  padding-left: 40px;
  padding-right: 30px;
  overflow-y: auto;

  @supports (-webkit-touch-callout: none) {
    overflow-y: scroll;
  }

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
  border-radius: 17px;
  box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.3);

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

const LoadWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Diary = styled(Link)`
  font-size: 25px;
  color: #126dbc;
  display: block;
  margin-bottom: 25px;
  position: relative;
  z-index: 200000;

  & span {
    padding-right: 35px;

    @media screen and (max-width: 727px) {
      padding-right: 15px;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  margin-bottom: 25px;
`;

const Button = styled(Link)`
  font-size: 25px;
  margin-bottom: 25px;
  padding: 14px 0;
  cursor: pointer;
  color: #126dbc;
  background-image: url(/static/media/button.1ecc2f97.svg);
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 20;
`;

const LogedIn = () => {
  let ref = useRef();

  const [horizontalLenght, setHorizontalLength] = useState({
    top: 0,
    count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

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

  function getDiaryList() {
    let userId = window.localStorage.getItem("user");
    axios.get("/api/getDiaryList/?id=" + userId).then((response) => {
      let arr = response.data.data;
      if (response.data.success == false) {
        window.localStorage.clear();
        window.location.reload();
      }
      if (arr.length) {
        setList(arr);
        setLoading(false);
      } else {
        window.location.replace("/create");
      }
    });
  }

  useEffect(() => {
    setTimeout(() => {
      calculateHorizontalLineLength();
    }, 1000);
    getDiaryList();
    window.addEventListener("resize", calculateHorizontalLineLength);

    return () => {
      window.removeEventListener("resize", calculateHorizontalLineLength);
    };
  }, []);

  return (
    <Container>
      <NoteWrapper>
        <Note ref={ref} id="test">
          {loading && !list.length ? (
            <LoadWrapper>
              <Loading />
            </LoadWrapper>
          ) : (
            <React.Fragment>
              <Title>
                <FormattedMessage id="myDiarys" />
              </Title>
              {list.map((diary, index) => (
                <Diary
                  to={"/diary/" + diary.diary_hash}
                  key={shortid.generate()}
                >
                  <span>{index + 1}</span>
                  {diary.title}
                </Diary>
              ))}
              <ButtonWrapper>
                <Button to="/create">
                  <FormattedMessage id="add" />
                </Button>
              </ButtonWrapper>
            </React.Fragment>
          )}
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

export default LogedIn;
