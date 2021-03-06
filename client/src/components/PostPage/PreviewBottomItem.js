import React from "react";
import styled from "styled-components";
import { useRef } from "react";

const PreviewImg = styled.div`
  width: 100%;
  height: 13rem;
  border: 1px solid black;
  border-radius: 10px;
  position: relative;

  img {
    display: none;
    width: 2.5rem;
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    cursor: pointer;
  }
  background-image: url(default-image.jpg);
  background-size: cover;
  ${(props) => {
    if(props.Img[0] && props.Img[1] === undefined) { // 자기 앞에 사진이 있고 자기 자리엔 사진이 없을 경우?
      return (
        `
        transition: all 0.3s;
        img {
          display: block;
        }
        `
      )
    }
    else if(props.Img[0] && props.Img[1]) { // 
      return (
        `
        transition: all 0.3s;
        background-image: url(${props.Img[1][0]});
        background-size: contain;
        `
      )
    }
  }}
  background-repeat: no-repeat;
  background-position: center center;



  input[type='file'] {
    display: none;
  }

  img:active {
    border-radius: 50%;
    background-color: white;
  }

  #delImg {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0.5rem;
    font-size: 2.5rem;
  }
`

export default function PreviewBottom ({allImg, img, picChange, removeImg}) {
  const photoInput = useRef();
  const handleClick = () => {
    photoInput.current.click();
  }
  
  return (
    <>
      {
        img[1] === undefined ?
        <PreviewImg Img={img} >
        <input ref={photoInput} type="file" accept="image/*" multiple onChange={picChange} />
        <img src="plus.svg" alt="" onClick={handleClick} />
        </PreviewImg>
        :
        <PreviewImg Img={img}>
          <span id="delImg" onClick={(e) => removeImg(e, img[1])}>&#10005;</span>
        </PreviewImg>
      }
    </>
  )
}