import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";
import axios from "axios";
import Div100vh from "react-div-100vh";
import OnOutsiceClick from "react-outclick";

import deleteIcon from "../assets/img/delete.svg";
import normIcon from "../assets/img/norm.png";
import mathIcon from "../assets/img/math.png";
import buttinImage from "../assets/img/button.svg";
import bodyImage from "../assets/img/body.jpg";

import Loading from "../shared/spinner";

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled(Div100vh)`
  width: 100%;
  overflow: hidden;
  background-color: #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${bodyImage});
  background-size: cover;
  background-position: top right;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    padding: 10px 30px;
  }
`;

const Note = styled.div`
  width: 667px;
  height: 828px;
  padding: 0 38px;
  padding-top: ${(props) => (props.type == "normal" ? 78 + "px" : 25 + "px")};
  border-radius: 17px;
  background-color: #f1f7fb;
  z-index: 25;
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

  @media screen and (max-height: 828px) {
    height: calc(100vh - 20px);
  }

  @media screen and (max-width: 972px) {
    width: calc(100vw - 215px);
  }

  @media screen and (max-width: 600px) {
    width: 100%;
    height: calc(100vh - 110px);
  }
`;

const NoteWrapper = styled.div`
  overflow: hidden;
  position: relative;
  border-radius: 17px;
  box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.3);
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
  z-index: 8;
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
  height: 100%;
  top: 0;
  left: ${(props) => props.left};
  background-color: #b0dbf4;
`;

const Title = styled.h4`
  position: relative;
  font-size: 24px;
  line-height: 40px;
  color: #126dbc;
  z-index: 16;
  float: right;
`;

const Form = styled.div`
  width: 100%;
  clear: right;
  padding-top: ${(props) => (props.type === "normal" ? "10px" : "45px")};
`;

const Question = styled.p`
  position: relative;
  margin-bottom: 25px;
  font-size: 25px;
  color: #126dbc;
  padding-right: 25px;
  z-index: 15;
  /* pointer-events: none; */
`;

const Qnumber = styled.span`
  padding-right: 37px;
`;

const Delete = styled.img`
  width: 20px;
  height: auto;
  cursor: pointer;
  position: absolute;
  top: 0;
  pointer-events: initial;
  right: 0;
`;

const Defaults = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & span {
    width: calc(100% - 22px);
  }

  @media screen and (max-width: 600px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Defs = styled.div`
  line-height: 50px;
  font-size: 20px;
  padding-left: 8px;
  padding-right: 14px;
  border: 1px dashed #126dbc;
  color: #126dbc;
  margin: 25px 10px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 15;
  cursor: pointer;
  transition: 0.3s;

  &:last-child {
    margin-bottom: 25px;
  }

  &:hover {
    border-color: #ffe200;
    color: #ffe200;

    & div {
      border-color: #ffe200;

      &::after {
        color: #ffe200;
      }
    }
  }

  @media screen and (max-width: 600px) {
    margin: 0;
    margin-top: 25px;
    width: calc(100% - 50px);
    padding: 0 5px;
  }
`;

const Plus = styled.div`
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid #126dbc;
  border-radius: 50%;
  margin-right: 8px;

  &::after {
    content: "+";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    line-height: 17px;
    color: #126dbc;
  }
`;

const Custom = styled.div`
  padding: 0 10px;
  width: 100%;
  height: 40px;
  border: 1px dashed #126dbc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 16;
`;

const Inp = styled.input`
  width: calc(100% - 20px);
  height: 100%;
  border: none;
  background-color: transparent;
  font-size: 20px;
  color: #126dbc;
  outline: transparent;

  &::placeholder {
    color: #126dbc;
  }
`;

const Heading = styled.h5`
  font-size: 18px;
  line-height: 29px;
  color: #303031;
  text-align: center;
  color: white;

  @media screen and (max-width: 972px) {
    font-size: 14px;
    line-height: 22px;
  }

  @media screen and (max-width: 600px) {
    align-self: flex-end;
  }
`;

const Textures = styled.div`
  height: 828px;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
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

  @media screen and (max-height: 828px) {
    height: calc(100vh - 20px);
  }

  @media screen and (max-width: 600px) {
    width: 100%;
    height: auto;
    flex-direction: row;
    justify-content: flex-start;
    margin-right: 0;
    margin-bottom: 5px;
  }
`;

const Texture = styled.img`
  margin-top: 16px;
  cursor: pointer;

  @media screen and (max-width: 600px) {
    height: 30px;
    width: auto;
    margin-top: 0;
    margin-left: 15px;
    overflow-x: auto;

    @supports (-webkit-touch-callout: none) {
      overflow-x: scroll;
    }
  }
`;

const Stickers = styled.div`
  height: 828px;
  margin-left: 5px;
  overflow-y: auto;
  position: relative;

  @supports (-webkit-touch-callout: none) {
    overflow-y: scroll;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
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

  @media screen and (max-height: 828px) {
    height: calc(100vh - 20px);
  }

  @media screen and (max-width: 600px) {
    width: 100%;
    height: 70px;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: center;
    margin-top: 5px;
    position: relative;

    @supports (-webkit-touch-callout: none) {
      overflow-x: scroll;
    }
  }
`;

const Sticker = styled.img`
  width: 140px;
  height: auto;
  display: block;
  margin-top: 50px;
  cursor: pointer;

  @media screen and (max-width: 972px) {
    width: 70px;
    margin-top: 25px;
  }

  @media screen and (max-width: 600px) {
    margin-top: 0;
    height: 70px;
    width: auto;
    margin-left: 55px;
  }
`;

const Button = styled.button`
  text-align: center;
  color: #126dbc;
  font-size: 21px;
  line-height: 35px;
  border: none;
  background-color: transparent;
  outline: transparent;
  background-image: url(${buttinImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  cursor: ${(props) => (props.valid ? "pointer" : "no-drop")};
  z-index: 16;
  position: absolute;
  background-color: transparent;
  bottom: 30px;
  right: 5px;
  opacity: ${(props) => (props.valid ? 1 : 0.4)};
`;

const Draggable = styled.div`
  width: 140px;
  position: absolute;
  z-index: 12;
  cursor: pointer;
  top: ${(props) => props.top};
  left: ${(props) => props.left};

  @media screen and (max-width: 885px) {
    width: 21%;
  }
`;

const StikcerInCanvas = styled.img`
  width: 100%;
  height: auto;
`;

const DeleteSticker = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: -20px;
`;

const StickerSearch = styled.input`
  display: block;
  margin: 0 auto;
  width: 130px;
  font-size: 12px;
  line-height: 16px;
  font-family: "Lato" !important;
  font-weight: 900;
  background-color: white;
  padding-left: 10px;
  border-radius: 10px;
  outline: transparent;
  border: none;
  top: 22px;
  left: 0;
  position: sticky;

  @media screen and (max-width: 885px) {
    width: 85px;
  }

  @media screen and (max-width: 600px) {
    position: sticky;
    left: 0;
    top: 0;
    margin-top: -15px;
    margin-left: -32px;
  }
`;

const LoadMore = styled.div`
  width: 80%;
  margin: 0 auto;
  font-size: 25px;
  color: #126dbc;
  text-align: start;
  cursor: pointer;
  position: relative;
  z-index: 20;
`;

const SuggenstBox = styled.div`
  width: 100%;
  padding: 20px 10px;
  background-color: white;
  border-radius: 0 0 10px 10px;
  position: absolute;
  left: 0;
  top: 38px;
  transition: 0.4s;
  transform: ${(props) => (props.show ? "scale(1)" : "scale(0)")};
`;

const Sug = styled.p`
  width: 100%;
  color: #126dbc;
  font-size: 16px;
  padding: 15px 0;
  /* line-height: 22px; */
  cursor: pointer;
`;

let usedDefaults = [];

const QuestionsCreate = (props) => {
  const ref = useRef(null);
  const [noteType, setNoteType] = useState("norm");
  const [horizontalLenght, setHorizontalLength] = useState({
    top: 0,
    count: 0,
  });
  const [verticalLength, setVerticalLength] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [defaultQuestions, setDefaultQuestion] = useState([]);
  const [activeDefs, setActiveDefs] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [activeStickers, setActiveStickers] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [Load, setLoad] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  let mouseDown = false;
  let touchedIndex = -1;
  let dragableElement;

  let submited = false;

  function holdData() {
    let payload = {
      stickers: activeStickers,
      questions: questions,
    };

    localStorage.setItem("onHold", JSON.stringify(payload));
  }

  function setHoldedData() {
    let payload = JSON.parse(localStorage.getItem("onHold"));
    if (payload) {
      setActiveStickers(payload.stickers);
      setQuestions(payload.questions);
      localStorage.removeItem("onHold");
    }
  }

  function onSubmit() {
    if (!submited && questions.length == 12) {
      submited = true;
      let canvas = document.getElementById("canvas");
      let payload = JSON.parse(window.localStorage.getItem("payload"));
      let pQuestions = {
        list: questions.map((q) => {
          if (typeof q == "string") {
            return q;
          } else {
            return q.question_ka;
          }
        }),
        stickers: activeStickers.map((sticker) => {
          let obj = sticker;
          let width = +getComputedStyle(canvas).width.split("px")[0] / 100;
          let height = +getComputedStyle(canvas).height.split("px")[0] / 100;

          let top = +obj.y.toString().split("px")[0] / height + "%";
          let left = +obj.x.toString().split("px")[0] / width + "%";

          obj.x = left;
          obj.y = top;

          delete obj["image"];

          return obj;
        }),
      };
      if (props.edit) {
        let editPayload = {
          id: window.localStorage.getItem("user"),
          hash: props.edit.hash,
          questions: pQuestions,
        };

        axios
          .post("https://megobrebi.ge/api/updateDiaryQuestion", editPayload)
          .then((response) => {
            window.location.replace("/diary/" + props.edit.hash);
          })
          .catch(() => {
            window.location.replace("/diary/" + props.edit.hash);
          });
      } else {
        payload = { ...payload, texture_key: noteType, questions: pQuestions };
        axios
          .post("https://megobrebi.ge/api/new/dairy", payload)
          .then((response) => {
            window.localStorage.removeItem("stickers");
            window.localStorage.removeItem("payload");
            setLoad(true);
            axios
              .get("https://megobrebi.ge/api/getDiaryList/?id=" + payload.id)
              .then((listResponse) => {
                let list = listResponse.data.data;
                let lastHash = list[list.length - 1].diary_hash;
                if (lastHash) {
                  window.location.replace("/diary/" + lastHash);
                } else {
                  window.location.replace("/");
                }
              })
              .catch(() => {
                window.location.replace("/");
              });
          });
      }
    }
  }

  function addStickerInCanvas(image) {
    if (activeStickers.length < 7) {
      setActiveStickers((old) => [
        ...old,
        { id: image.id, x: 0, y: 0, image: image.image },
      ]);
    }
  }

  function removeFromCanvas(i, e) {
    e.preventDefault();
    let arr = [...activeStickers];
    arr.splice(i, 1);
    setActiveStickers(arr);
  }

  function handleMouseMove(e) {
    if (mouseDown) {
      e.persist();
      let x =
        e.nativeEvent.layerX -
        +getComputedStyle(dragableElement).width.split("px")[0] / 2;
      let y =
        e.nativeEvent.layerY -
        +getComputedStyle(dragableElement).height.split("px")[0] / 2;
      dragableElement.style.left = x + "px";
      dragableElement.style.top = y + "px";
    }
  }

  function handleMouseDown(e, i) {
    let canvas = document.getElementById("canvas");
    canvas.style.cursor = "pointer";

    for (let k = 0; k < canvas.childElementCount; k++) {
      let element = canvas.childNodes[k];
      element.style.pointerEvents = "none";
    }

    mouseDown = true;
    touchedIndex = i;
    dragableElement = e.target.parentNode;
  }

  function handleMouseUp() {
    if (mouseDown) {
      mouseDown = false;

      let stickers = [...activeStickers];
      stickers[touchedIndex].x = getComputedStyle(dragableElement).left;
      stickers[touchedIndex].y = getComputedStyle(dragableElement).top;
      setActiveStickers(stickers);

      let canvas = document.getElementById("canvas");
      canvas.style.cursor = "auto";
      for (let k = 0; k < canvas.childElementCount; k++) {
        let element = canvas.childNodes[k];
        element.style.pointerEvents = "auto";
      }
    }
  }

  function handleTouchMove(e) {
    e.persist();

    let canvas = document.getElementById("canvas");
    function getPosition(element) {
      var xPosition = 0;
      var yPosition = 0;

      while (element) {
        xPosition +=
          element.offsetLeft - element.scrollLeft + element.clientLeft;
        yPosition += element.offsetTop - element.scrollTop + element.clientTop;
        element = element.offsetParent;
      }

      return { x: xPosition, y: yPosition };
    }

    let canvasPosition = getPosition(canvas);

    let x =
      e.targetTouches[0].pageX -
      canvasPosition.x -
      +getComputedStyle(dragableElement).width.split("px")[0] / 2;
    let y =
      e.targetTouches[0].pageY -
      canvasPosition.y -
      +getComputedStyle(dragableElement).height.split("px")[0] / 2;

    dragableElement.style.left = x + "px";
    dragableElement.style.top = y + "px";
  }

  function handleTouchStart(e, i) {
    dragableElement = e.target.parentNode;
    touchedIndex = i;
    document.body.style.overflow = "hidden";
  }

  function handleTouchEnd() {
    let stickers = [...activeStickers];
    stickers[touchedIndex].x = getComputedStyle(dragableElement).left;
    stickers[touchedIndex].y = getComputedStyle(dragableElement).top;

    document.body.style.overflow = "auto";

    setActiveStickers(stickers);
  }

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

  function calculeteVerticalLineLength() {
    if (ref.current) {
      let result;
      let note = ref.current;
      let width = +getComputedStyle(note).width.split("px")[0];
      result = Math.floor(width / 25);
      setVerticalLength(result);
    }
  }

  function getDefaultQuestions() {
    let questionsRquest = axios.get("https://megobrebi.ge/api/questions");
    let stickerRequest = axios.get("https://megobrebi.ge/api/stickers");
    let localStikcers = JSON.parse(window.localStorage.getItem("stickers"));
    let requests = [questionsRquest];

    if (!localStikcers) {
      requests.push(stickerRequest);
    } else {
      getStickers(localStikcers);
    }

    axios.all(requests).then((responses) => {
      let unfilterd = responses[0].data.map((question) => question.question);
      let filtered = [...new Set(unfilterd)];
      setDefaultQuestion(filtered);
      pagination(filtered);

      if (responses[1]) {
        getStickers(responses[1].data);
      }
      setLoad(false);
    });
  }

  function pagination(arr) {
    let fullList = arr ? arr : [...defaultQuestions];
    let count = fullList.length;
    let currentCount = activeDefs.length;

    if (!currentCount) {
      if (count < 20) {
        setActiveDefs(fullList);
      } else {
        let currentList = fullList.slice(0, 20);
        setActiveDefs(currentList);
        setLoadMore(true);
      }
    } else {
      if (count - currentCount < 20) {
        setActiveDefs(fullList);
        setLoadMore(false);
      } else {
        let currentList = fullList.slice(0, currentCount + 19);
        setActiveDefs(currentList);
      }
    }
  }

  function removeQuestion(i) {
    let newQuestions = [...questions];
    let oldIndex = usedDefaults.indexOf(newQuestions[i]);
    if (oldIndex > -1) {
      let defs = [...activeDefs];
      defs.push(newQuestions[i]);
      usedDefaults.splice(oldIndex, 1);
      setActiveDefs(defs);
    }
    newQuestions.splice(i, 1);
    setQuestions(newQuestions);
  }

  function addQuestion(question) {
    if (questions.length < 12) {
      if (question) {
        usedDefaults.push(question);
        let defs = [...activeDefs];
        defs.splice(defs.indexOf(question), 1);
        setActiveDefs(defs);
        setQuestions((old) => [...old, question]);
      } else {
        let inp = document.getElementById("inp");
        if (inp.value.length) {
          let val = inp.value;
          setQuestions((old) => [...old, val]);
          inp.value = "";
        }
      }
    }
  }

  function defineTexture(type) {
    setNoteType(type);
  }

  function getStickers(arr) {
    setStickers(arr);
  }

  function renderLines() {
    calculateHorizontalLineLength();
    calculeteVerticalLineLength();
  }

  function onSearch(e) {
    if (e.target.value == "") {
      axios.get("https://megobrebi.ge/api/stickers").then((response) => {
        setStickers(response.data);
      });
    }

    let query = e.target.value.replace(/\s/g, "-");

    if (e.target.value.length == 1 || e.target.value.length % 3 == 0) {
      axios
        .get(`https://megobrebi.ge/api/search/stickerName?name=${query}`)
        .then((response) => {
          setStickers(response.data);
        });
    }
  }

  function setEditData() {
    let localDiary = JSON.parse(window.localStorage.getItem("payloadToEdit"));
    let localStikcers = JSON.parse(window.localStorage.getItem("stickers"));
    let requests = [];
    let activeRequest = [];
    let stickerRequest = axios.get("https://megobrebi.ge/api/stickers");
    let diaryRequest = axios.post("https://megobrebi.ge/api/getOneDiary", {
      hash: props.edit.hash,
    });

    if (!localDiary) {
      requests.push(diaryRequest);
      activeRequest.push("d");
    } else {
      let diaryStickers = localDiary.question_stickers[0];
      setQuestions(localDiary.questions);
      setActiveStickers(
        diaryStickers.map((stckr) => {
          let result = stckr;
          result.image = result.sticker_image;
          delete result["sticker_image"];
          return result;
        })
      );
    }

    if (!localStikcers) {
      requests.push(stickerRequest);
      activeRequest.push("s");
    } else {
      setStickers(localStikcers);
    }

    if (activeRequest.length) {
      axios.all(requests).then((responses) => {
        let diaryIndex = activeRequest.indexOf("d");
        let stickersIndex = activeRequest.indexOf("s");

        if (diaryIndex > -1) {
          let diary = responses[diaryIndex];
          let diaryStickers = diary.data.question_stickers[0];
          setQuestions(diary.data.questions);
          setActiveStickers(
            diaryStickers.map((stckr) => {
              let result = stckr;
              result.image = result.sticker_image;
              delete result["sticker_image"];
              return result;
            })
          );
        }

        if (stickersIndex > -1) {
          let stickersList = responses[stickersIndex];
          setStickers(stickersList.data);
        }

        setLoad(false);
      });
    } else {
      setLoad(false);
    }
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".kvkLEv:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function setNewOrder() {
    let questionTags = document.getElementsByClassName("kvkLEv");
    const untouchable = [...questions];
    let result = [...questions];

    for (let i = 0; i < questionTags.length; i++) {
      let element = questionTags[i];
      let index = element.childNodes[0].innerHTML - 1;
      // console.log(element.childNodes[0]);
      result[i] = untouchable[index];
    }

    setQuestions(result);
  }

  useEffect(() => {
    renderLines();

    if (!props.edit) {
      getDefaultQuestions();
    } else {
      setEditData();
    }

    setHoldedData();

    window.addEventListener("resize", renderLines);

    return () => {
      window.removeEventListener("resize", renderLines);
    };
  }, []);

  return (
    <Container>
      <Textures>
        <Heading style={{ color: "black" }}>ტექსტურა</Heading>
        <Texture
          alt=""
          src={normIcon}
          onClick={() => {
            defineTexture("norm");
          }}
        />
        <Texture
          alt=""
          src={mathIcon}
          onClick={() => {
            defineTexture("math");
          }}
        />
      </Textures>
      <NoteWrapper>
        <Note
          ref={ref}
          type={noteType}
          id="canvas"
          onMouseMove={(e) => {
            handleMouseMove(e);
          }}
          onMouseUp={(e) => {
            handleMouseUp(e);
          }}
        >
          {Load ? (
            <LoadingWrapper>
              <Loading />
            </LoadingWrapper>
          ) : (
            <React.Fragment>
              <Title>
                {!props.edit ? "SearCie kiTxvebi" : "daalage kiTxvebi"}
              </Title>
              <Form>
                <div
                  id="t"
                  onDragOver={(e) => {
                    e.preventDefault();
                    let container = document.getElementById("t");
                    const afterElement = getDragAfterElement(
                      container,
                      e.clientY
                    );
                    const draggable = document.querySelector(".dragging");
                    if (afterElement == null) {
                      container.appendChild(draggable);
                    } else {
                      container.insertBefore(draggable, afterElement);
                    }
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    let container = document.getElementById("t");
                    const afterElement = getDragAfterElement(
                      container,
                      e.touches[0].clientY
                    );
                    const draggable = document.querySelector(".dragging");
                    if (afterElement == null) {
                      container.appendChild(draggable);
                    } else {
                      container.insertBefore(draggable, afterElement);
                    }
                  }}
                >
                  {questions.map((question, i) => (
                    <Question classList="draggable" key={shortid.generate()}>
                      <Qnumber>{i + 1}</Qnumber>
                      <span
                        draggable="true"
                        onDragStart={(e) => {
                          let element;
                          if (e.target.tagName == "SPAN") {
                            element = e.target.parentNode;
                          } else {
                            element = e.target;
                          }
                          element.style.opacity = ".5";
                          element.classList.add("dragging");
                        }}
                        onDragEnd={(e) => {
                          let element;
                          if (e.target.tagName == "SPAN") {
                            element = e.target.parentNode;
                          } else {
                            element = e.target;
                          }
                          element.style.opacity = "1";
                          element.classList.remove("dragging");
                          setNewOrder();
                        }}
                        onTouchStart={(e) => {
                          ref.current.style.overflowY = "hidden";
                          let element;
                          if (e.target.tagName == "SPAN") {
                            element = e.target.parentNode;
                          } else {
                            element = e.target;
                          }
                          element.style.opacity = ".5";
                          element.classList.add("dragging");
                        }}
                        onTouchEnd={(e) => {
                          ref.current.style.overflowY = "auto";
                          let element;
                          if (e.target.tagName == "SPAN") {
                            element = e.target.parentNode;
                          } else {
                            element = e.target;
                          }
                          element.style.opacity = "1";
                          element.classList.remove("dragging");
                          setNewOrder();
                        }}
                      >
                        {typeof question == "string"
                          ? question
                          : question.question_ka}
                      </span>
                      {props.edit ? (
                        <React.Fragment></React.Fragment>
                      ) : (
                        <Delete
                          src={deleteIcon}
                          alt=""
                          onClick={() => {
                            removeQuestion(i);
                          }}
                        />
                      )}
                    </Question>
                  ))}
                </div>
                <Defaults>
                  {props.edit ? (
                    <React.Fragment></React.Fragment>
                  ) : (
                    <Custom>
                      <label
                        htmlFor="inp"
                        onClick={() => {
                          addQuestion();
                        }}
                      >
                        <Plus />
                      </label>
                      <Inp
                        id="inp"
                        type="text"
                        placeholder="axali SekiTxva"
                        onKeyUp={(e) => {
                          if (e.keyCode === 13) {
                            addQuestion();
                            e.target.blur();
                          }
                          let keyWord = e.target.value;
                          if (keyWord.length) {
                            // let testQ = [];
                            let testQ = [
                              "ra aris Seni gen gegma?",
                              "gamarjoba...",
                              "rogor xar?",
                            ];
                            if (testQ.length) {
                              setSuggestions(testQ);
                            } else {
                              setSuggestions([]);
                            }
                            axios
                              .post(
                                "https://megobrebi.ge/api/Search/Question",
                                {
                                  question: keyWord,
                                }
                              )
                              .then((response) => {
                                console.log(response);
                              });
                          } else {
                            setSuggestions([]);
                          }
                          console.log(e.target.value);
                        }}
                      />
                      <SuggenstBox show={!!suggestions.length}>
                        <OnOutsiceClick
                          onOutsideClick={() => {
                            if (suggestions.length) {
                              setSuggestions([]);
                            }
                          }}
                        >
                          {suggestions.map((q) => (
                            <Sug
                              key={shortid.generate()}
                              onClick={() => {
                                addQuestion(q);
                                setSuggestions([]);
                                document.getElementById("inp").value = "";
                              }}
                            >
                              {q}
                            </Sug>
                          ))}
                        </OnOutsiceClick>
                      </SuggenstBox>
                    </Custom>
                  )}
                  {activeDefs.map((question) => (
                    <Defs
                      key={shortid.generate()}
                      onClick={() => {
                        addQuestion(question);
                      }}
                    >
                      <Plus />
                      <span>{question}</span>
                    </Defs>
                  ))}
                </Defaults>
                <Button
                  valid={questions.length == 12 ? true : false}
                  onClick={onSubmit}
                >
                  {props.edit ? "Senaxva" : "Seqmna"}
                </Button>
                {loadMore ? (
                  <LoadMore
                    onClick={() => {
                      pagination();
                    }}
                  >
                    metis naxva...
                  </LoadMore>
                ) : (
                  <React.Fragment></React.Fragment>
                )}
                <div
                  id="scroll"
                  style={{ width: "100%", height: "50px" }}
                ></div>
              </Form>
            </React.Fragment>
          )}
          {activeStickers.map((activeSticker, index) => (
            <Draggable
              key={shortid.generate()}
              top={activeSticker.y}
              left={activeSticker.x}
            >
              <StikcerInCanvas
                alt=""
                src={activeSticker.image}
                onMouseDown={(e) => {
                  handleMouseDown(e, index);
                }}
                onTouchStart={(e) => {
                  handleTouchStart(e, index);
                }}
                onTouchEnd={() => {
                  handleTouchEnd();
                }}
                onTouchMove={handleTouchMove}
              />
              <DeleteSticker
                onClick={(e) => {
                  removeFromCanvas(index, e);
                }}
                alt=""
                src={deleteIcon}
              />
            </Draggable>
          ))}
          <RedLine type={noteType} />
          {[...Array(horizontalLenght.count)].map((e, i) => {
            return (
              <Horizontal
                key={shortid.generate()}
                top={i * 25 + horizontalLenght.top + "px"}
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
            <React.Fragment></React.Fragment>
          )}
        </Note>
      </NoteWrapper>
      <Stickers>
        <Heading>აარჩიე</Heading>
        <StickerSearch onKeyUp={onSearch} type="text" placeholder="ძიება..." />
        {stickers.map((sticker) => (
          <Sticker
            key={shortid.generate()}
            alt=""
            src={sticker.image}
            onClick={() => {
              addStickerInCanvas(sticker);
            }}
          />
        ))}
      </Stickers>
    </Container>
  );
};

export default QuestionsCreate;
