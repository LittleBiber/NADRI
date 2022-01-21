/*global kakao */
import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  PostContainer,
  Container,
  TopContainer,
  UploadContainer,
  BottomContainer,
  TextInputContainer,
  CheckboxContainer,
} from "./../PostPage/StyledPostPage";
import Preview from "../../components/PostPage/Preview";
import PreviewBottom from "../../components/PostPage/PreviewBottom";
import { useNavigate, useLocation } from "react-router-dom";

export default function EditPage() {
  const navigate = useNavigate();
  const [loc, setLoc] = useState({
    lat: 0,
    lng: 0,
    address: "",
  });

  const [value, setValue] = useState({
    // 정보 저장하는 state
    image: [],
    title: "",
    content: "",
    public: false,
    categoryId: 1,
  });

  useEffect(() => {
    const param = window.location.href.split("/")[4]
    axios.get(`${process.env.REACT_APP_API_URL}/post/${param}`)
    .then((res) => {
      const Info = res.data.data
      setLoc({
        lat: Info.lat,
        lng: Info.lng,
        address: Info.address
      })
      setValue({
        image: Info.image,
        title: Info.title,
        content: Info.content,
        public: Info.public,
        categoryId: Info.categoryId
      })
    })
  }, [])

  // console.log(loc)
  // console.log(value)
  const picChange = (event) => {
    let urlArr = [...value.image],
      image = event.target.files;

    if (urlArr.length + image.length > 4)
      return alert("이미지는 4장까지 첨부 가능합니다!");

    let inputSize = 0,
      useSize = 0;

    for (let i of image) inputSize += i.size;

    urlArr.map((e) => (useSize += e[1].size));

    if (inputSize + useSize > 5000000) {
      alert("이미지는 5mb까지 첨부 가능합니다");
      return null;
    }

    for (let i = 0; i < image.length; i++) {
      const imageUrl = URL.createObjectURL(image[i], `${image[i].name}`, {
        type: `image`,
      });
      urlArr.push([imageUrl, event.target.files[i]]);
    }
    handleValue({ id: "image", value: urlArr });
  };

  const removeImg = (event, removeTarget) => {
    // 이미지를 제거하는 함수
    // splice함수 실행한 값을 할당하면 그 제거된 값만 저장된다.
    // 실행만 시키거나 다른 변수에 저장시켜야 함.
    // 그것도 싫다면 다른 함수를 적용해야 함
    // console.log(removeTarget)
    // console.log(value.image)
    URL.revokeObjectURL(removeTarget[0]); // 먼저 blob 의 링크를 revoke
    const newImgArr = value.image.filter((e) => {
      return e !== removeTarget;
    });
    // console.log(newImgArr)
    handleValue({ id: "image", value: [...newImgArr] });
  };

  const handleValue = (target) => {
    setValue({
      ...value,
      [`${target.id}`]: target.value,
    });
  };

  const handleLoc = (data) => {
    setLoc(data);
  };

  const submit = async () => {
    // 포스트 게시하는 함수
    const formData = new FormData();

    for (let i = 0; i < value.image.length; i++) {
      formData.append("image", value.image[i][1]);
    }
    formData.append("address", loc.address);
    formData.append("lat", loc.lat);
    formData.append("lng", loc.lng);

    const val = Object.keys(value);
    for (let i = 0; i < val.length; i++) {
      if (val[i] === "image") continue;
      formData.append(`${val[i]}`, value[val[i]]);
    }

    let endPoint = window.location.href.split("/")[4];

    axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/post/${endPoint}`,
      data: formData, // 어떤 레퍼런스는 files로 하던데 죽어도 안되서 변경
      headers: { "content-type": "multipart/form-data" },
    })
      .then((result) => {
        // console.log(result);
        navigate(`/detail/${endPoint}`); // 리턴된 페이지로 이동
      })
      .catch((error) => {
        console.log(error);
        alert("문제가 발생했습니다!");
      });
  };

  useEffect(async () => {
    let postData = await axios.get(
      `${process.env.REACT_APP_API_URL}/post/${
        window.location.href.split("/")[4]
      }`
    );
    postData = postData.data.data;

    const download = [];
    for (let i = 0; i < postData.image.length; i++) {
      let blobData = await axios({
        // 응답 전체를 저장
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/post/image`,
        responseType: "arraybuffer",
        data: { lnk: postData.image[i] },
      });

      // 이미지에 오류 발생 시 넘어가기
      if (!blobData.data) continue

      const convertFile = new File(
        [blobData.data],
        postData.image[i].split("/")[3],
        { type: blobData.data.type }
      );
      // console.log(convertFile);
      let imgUrl = URL.createObjectURL(convertFile);
      download.push([imgUrl, convertFile]);
    }

    // 게시글의 내용을 state에 저장
    setValue({
      image: download,
      title: postData.title,
      content: postData.content,
      public: postData.public,
      categoryId: postData.categoryId,
    });

    // 여기서는 지오로케이션이 필요가 없음(어차피 저장된 위치 가지고 수정하는거니까)
    kakaoInit([postData.lat, postData.lng]);
  }, []);

  const geocoder = new kakao.maps.services.Geocoder();

  // 주소 받아오는 함수
  const setAddress = (locData) => {
    geocoder.coord2Address(
      locData.getLng(),
      locData.getLat(),
      function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          handleLoc({
            lat: locData.Ma,
            lng: locData.La,
            address: result[0].address.address_name,
          });
        }
      }
    );
  };

  const kakaoInit = async ([lat, lng]) => {
    // 지도 생성
    const map = new kakao.maps.Map(document.getElementById("map"), {
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
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      // 클릭한 위도, 경도 정보를 가져옵니다
      let latlng = mouseEvent.latLng;
      // 마커 위치를 클릭한 위치로 이동 + 주소 출력
      marker.setPosition(latlng);
      setAddress(new kakao.maps.LatLng(latlng.Ma, latlng.La));
    });

    setAddress(new kakao.maps.LatLng(lat, lng));
  };

  return (
    <PostContainer>
      <Container>
      <TopContainer>
        <UploadContainer>
          <Preview Img={value.image} picChange={picChange} removeImg={removeImg} />
          <PreviewBottom Img={value.image} picChange={picChange} removeImg={removeImg} />
        </UploadContainer>

        <div id="map"></div>
        
      </TopContainer>

      <BottomContainer>

        <TextInputContainer>
          <div>
            <label>Title</label>
            <input id="title" value={value.title} onChange={(event) => handleValue(event.target)} placeholder="게시글의 제목을 적어주세요!" />
          </div>
          <div>
            <label>Description</label>
            <textarea value={value.content} id="content" rows="10" cols="50" onChange={(event) => handleValue(event.target)} placeholder="게시글의 내용을 적어주세요!" />
          </div>
        </TextInputContainer>

        <CheckboxContainer id="checkboxCOntainer">
          <div id="category-container">
            <label>Category</label>
            <select
              className="w150"
              onChange={(e) =>
                handleValue({ id: "categoryId", value: Number(e.target.value) })
              }
            >
              <option value={1}>여행</option>
              <option value={2}>카페</option>
              <option value={3}>맛집</option>
              <option value={4}>산책</option>
            </select>
          </div>
          <div id="address">
              <label>주소</label>
              <span>{loc.address}</span>
          </div>
          <div className="checkbox">
            <label>공개여부 :</label>
            <input
              type="checkbox"
              checked={value.public}
              onChange={() => handleValue({ id: "public", value: !value.public })}
            />
            <span>{value.public ? "공개" : "비공개"}</span>
          </div>
            <button id="Btn" onClick={submit} type="button">업로드</button>
      </CheckboxContainer>
      </BottomContainer>
      </Container>
    </PostContainer>
  );
}
