/*global kakao */
import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  PostContainer,
  TopContainer,
  UploadContainer,
  BottomContainer,
  TextInputContainer,
  CheckboxContainer} from './StyledPostPage'
import Preview from "../../components/PostPage/Preview";
import PreviewBottom from "../../components/PostPage/PreviewBottom";
import {useNavigate} from 'react-router-dom'

export default function PostPage () {
  const navigate = useNavigate()

  const [loc, setLoc] = useState({
    lat: 0,
    lng: 0,
    address: '',
  })

  const [value, setValue] = useState({
    // 정보 저장하는 state
    image: [],
    title: '',
    content: '',
    public: false,
    categoryId: 1,
  });

  const picChange = (event) => { // 이미지를 추가하는 함수
    // 나는 Blob이 싫다
    const urlArr = [...value.image], image = event.target.files;
    for (let i = 0; i < image.length; i++) {
      const imageUrl = URL.createObjectURL(image[i], `${image[i].name}`, {type: `image` });
      urlArr.push([imageUrl, event.target.files[i]]);
    }

    handleValue({ id: 'image', value: urlArr });
    // console.log(value.image)
  };

  const removeImg = (event, curImg) => {
    // 이미지를 제거하는 함수
    // splice함수 실행한 값을 할당하면 그 제거된 값만 저장된다.
    // 실행만 시키거나 다른 변수에 저장시켜야 함.
    // 그것도 싫다면 다른 함수를 적용해야 함

    URL.revokeObjectURL(event.target.src); // 제거할 링크를 revoke시켜 메모리 낭비를 방지(해야 한다네요)
    // tmp.splice(event.target.id + 1, 1);
    // console.log(event.target)

    const delImage = curImg
    const newImgArr = value.image.filter(x => {
      return x !== delImage
    })

    handleValue({ id: 'image', value: [...newImgArr] });
  };

  const handleValue = (target) => {
    // value state를 조정하는 함수. 좌표/주소는 한번에 처리해야 해서 복잡해짐
    // id가 loc이면 한번에 업데이트
    // console.log(target)

      setValue({
        ...value,
        [`${target.id}`]: target.value,
      });
  };

  const handleLoc = (data) => {
    setLoc(data)
  }

  const submit = async () => {
    // 포스트 게시하는 함수
    const formData = new FormData();

    for (let i = 0; i < value.image.length; i++) {
      formData.append('image', value.image[i][1]);
    }
    formData.append('address', loc.address)
    formData.append('lat', loc.lat)
    formData.append('lng', loc.lng)

    const val = Object.keys(value);
    for (let i = 0; i < val.length; i++) {
      if (val[i] === 'image') continue
      formData.append(`${val[i]}`, value[val[i]]);
    }

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/post`,
      data: formData, // 어떤 레퍼런스는 files로 하던데 죽어도 안되서 변경
      headers: { 'content-type': 'multipart/form-data' },
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
    
    navigate('/') // 리턴된 페이지로 이동?
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('위치 확인에 성공하였습니다.')
      kakaoInit([position.coords.latitude, position.coords.longitude], true)
    }, (error) => {
      console.log('현재 위치 확인이 불가한 상황입니다.')
      kakaoInit([37.5655493, 126.9777104], false)
    })
  }, []);

  const geocoder = new kakao.maps.services.Geocoder();

  // 주소 받아오는 함수
  const setAddress = (locData) => {
    geocoder.coord2Address(
      locData.getLng(),
      locData.getLat(),
      function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          handleLoc({lat: locData.Ma, lng: locData.La, address: result[0].address.address_name});
        }
      }
    );
  };

  const kakaoInit = async ([lat, lng]) => {
    // 지도 생성
    const map = new kakao.maps.Map(document.getElementById('map'), {
      center: new kakao.maps.LatLng(lat, lng),
      level: 5,
    });
    map.addControl(
      new kakao.maps.ZoomControl(),
      kakao.maps.ControlPosition.RIGHT
    );

    // 마커 생성
    let marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
    });
    // 마커를 지도에 표시
    marker.setMap(map);

    // 수정: 온클릭 이벤트로 위치 정보를 수정
    kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
      // 클릭한 위도, 경도 정보를 가져옵니다
      let latlng = mouseEvent.latLng;
      // 마커 위치를 클릭한 위치로 이동 + 주소 출력
      marker.setPosition(latlng);
      setAddress(new kakao.maps.LatLng(latlng.Ma, latlng.La))
    });

    setAddress(new kakao.maps.LatLng(lat, lng))
    
  }


  return (

    <PostContainer>

      <TopContainer>
        <UploadContainer>
          <Preview Img={value.image} picChange={picChange} removeImg={removeImg} />
          <PreviewBottom Img={value.image} picChange={picChange} removeImg={removeImg} />
        </UploadContainer>
        <div id="map"></div>
      </TopContainer>

      <BottomContainer>
        <TextInputContainer>
          <input id="title" onChange={(event) => handleValue(event.target)} />
        
          <pre><textarea id="content" rows="10" cols="50" onChange={(event) => handleValue(event.target)} /></pre>
        </TextInputContainer>

        <CheckboxContainer>
          <div>
            <button onClick={submit}>업로드</button>
          </div>

          <div className="checkbox">
            <input
              type="checkbox"
              onClick={() => handleValue({ id: "public", value: !value.public })}
            />
            <span>{value.public ? "공개" : "비공개"}</span>
          </div>

          <div className="category">
            <select
              className="w150"
              onChange={(e) =>
                handleValue({ id: "categoryId", value: Number(e.target.value) })
              }
            >
              <option value={1}>테스트</option>
              <option value={2}>여행</option>
              <option value={3}>카페</option>
              <option value={4}>맛집</option>
              <option value={5}>산책</option>
            </select>
          </div>

        <div>
          <button onClick={() => console.log(value, loc)}>ㅡㅡ</button>
          <span>{loc.address}</span>
        </div>
      </CheckboxContainer>
      </BottomContainer>
    </PostContainer>
  );
}