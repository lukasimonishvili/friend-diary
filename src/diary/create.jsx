import React, { useState, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";

import deleteIcon from "../assets/img/delete.svg";
import backgroundImage from "../assets/img/main-background.png";
import Button from "../shared/button";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e8e8e8;

  @media screen and (max-height: 828px) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  max-height: 828px;
  height: 100%;

  @media screen and (max-width: 600px) {
    width: 100%;
    flex-direction: column;
    padding: 15px 30px;
  }
`;

const Backgrounds = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
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

  @media screen and (max-width: 600px) {
    max-height: 34px;
    margin-bottom: 10px;
  }
`;

const Canvas = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 17px;
  transition: 0.4s;
  text-align: center;
  background-color: ${props => props.background};
  background-image: url(${backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const CanvasWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 667px;

  @media screen and (max-width: 885px) {
    width: calc(100vw - 174px);
  }

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Stickers = styled.div`
  height: 100%;
  margin-left: 5px;
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

  @media screen and (max-width: 600px) {
    width: 100%;
    height: auto;
    margin-top: 15px;
    display: flex;
    align-items: center;
    overflow-y: hidden;
    overflow-x: auto;
  }
`;

const Colors = styled.div`
  max-height: 100%;
  overflow-y: auto;

  @media screen and (max-width: 600px) {
    display: flex;
    align-items: center;
    overflow-x: auto;
    max-height: 34px;
    max-width: calc(100vw - 60px);
  }
`;

const ColorCircle = styled.div`
  margin-top: 15px;
  border-radius: 50%;
  width: 68px;
  height: 68px;
  background-color: ${props => props.color};

  @media screen and (max-width: 885px) {
    width: 34px;
    height: 34px;
  }

  @media screen and (max-width: 600px) {
    margin-top: 0;
    margin-left: 15px;
  }
`;

const Title = styled.h5`
  font-size: 18px;
  line-height: 29px;
  color: #303031;
  text-align: center;

  @media screen and (max-width: 885px) {
    font-size: 14px;
    line-height: 24px;
  }
`;

const Sticker = styled.img`
  width: 140px;
  height: auto;
  display: block;
  margin-top: 50px;
  cursor: pointer;

  @media screen and (max-width: 885px) {
    width: 70px;
    margin-top: 25px;
  }

  @media screen and (max-width: 600px) {
    margin-top: 0;
    margin-left: 15px;
    height: 70px;
    width: auto;
  }
`;

const Input = styled.input`
  position: absolute;
  left: 0;
  top: 15%;
  z-index: 10;
  width: 100%;
  height: 92px;
  font-size: 56px;
  color: white;
  text-align: center;
  border: none;
  background: transparent;
  outline: transparent;

  &::placeholder {
    color: white;
    text-align: center;
  }

  @media screen and (max-width: 885px) {
    font-size: 30px;
    font-size: 28px;
  }
`;

const Draggable = styled.div`
  width: 140px;
  position: absolute;
  z-index: 1;
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

const Delete = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: -20px;
`;

const CreateDiary = () => {
  const [data, setData] = useState({
    colors: ["transparent"],
    stickers: []
  });

  const [activeStickers, setActiveStickers] = useState([]);

  const [activeColor, setActiveColor] = useState();

  useEffect(() => {
    let test = {
      colors: ["#99C8B9", "#E55858", "#FACC32", "#B324DE", "#3EA1F7"],
      stickers: ["sticker-1", "sticker-2", "sticker-3", "sticker-4"]
    };
    setData(test);
    setActiveColor(test.colors[0]);
  }, []);

  let mouseDown = false;
  let touchedIndex = -1;
  let dragableElement;

  function defineActiveColor(color) {
    setActiveColor(color);
  }

  function onSubmit() {
    let canvas = document.getElementById("canvas");
    let payload = {
      color: activeColor,
      title:
        document.getElementById("inp").value == "daarqvi saxeli" ||
        document.getElementById("inp").value == ""
          ? "axali dRiuri"
          : document.getElementById("inp").value,
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

    window.localStorage.setItem("payload", JSON.stringify(payload));
    window.location.replace("/create/questions");
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

  return (
    <Container>
      <Wrapper>
        <Backgrounds>
          <Colors>
            <Title>ფერი</Title>
            {data.colors.map(color => (
              <ColorCircle
                key={shortid.generate()}
                color={color}
                onClick={() => {
                  defineActiveColor(color);
                }}
              />
            ))}
          </Colors>
        </Backgrounds>
        <CanvasWrapper>
          <Canvas
            background={activeColor}
            id="canvas"
            onMouseMove={e => {
              handleMouseMove(e);
            }}
            onMouseUp={e => {
              handleMouseUp(e);
            }}
          >
            <Input
              id="inp"
              defaultValue="daarqvi saxeli"
              placeholder="daarqvi saxeli"
            />
            <Button click={onSubmit} text="daiwye" />
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
                <Delete
                  onClick={e => {
                    removeFromCanvas(index, e);
                  }}
                  alt=""
                  src={deleteIcon}
                />
              </Draggable>
            ))}
          </Canvas>
        </CanvasWrapper>
        <Stickers>
          <Title>აარჩიე</Title>
          {data.stickers.map(sticker => (
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
      </Wrapper>
    </Container>
  );
};

export default CreateDiary;
