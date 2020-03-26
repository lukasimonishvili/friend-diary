import React, { useState, useEffect } from "react";
import styled from "styled-components";
import shortid from "shortid";
import Button from "../shared/button";

import Loading from "../shared/spinner";
import bckgr from "../assets/img/main-background.png";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;

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
  background-color: ${props => props.color};
  position: relative;
  overflow: hidden;
  background-image: url(${bckgr});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

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
  left: ${props => props.left};
  top: ${props => props.top};
  z-index: 1;
`;

const Title = styled.h2`
  position: absolute;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 73px;
  top: 21.5%;
  left: 0;
  z-index: 2;

  @media screen and (max-width: 600px) {
    font-size: 40px;
  }
`;

const Fill = props => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      let payload = JSON.parse(window.localStorage.getItem("payload"));
      setData(payload);
      setLoading(false);
      window.localStorage.setItem("payload", JSON.stringify(payload));
    }, 1500);
  }, []);
  return (
    <Container>
      {loading && !data ? (
        <Loading />
      ) : (
        <Cover color={data.color}>
          <Title>{data.title}</Title>
          <Button text="daiwye" link={"/fill/questions/" + props.id} />
          {data.stickers.map(sticker => (
            <Sticker
              key={shortid.generate()}
              alt=""
              src={require("../assets/img/stickers/" + sticker.image + ".png")}
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
