import React, { useState, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";
import axios from "axios";
import Button from "../shared/button";
import Div100vh from "react-div-100vh";

import Loading from "../shared/spinner";
import bckgr from "../assets/img/main-background.png";
import bodyImage from "../assets/img/body.jpg";

const Container = styled(Div100vh)`
  width: 100%;
  background-color: #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;
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

const Cover = styled.div`
  width: 667px;
  height: 828px;
  border-radius: 17px;
  background-color: ${(props) => props.color};
  position: relative;
  overflow: hidden;
  background-image: url(${bckgr});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 17px;
  box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 727px) {
    width: 100%;
  }

  @media screen and (max-height: 848px) {
    height: 100%;
  }
`;

const Sticker = styled.img`
  position: absolute;
  width: 21%;
  height: auto;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  z-index: 1;
`;

const Title = styled.h2`
  position: absolute;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 73px;
  top: ${(props) => props.top + "%"};
  left: ${(props) => props.left + "%"};
  z-index: 2;

  @media screen and (max-width: 600px) {
    font-size: 40px;
  }
`;

const Fill = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let userId = window.localStorage.getItem("user");
    axios
      .get(
        "https://megobrebi.ge/api/fillDiaryGet?hash=" +
          props.id +
          "&id=" +
          userId
      )
      .then((response) => {
        if (response.data.success) {
          window.location.replace("/filled");
        } else {
          axios
            .post("https://megobrebi.ge/api/getOneDiary", {
              hash: props.id,
            })
            .then((response) => {
              window.localStorage.setItem(
                "fill",
                JSON.stringify(response.data)
              );
              let data = {
                color: response.data.diary[0].color,
                stickers: response.data.diary_stickers,
                title: {
                  text: response.data.diary[0].title_ka,
                  x: response.data.diary[0].title_x_coordinate,
                  y: response.data.diary[0].title_y_coordinate,
                },
              };
              setData(data);
              setLoading(false);
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      {loading && !data ? (
        <Loading />
      ) : (
        <Cover color={data.color}>
          <Title top={data.title.y} left={data.title.y}>
            {data.title.text}
          </Title>
          <Button text="daiwye" link={"/fill/questions/" + props.id} />
          {data.stickers.map((sticker) => (
            <Sticker
              key={shortid.generate()}
              alt=""
              src={sticker.sticker_image}
              top={sticker.y}
              left={sticker.x}
            />
          ))}
        </Cover>
      )}
    </Container>
  );
};

export default Fill;
