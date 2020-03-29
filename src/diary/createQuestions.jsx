import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";

import deleteIcon from "../assets/img/delete.svg";
import normIcon from "../assets/img/norm.png";
import mathIcon from "../assets/img/math.png";
import buttinImage from "../assets/img/button.svg";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    padding: 10px 30px;
  }
`;

const Note = styled.div`
  width: 667px;
  height: 828px;
  padding: 0 38px;
  padding-top: ${props => (props.type == "normal" ? 78 + "px" : 25 + "px")};
  border-radius: 17px;
  background-color: #f1f7fb;
  z-index: 25;
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
  left: ${props => props.left};
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
  padding-top: ${props => (props.type === "normal" ? "10px" : "63px")};
`;

const Question = styled.p`
  position: relative;
  margin-bottom: 25px;
  font-size: 25px;
  color: #126dbc;
  padding-right: 25px;
  z-index: 15;
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
  right: 0;
`;

const Defaults = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Defs = styled.div`
  line-height: 25px;
  font-size: 15px;
  padding-left: 8px;
  padding-right: 14px;
  border: 1px dashed #126dbc;
  color: #126dbc;
  margin: 25px 10px;
  margin-top: 0;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 15;

  @media screen and (max-width: 600px) {
    width: 100%;
    margin: 0;
    margin-bottom: 25px;
  }
`;

const Plus = styled.div`
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid #126dbc;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 8px;

  &::after {
    content: "+";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: normal;
    color: #126dbc;
  }
`;

const Custom = styled.div`
  padding: 0 10px;
  width: 100%;
  height: 25px;
  border: 1px dashed #126dbc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 15;
`;

const Inp = styled.input`
  width: calc(100% - 20px);
  height: 100%;
  border: none;
  background-color: transparent;
  font-size: 20px;
  color: #126dbc;
  outline: transparent;
`;

const Heading = styled.h5`
  font-size: 18px;
  line-height: 29px;
  color: #303031;
  text-align: center;

  @media screen and (max-width: 972px) {
    font-size: 14px;
    line-height: 22px;
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

  @media screen and (max-width: 600px) {
    height: 30px;
    width: auto;
    margin-top: 0;
    margin-left: 15px;
    overflow-x: auto;
  }
`;

const Stickers = styled.div`
  height: 828px;
  margin-left: 5px;
  overflow-y: auto;

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
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: center;
    margin-top: 5px;
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
    margin-left: 25px;
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
  cursor: pointer;
  z-index: 16;
  position: relative;
  background-color: transparent;
  margin: 35px 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const Draggable = styled.div`
  width: 140px;
  position: absolute;
  z-index: 12;
  cursor: pointer;
  top: ${props => props.top};
  left: ${props => props.left};

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

const QuestionsCreate = () => {
  const ref = useRef(null);
  const [noteType, setNoteType] = useState("norm");
  const [horizontalLenght, setHorizontalLength] = useState({
    top: 0,
    count: 0
  });
  const [verticalLength, setVerticalLength] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [defaultQuestions, setDefaultQuestion] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [activeStickers, setActiveStickers] = useState([]);

  let mouseDown = false;
  let touchedIndex = -1;
  let dragableElement;

  function onSubmit() {
    let canvas = document.getElementById("canvas");
    let payload = JSON.parse(window.localStorage.getItem("payload"));
    let pQuestions = {
      list: questions,
      stickers: activeStickers.map(sticker => {
        let obj = sticker;
        let width = +getComputedStyle(canvas).width.split("px")[0] / 100;
        let height = +getComputedStyle(canvas).height.split("px")[0] / 100;

        let top = +obj.y.toString().split("px")[0] / height + "%";
        let left = +obj.x.toString().split("px")[0] / width + "%";

        obj.x = left;
        obj.y = top;

        return obj;
      })
    };

    payload = { ...payload, questions: pQuestions, texture: noteType };
    window.localStorage.setItem("payload", JSON.stringify(payload));
    window.location.replace("/share/23231123322333");
  }

  function addStickerInCanvas(image) {
    if (activeStickers.length < 7) {
      setActiveStickers(old => [...old, { id: old.length, x: 0, y: 0, image }]);
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

  function getDefaultQuestions() {
    setDefaultQuestion([
      "ra aris Seni gen gegma?",
      "gaxsovs visi goris xar?",
      "ra gqvia?",
      "ramdeni wlis xar?",
      "colad gamomyvebi?"
    ]);
  }

  function removeQuestion(i) {
    let newQuestions = [...questions];
    newQuestions.splice(i, 1);
    setQuestions(newQuestions);
  }

  function addQuestion(question) {
    if (questions.length < 12) {
      if (question) {
        setQuestions(old => [...old, question]);
      } else {
        let inp = document.getElementById("inp");
        if (inp.value.length) {
          let val = inp.value;
          setQuestions(old => [...old, val]);
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

  useEffect(() => {
    renderLines();
    getDefaultQuestions();
    getStickers(["sticker-1", "sticker-2", "sticker-3", "sticker-4"]);

    window.addEventListener("resize", renderLines);

    return () => {
      window.removeEventListener("resize", renderLines);
    };
  }, []);

  return (
    <Container>
      <Textures>
        <Heading>ტექსტურა</Heading>
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
          onMouseMove={e => {
            handleMouseMove(e);
          }}
          onMouseUp={e => {
            handleMouseUp(e);
          }}
        >
          <Title>SearCie kiTxvebi</Title>
          <Form>
            {questions.map((question, i) => (
              <Question key={shortid.generate()}>
                <Delete
                  src={deleteIcon}
                  alt=""
                  onClick={() => {
                    removeQuestion(i);
                  }}
                />
                <Qnumber>{i + 1}</Qnumber>
                {question}
              </Question>
            ))}
            <Defaults>
              {defaultQuestions.map(question => (
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
                  onKeyUp={e => {
                    console.log(e.keyCode);
                    if (e.keyCode === 13) {
                      addQuestion();
                      e.target.blur();
                    }
                  }}
                />
              </Custom>
            </Defaults>
            <ButtonWrapper>
              <Button onClick={onSubmit}>Seqmna</Button>
            </ButtonWrapper>
          </Form>
          {activeStickers.map((activeSticker, index) => (
            <Draggable
              key={shortid.generate()}
              top={activeSticker.y}
              left={activeSticker.x}
            >
              <StikcerInCanvas
                alt=""
                src={require("../assets/img/stickers/" +
                  activeSticker.image +
                  ".png")}
                onMouseDown={e => {
                  handleMouseDown(e, index);
                }}
                onTouchStart={e => {
                  handleTouchStart(e, index);
                }}
                onTouchEnd={() => {
                  handleTouchEnd();
                }}
                onTouchMove={handleTouchMove}
              />
              <DeleteSticker
                onClick={e => {
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
        {stickers.map(sticker => (
          <Sticker
            key={shortid.generate()}
            alt=""
            src={require("../assets/img/stickers/" + sticker + ".png")}
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
