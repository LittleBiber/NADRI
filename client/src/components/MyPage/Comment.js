import React from "react";
import styled from "styled-components";



const ItemContainer = styled.div`
  height: 10rem;
  display: flex;
  border: 1px solid black;
  margin-bottom: 3rem;
  padding: 1rem;
  gap: 2rem;
  border-radius: 10px;

  & {
    .imgContainer {
      transition: transform 0.2s linear;
      transform: scale(1);
    }
  }

  &:hover {
    .imgContainer {
      transition: all 0.2s linear;
      border:none;
      transform: scale(1.4);
    }
  }
`

const ItemImg = styled.div`
  width: 8rem;
  border: 1px solid black;
  border-radius: 5px;
  > img {
    display: block;
    width: 100%;
    height: auto;
  }
`

const ItemInfo = styled.div`
  width: 20rem;
  cursor: grab;
  .title {
    display: flex;
    align-items: center;
    width: 100%;
    height: 2rem;
    border: 1px solid black;
    border-radius: 5px;
    margin-bottom: 1rem;
    padding: 0.2rem 0.2rem;
  }

  .desc {
    height: 5rem;
    border-radius: 5px;
    border: 1px solid black;
    padding: 0.2rem 0.2rem;
  }
`

export default function Comment ({comment}) {
  return (
    <div>
      <ItemContainer>
        <ItemImg className="imgContainer">
          <img src={`${comment.img}`}></img>
        </ItemImg>

        <ItemInfo>
          <div className="title">{comment.title}</div>
          <div className="desc">{comment.comment}</div>
        </ItemInfo>
      </ItemContainer>
    </div>
  )
}