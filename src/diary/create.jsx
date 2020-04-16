import React, { useState, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";
import axios from "axios";
import domtoimage from "dom-to-image";
import Div100vh from "react-div-100vh";

import Loading from "../shared/spinner";

import { FormattedMessage } from "react-intl";

import deleteIcon from "../assets/img/delete.svg";
import backgroundImage from "../assets/img/main-background.png";
import Button from "../shared/button";
import bodyImage from "../assets/img/body.jpg";

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
  margin-right: 10px;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: transparent;
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: transparent;
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
  background-color: ${(props) => props.background};
  background-image: url(${backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const CanvasWrapper = styled.div`
  border-radius: 17px;
  box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.3);
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

  @supports (-webkit-touch-callout: none) {
    overflow-y: scroll;
    /* -webkit-overflow-scrolling: touch; */
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: transparent;
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    height: 5px;
    width: 5px;
    background-color: transparent;
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
    height: 70px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    overflow-y: hidden;
    overflow-x: auto;
    position: relative;

    @supports (-webkit-touch-callout: none) {
      overflow-x: scroll;
      /* -webkit-overflow-scrolling: touch; */
    }
  }
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

const Colors = styled.div`
  max-height: 100%;
  overflow-y: auto;

  @supports (-webkit-touch-callout: none) {
    overflow-y: scroll;
    /* -webkit-overflow-scrolling: touch; */
  }

  @media screen and (max-width: 600px) {
    display: flex;
    align-items: center;
    overflow-x: auto;
    max-height: 34px;
    max-width: calc(100vw - 60px);

    @supports (-webkit-touch-callout: none) {
      overflow-x: scroll;
    }
  }
`;

const ColorCircle = styled.div`
  margin-top: 15px;
  border-radius: 50%;
  width: 68px;
  height: 68px;
  background-color: ${(props) => props.color};
  cursor: pointer;

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
  color: white;
  text-align: center;

  @media screen and (max-width: 885px) {
    font-size: 14px;
    line-height: 24px;
  }

  @media screen and (max-width: 600px) {
    align-self: flex-end;
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
    margin-left: 55px;
    height: 70px;
    width: auto;
  }
`;

const Input = styled.input`
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  z-index: 10;
  width: 100%;
  height: 92px;
  font-size: 56px;
  color: white;
  text-align: center;
  border: none;
  background: transparent;
  outline: transparent;
  user-select: initial;

  &::placeholder {
    text-align: center;
  }

  @media screen and (max-width: 885px) {
    font-size: 28px;
  }
`;

const Draggable = styled.div`
  width: 140px;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  top: ${(props) => props.top};
  left: ${(props) => props.left};

  @media screen and (max-width: 885px) {
    width: 21%;
  }
`;

const StikcerInCanvas = styled.div`
  width: 100%;
  height: ${(props) => props.height};
  background-image: url(${(props) => props.image});
  background-size: cover;
`;

const Delete = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: -20px;
  user-select: none;
`;

const CreateDiary = (props) => {
  const [data, setData] = useState({
    colors: ["transparent"],
    stickers: [],
  });
  const [loading, setLoading] = useState(true);

  const [activeStickers, setActiveStickers] = useState([]);

  const [inpPosition, setInpPosition] = useState({
    x: 0,
    y: "15%",
    text: "",
  });

  const [stickerHeight, setStickerHeight] = useState("140px");

  const [activeColor, setActiveColor] = useState();
  const [defaultTitle, setDefaultTitle] = useState("daarqvi saxeli");
  let touchMoved = false;

  function getData() {
    let colorRequest = axios.get("https://megobrebi.ge/api/colors");
    let stikcerRequest = axios.get("https://megobrebi.ge/api/stickers");
    let requests = [colorRequest, stikcerRequest];

    if (props.edit) {
      let diaryRequest = axios.post("https://megobrebi.ge/api/getOneDiary", {
        hash: props.edit.hash,
      });
      requests.push(diaryRequest);
    }

    axios.all(requests).then((requests) => {
      let payload = {
        colors: requests[0].data,
        stickers: requests[1].data,
      };
      setData(payload);

      if (requests[2]) {
        let diary = requests[2].data;
        window.localStorage.setItem("payloadToEdit", JSON.stringify(diary));
        let diaryStickers = diary.diary_stickers.map((stick) => {
          return {
            id: stick.sticker_id,
            image: stick.sticker_image,
            x: stick.x,
            y: stick.y,
          };
        });

        setInpPosition({
          x: diary.diary[0].title_x_coordinate + "%",
          y: diary.diary[0].title_y_coordinate + "%",
        });

        setDefaultTitle(diary.diary[0].title_ka);
        setActiveColor(diary.diary[0].color);
        setActiveStickers(diaryStickers);
      } else {
        setActiveColor(payload.colors[0]);
      }

      setLoading(false);
      window.localStorage.setItem("stickers", JSON.stringify(payload.stickers));
    });
  }

  function calculateStikcerHeight() {
    let canvas = document.getElementById("canvas");

    if (window.innerWidth > 885) {
      setStickerHeight("140px");
    } else {
      let height =
        (+getComputedStyle(canvas).width.split("px")[0] / 100) * 21 + "px";
      setStickerHeight(height);
    }
  }

  useEffect(() => {
    getData();
    calculateStikcerHeight();
    window.addEventListener("resize", calculateStikcerHeight);

    return () => {
      window.removeEventListener("resize", calculateStikcerHeight);
    };
  }, []);

  let mouseDown = false;
  let touchedIndex = -1;
  let dragableElement;

  function defineActiveColor(color) {
    setActiveColor(color);
  }

  function editDiary(data) {
    if (props.edit) {
      let payload = data;
      payload.id = props.edit.userId;
      payload.hash = props.edit.hash;

      axios
        .post("https://megobrebi.ge/api/updateDiaryCover", payload)
        .then((response) => {
          window.location.replace(`/edit/questions/${props.edit.hash}`);
        });
    }
  }

  function onSubmit() {
    let canvas = document.getElementById("canvas");
    let width = +getComputedStyle(canvas).width.split("px")[0] / 100;
    let height = +getComputedStyle(canvas).height.split("px")[0] / 100;

    let deleteButtons = document.getElementsByClassName("delete");
    for (let i = deleteButtons.length - 1; i >= 0; i--) {
      let item = deleteButtons[i];
      item.parentNode.removeChild(item);
    }

    domtoimage
      .toBlob(canvas)
      .then(function (blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          var base64data = reader.result;
          let title = {
            text:
              document.getElementById("inp").value == "daarqvi saxeli" ||
              document.getElementById("inp").value == ""
                ? "axali dRiuri"
                : document.getElementById("inp").value,
            x: inpPosition.x.toString().includes("%")
              ? inpPosition.x
              : +inpPosition.x.toString().split("px")[0] / width,
            y: inpPosition.y.toString().includes("%")
              ? inpPosition.y
              : +inpPosition.y.toString().split("px")[0] / height,
          };

          let payload = {
            id: window.localStorage.getItem("user"),
            base64: base64data,
            diary: {
              color: activeColor,
              title,
              stickers: activeStickers.map((sticker) => {
                let obj = sticker;
                let top = obj.x.toString().includes("%")
                  ? obj.x
                  : +obj.y.toString().split("px")[0] / height + "%";
                let left = obj.x.toString().includes("%")
                  ? obj.x
                  : +obj.x.toString().split("px")[0] / width + "%";
                obj.x = left;
                obj.y = top;
                delete obj["image"];
                return obj;
              }),
            },
          };

          if (props.edit) {
            editDiary(payload);
          } else {
            window.localStorage.setItem("payload", JSON.stringify(payload));
            window.location.replace("/create/questions");
          }
        };
      })
      .catch((err) => {
        let title = {
          text:
            document.getElementById("inp").value == "daarqvi saxeli" ||
            document.getElementById("inp").value == ""
              ? "axali dRiuri"
              : document.getElementById("inp").value,
          x: +inpPosition.x.toString().split("px")[0] / width,
          y: +inpPosition.y.toString().split("px")[0] / height,
        };

        let payload = {
          id: window.localStorage.getItem("user"),
          base64:
            "data:image/jpeg;base64,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zzzTzzzzzzzzzzzzzzzzzzzzjzzzzzzzzzyTzzzzzhzzzzzzzzzzzzzzzzzzzzzzzjzzzzzzzzzzTzzzzzzxzzzzzzzzzzyzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzTzzzyzzzzzzzzzzzzzzjTzzzyhzzzzzzzzzzzzzzhTzzzzzwjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwzzzzzzzzzzzzzzzyxzzzzzzTzzzzzzzzzzzzzzzzzyTzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzTzzzzDzzzzzzzzzzzjzzzzzjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzyxwzzzzzzzzzzzzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzxzzzzzzyjzzzyzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzjzyzzzzzzzzzzzzzzzzzzTzzjTzzzzzzzzzzzzzzj3zzzzz7zzzzzzzzzzzzzTzhyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzyTzzzyjzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyjzzzzyzzzzzzzzzzzzzzyDzzzzzzzzzzzzzzzzzzzzzxTzzzzzzzzzzzzzzzzzzzzzzzzzzzSzzzzyhTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzwjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjbzzzzzzzzyzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzyxTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzzzzzDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxTzzzzwDzzzzzzzzzjzzzzzzyhRzyDzzzzzzzzzzzzzzzjzzzzzzzzzyyzzzzzzzzzzzzzzzzzzzzzzzjTzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzzzzzyzzzzyhTzzyhzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzTyzzzzzzzzzzzzzzzzjzzzzzzzzzzzzzzzzzzzzyjzzzzzzzzzzzzzzzzzzzzzzzzzzzzTzyzzzzzzzzzzzjzzzzzzzzzzzzzzzwzzzzzzzzzzwzzTzzzyzzzzzzzzzzzTzzzzzzzjTzzzzzzzzzzzzzzzzwjzzzzzzzzzzzzzzzzzzzzzzzzzyzzzyjzzzzzzzzzzzzzzzzzzzzzzzzxzzzjTzzzzzzyzzzxzzzzzzzyzzzzzzzzzzzzzzxzzTzzzzzxTzzzzzzzzzzzzzzzzjTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzzzzzzzzzzzzzzzzzzyxzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzTzzzzyjzzzzzzzzzzzzzzzzzjzxzzzzzzzzzzyzzzzzjTzzzTzzzzzzzzzzzyjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxzzzzzzzzzzzzzzzzzzzzzzzyzzzzyxzzzzzzzzzzzzzRzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzyjzzzzzzzjzzjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjTzzzyxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyjzzzzzzzzzzzzzzzzzzzzzzzzzyxzyTzzzzzzzzzzzzzjzzzzzzxzzzzzzzzzzzzzzzzzzzzzzxzzxzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzyjzzzTzzzzzjTzzzzzzzzzzzzzzzzzjzzDzzzzzzzzzzyTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjDzzzzzzzzzzzzzzzDzyzzzxzyxzzzzzzzzzzzjzzzzTyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxjzzzzzzzzzzzzzzzzzzzzzwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzTzzzzzzzzzzzzzzzzzzzzzxjzzzzzzzzzDzzzzzzzzzzzzzzzzzzyzTzzzzzzzzzzzzzwzzzzzzzzzzzzzzzzzzzzzzzzzzzzhzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwzzzzzzzzzzzzzzzzzDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzDzzzzzzzzzzzzzzzzzzzzzxTzzzzzzzzzzzzzxzzzzzzzzzzzzzTzzzzzzzjzzzzTzzzzzzzzzjzzzzzjTzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzjzzxDzzzzzRzzjTzzzzzzzzzzzzzzzzzzxzyzzzzzzzzzzzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzTzzzzzzzzzzzzzzzxzzzzzzzzzzzyxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzzzzzzzDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzyxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwxTzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjTzzzyzzzzzzxzzzzzzzzzzzzCbbzzzzzzzzzzzzzzzzzxxzzzzzzzzzzzzzzzzzzzzzzzwTzzzzzzzzzzzzzzzzzzzzzzzzzTzyxzzzzzzxzzzzzzzzzzzzzzzzzxzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxTzzzzzzzzzzzzzzzwzzzzzzzzzzzzzzzzzDTzzj/wA888888488w888888888888884888888888888840888o088888888888888888808888888888888888888888o88888MM8888c888s888888s8888888888888888888888888488sc888s888884088884s8888M8888888888888880888888M88888888888888888888888888888888888g88888888888888s88888888888sc888848uU88488c88888880888888c888888888888888888888888888888888888888888888888888888888888888888888888888sc8c8888888888888c8888888888888888888888888888888888w88c888888848888888888888888s88888888888888888888888888s08888888888888888888888888888888888880888888M88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888c488888888888888888888888888888888888884A888888888888888888888c88888888888888888888888888888888888888s88888oU88888888888888888888888888888M888w888888888888888888888888888888888888888888888888888888888c8888888c888888I88888888888888888888888888s888888888888888888888888888888888888U0888888c888888888888888888888888888888888888888888888888888888888s888888888888888888888888888888840s888888888888888888888888888888888888888/8QAHhEAAgIABwAAAAAAAAAAAAAAAREAMUBBYICQoLD/2gAIAQMBAT8Q0qCSYl4pZvqvP1Q0uMO6hCR2b//EACERAQABAwIHAAAAAAAAAAAAAAERADFgQZAgIUBhcKCw/9oACAECAQE/EMVehI6UAEHVXRHqvPFOwqI/JnmWqiY55Fbbee2BgJWoIBjI7+VP/8QALBABAQABAgYBBQEBAAIDAQAAAREhADEwQEFQUWBhECBwcYGRobHBgNHh8P/aAAgBAQABPxD8R5zAhEihWux/eB1zQWRPGgRgAA6HKf1urITp86sN35RKZJ3UJd8+woO/Ag9OVQdzW3PrNDeQCrmG5RQfMF/ntsaG9wOWojB7v0PMi5X+9x6ah32sZJF+QLXkEHcvttGwt0tRgCJjKOUqu6X0mLZoGwn1rpoglgyhK/ZTgYNZfHtqa4S2mIDw5c/OgAhg9SVBzppeBM32BYXRuIBRbet5QghSBWVenrUnm6H6TIAoqywm+yJ886gZc9mIUs+e1EoAqVUPkYj00Yng7ZjOu9dfAbrZfF4LcV9YGWH7TsYbjQDQz552Fsz2aT7kygLYu/oqDd/Adk5pL0votbimTf4fj8HCxVQX/B8dwSCQWwu+t+SKLW+PwPQZc9ui2ZOQqMY6NufNwAVVAPOhFRCiNE9mFxkU23pP+/8APql7QzJIhBI0jFIg5SwzpQfPdQYBHCPXQAAAOhwjnAgVBZoaU24AILFXd3e7oO52YIvVmgXBW0HkfsRuB/f2RyuPHfQnHpZxTgICJTZ0Aht7KBjto8YNgIH0WCiNyG3qRhgZzfHtbSfDfyu5N2bccCw7e2CaJZlDb+8lUzP5xRHZvqfWI+XQAOBlkry5Znfj4hTXO7tWPi1mlA7c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",
          diary: {
            color: activeColor,
            title,
            stickers: activeStickers.map((sticker) => {
              let obj = sticker;
              let top = +obj.y.toString().split("px")[0] / height + "%";
              let left = +obj.x.toString().split("px")[0] / width + "%";
              obj.x = left;
              obj.y = top;
              delete obj["image"];
              return obj;
            }),
          },
        };

        if (props.edit) {
          editDiary(payload);
        } else {
          window.localStorage.setItem("payload", JSON.stringify(payload));
          window.location.replace("/create/questions");
        }
      });
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
    if (i == "inp") {
      dragableElement = e.target;
    } else {
      dragableElement = e.target.parentNode;
    }
  }

  function handleMouseUp() {
    if (mouseDown) {
      mouseDown = false;
      if (touchedIndex == "inp") {
        setInpPosition({
          x: getComputedStyle(dragableElement).left,
          y: getComputedStyle(dragableElement).top,
        });
      } else {
        let stickers = [...activeStickers];
        stickers[touchedIndex].x = getComputedStyle(dragableElement).left;
        stickers[touchedIndex].y = getComputedStyle(dragableElement).top;
        setActiveStickers(stickers);
      }

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

    if (dragableElement.tagName === "INPUT") {
      touchMoved = true;
    }
  }

  function handleTouchStart(e, i) {
    if (i == "inp") {
      dragableElement = e.target;
    } else {
      dragableElement = e.target.parentNode;
    }

    touchedIndex = i;
    document.body.style.overflow = "hidden";
  }

  const isIos = () => !!window.navigator.userAgent.match(/iPad|iPhone/i);
  const hasInteracted = (() => {
    let interacted = false;
    const onTouchStart = () => {
      interacted = true;
      document.removeEventListener("touchstart", onTouchStart);
    };
    document.addEventListener("touchstart", onTouchStart);
    return () => interacted;
  })();
  const FOCUS_TYPES = {
    REAL: "real",
    FAKE: "fake",
  };
  const getFocusType = () =>
    hasInteracted() || !isIos() ? FOCUS_TYPES.REAL : FOCUS_TYPES.FAKE;
  const focus = (input) => {
    switch (getFocusType()) {
      case FOCUS_TYPES.REAL:
        return input.focus();
      case FOCUS_TYPES.FAKE:
        const onBlur = (input) => {
          document.removeEventListener(onBlur);
        };
        input.addEventListener("blur", onBlur);
        input.scrollIntoView();
    }
  };

  function handleTouchEnd(e) {
    if (dragableElement.tagName === "INPUT" && !touchMoved) {
      focus(dragableElement);
    }

    if (touchedIndex == "inp") {
      setInpPosition({
        x: getComputedStyle(dragableElement).left,
        y: getComputedStyle(dragableElement).top,
      });
    } else {
      let stickers = [...activeStickers];
      stickers[touchedIndex].x = getComputedStyle(dragableElement).left;
      stickers[touchedIndex].y = getComputedStyle(dragableElement).top;
      setActiveStickers(stickers);
    }

    document.body.style.overflow = "auto";
  }

  function onSearch(e) {
    let payload = { ...data };
    if (e.target.value == "") {
      axios.get("https://megobrebi.ge/api/stickers").then((response) => {
        payload.stickers = response.data;
        setData(payload);
      });
    }

    let query = e.target.value.replace(/\s/g, "-");

    if (e.target.value.length == 1 || e.target.value.length % 3 == 0) {
      axios
        .get(`https://megobrebi.ge/api/search/stickerName?name=${query}`)
        .then((response) => {
          payload.stickers = response.data;
          setData(payload);
        });
    }
  }

  return (
    <Container>
      <Wrapper>
        <Backgrounds>
          <Colors>
            <Title>
              <FormattedMessage id="color" />
            </Title>
            {data.colors.map((color) => (
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
            onMouseMove={(e) => {
              handleMouseMove(e);
            }}
            onMouseUp={(e) => {
              handleMouseUp(e);
            }}
          >
            <div
              id="error"
              style={{
                width: "90%",
                margin: "0 auto",
                fontFamily: "'Lato' !important",
              }}
            ></div>
            {loading ? (
              <LoadingWrapper>
                {" "}
                <Loading />{" "}
              </LoadingWrapper>
            ) : (
              <React.Fragment>
                <Input
                  top={inpPosition.y}
                  left={inpPosition.x}
                  id="inp"
                  defaultValue={defaultTitle}
                  placeholder="..."
                  onMouseDown={(e) => {
                    handleMouseDown(e, "inp");
                  }}
                  onTouchStart={(e) => {
                    handleTouchStart(e, "inp");
                  }}
                  onTouchEnd={(e) => {
                    handleTouchEnd(e);
                  }}
                  onTouchMove={handleTouchMove}
                />
                <Button click={onSubmit} text="daiwye" onTouchEnd={onSubmit} />
                {activeStickers.map((activeSticker, index) => (
                  <Draggable
                    key={shortid.generate()}
                    top={activeSticker.y}
                    left={activeSticker.x}
                  >
                    <StikcerInCanvas
                      height={stickerHeight}
                      image={activeSticker.image}
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
                    <Delete
                      onClick={(e) => {
                        removeFromCanvas(index, e);
                      }}
                      alt=""
                      src={deleteIcon}
                      className="delete"
                    />
                  </Draggable>
                ))}
              </React.Fragment>
            )}
          </Canvas>
        </CanvasWrapper>
        <Stickers>
          <Title>აარჩიე</Title>
          <StickerSearch
            onKeyUp={onSearch}
            type="text"
            placeholder="ძიება..."
          />
          {data.stickers.map((sticker) => (
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
      </Wrapper>
    </Container>
  );
};

export default CreateDiary;
