import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";
import { Link } from "@reach/router";
import Div100vh from "react-div-100vh";
import { FormattedMessage } from "react-intl";
import axios from "axios";

import Loading from "../shared/spinner";
import bodyImage from "../assets/img/body.jpg";
import btn from "../assets/img/button.svg";

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    /* -webkit-overflow-scrolling: touch; */
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
  margin-bottom: 37px;
  padding-right: 24px;
`;

const Filler = styled.div`
  font-size: 25px;
  color: #126dbc;
  display: block;
  margin-bottom: 17px;
  font-family: "Lato" !important;

  & span {
    padding-right: 35px;

    @media screen and (max-width: 727px) {
      padding-right: 15px;
    }
  }
`;

const FillerWrapper = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 20;
`;

const Read = styled.div`
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

const Button = styled(Link)`
  font-size: 25px;
  cursor: pointer;
  color: #126dbc;
  background-image: url(/static/media/button.1ecc2f97.svg);
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 20;
  margin-top: 18px;
`;

const Label = styled.h5`
  font-size: 10px;
  line-height: 12px;
  font-family: "Lato" !important;
  font-weight: 900;
  margin-bottom: 10px;
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
  position: relative;
  z-index: 200;

  @media screen and (max-width: 500px) {
    font-size: 10px;
    line-height: 20px;
  }

  @keyframes bounce {
    0% {
      transform: scale(0.3);
    }

    100% {
      transform: scale(1);
    }
  }
`;

const Empty = styled.div`
  font-size: 25px;
  color: #126dbc;
  margin-top: 45px;
  margin-bottom: 27px;
  position: relative;
  z-index: 20;
`;

const Diary = (props) => {
  let ref = useRef();

  const [horizontalLenght, setHorizontalLength] = useState({
    top: 0,
    count: 0,
  });
  const [list, setList] = useState([]);
  const [copy, setCopy] = useState(false);
  const [Load, setLoad] = useState(true);
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
        count: result,
      });
    }
  }

  function handleMouseOver(data) {
    window.localStorage.removeItem("answer");
    window.localStorage.setItem("answer", JSON.stringify(data));
  }

  function copyText(e) {
    e.persist();
    var from = e.target;
    var range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(from);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 5000);

    e.target.style.animation = "bounce 1s";

    setTimeout(() => {
      e.target.style.animation = "none";
    }, 1000);
  }

  let userId = window.localStorage.getItem("user");
  let shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://megobrebi.ge/shared/${userId}/${props.id}`;

  function editFb() {
    let wrapper = document.getElementsByClassName(
      "sharethis-inline-share-buttons"
    )[0];
    setTimeout(() => {
      let clone = wrapper.childNodes[0].cloneNode(true);
      let fb = `<div class="st-btn st-first" data-network="facebook" style="display: inline-block;">
      <img alt="facebook sharing button" src="https://platform-cdn.sharethis.com/img/facebook.svg">
      <span class="st-label">Share</span>
      </div>`;
      wrapper.childNodes[0].outerHTML = fb;
      wrapper.childNodes[0].addEventListener("click", () => {
        window.open(
          shareUrl,
          "_blank",
          "location=yes,height=570,width=520,scrollbars=yes,status=yes"
        );
      });
    }, 1000);
  }

  useEffect(() => {
    if (userId) {
      axios
        .get("/api/DiaryUserChecker?hash=" + props.id + "&id=" + userId)
        .then((response) => {
          if (response.data == true) {
            axios
              .post("/api/getDiaryAnswers", {
                hash: props.id,
                id: userId,
              })
              .then((answers) => {
                let result = [];
                let data = answers.data.data;
                for (let item of Object.keys(data)) {
                  result.push({
                    name: data[item].user.name,
                    list: data[item].answers,
                  });
                }
                setList(result);
                setLoad(false);
                setTimeout(() => {
                  calculateHorizontalLineLength();
                  if (window.__sharethis__) {
                    window.__sharethis__.initialize();
                    editFb();
                  }
                }, 1000);
              })
              .catch(() => {
                setLoad(false);
                setTimeout(() => {
                  calculateHorizontalLineLength();
                  if (window.__sharethis__) {
                    window.__sharethis__.initialize();
                    editFb();
                  }
                }, 1000);
              });
          } else {
            window.location.replace("/fill/" + props.id);
          }
        });
    } else {
      window.localStorage.setItem("redirect", window.location.href);
      window.location.replace("https://megobrebi.ge/auth/redirect/facebook");
    }

    window.addEventListener("resize", calculateHorizontalLineLength);

    return () => {
      window.removeEventListener("resize", calculateHorizontalLineLength);
    };
  }, []);

  return (
    <Container>
      <NoteWrapper>
        <Note ref={ref}>
          {Load ? (
            <LoadingWrapper>
              <Loading />
            </LoadingWrapper>
          ) : (
            <React.Fragment>
              <Title>
                {" "}
                <FormattedMessage id="myDiary" />{" "}
              </Title>
              {list.length ? (
                list.map((filler, index) => (
                  <FillerWrapper
                    to="/read"
                    onMouseOver={() => {
                      handleMouseOver(filler.list);
                    }}
                    key={shortid.generate()}
                  >
                    <Filler>
                      <span>{index + 1}</span>
                      {filler.name}
                    </Filler>
                    <Read to="/read">
                      <FormattedMessage id="see" />
                    </Read>
                  </FillerWrapper>
                ))
              ) : (
                <Empty>
                  {" "}
                  <FormattedMessage id="empty" />{" "}
                </Empty>
              )}
              <Label>
                <FormattedMessage id="sendToFriend" />{" "}
                {copy ? "" : "(click to copy)"}
              </Label>
              <LinkLong onClick={copyText}>
                {window.location.href} {copy ? "(copyied)" : ""}
              </LinkLong>
              <div
                style={{ fontFamily: "'Lato' !important" }}
                className="sharethis-inline-share-buttons"
              ></div>
              <ButtonWrapper>
                <Button to="/">
                  <FormattedMessage id="back" />
                </Button>
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
            </React.Fragment>
          )}
        </Note>
      </NoteWrapper>
    </Container>
  );
};

export default Diary;
