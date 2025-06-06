"use client"

// update-profile.tsx

import { useState, useEffect } from "react"

const UpdateProfile = () => {
  const [activeTab, setActiveTab] = useState(4) // 예시로 4로 설정
  const [locationData, setLocationData] = useState({
    latitude: 37.5665, // 서울 위도
    longitude: 126.978, // 서울 경도
    accuracy: 0,
    selectedLocation: "초기 위치",
    mapLoaded: false,
  })

  // 네이버 지도 API 스크립트 로드 및 위치 정보 가져오기
  useEffect(() => {
    // 위치정보 탭이 아니면 실행하지 않음
    if (activeTab !== 4) return

    // 네이버 지도 API 스크립트 로드
    const loadNaverMapsScript = () => {
      // 이미 로드된 스크립트 태그가 있는지 확인
      const existingScript = document.head.querySelector('script[src*="openapi/v3/maps.js"]')

      if (typeof window !== "undefined") {
        if (!window.naver && !existingScript) {
          // window.naver가 없고, 기존 스크립트도 없을 때만 새로 추가
          const script = document.createElement("script")
          script.type = "text/javascript"
          script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=wthem1ducp&submodules=geocoder` // 서브모듈 추가 가능
          script.async = true
          script.onload = () => {
            console.log("Naver Maps API script loaded successfully.")
            setLocationData((prev) => ({ ...prev, mapLoaded: true }))
          }
          script.onerror = () => {
            // 에러 핸들러 추가
            console.error("Failed to load Naver Maps API script.")
            // 필요한 경우, 사용자에게 알림을 표시하거나 대체 로직을 수행할 수 있습니다.
          }
          document.head.appendChild(script)
        } else if (window.naver) {
          // 이미 window.naver 객체가 존재하면 mapLoaded를 true로 설정
          console.log("Naver Maps API already available.")
          setLocationData((prev) => ({ ...prev, mapLoaded: true }))
        } else if (existingScript && !window.naver) {
          // 스크립트는 있지만 window.naver가 아직 없는 경우, 로드를 기다리거나 onload를 다시 시도할 수 있지만,
          // 이 경우는 복잡성을 증가시킬 수 있으므로, 일단은 콘솔 로그만 남깁니다.
          console.warn("Naver Maps script tag exists, but window.naver is not yet available. Waiting for it to load.")
          // 기존 스크립트에 onload 핸들러를 다시 붙이는 것은 어려울 수 있으므로,
          // 주기적으로 window.naver를 체크하는 폴링 방식을 고려할 수 있으나, 권장되지는 않습니다.
          // 가장 좋은 방법은 최초 로드 시점에 onload가 정상적으로 호출되도록 하는 것입니다.
          // 만약 이 상태가 지속된다면, 스크립트 로드 자체에 문제가 있을 수 있습니다.
          // 임시로 mapLoaded를 true로 설정하여 UI가 멈추는 것을 방지할 수 있지만, 근본적인 해결책은 아닙니다.
          // setLocationData((prev) => ({ ...prev, mapLoaded: true }));
        }
      }
    }

    loadNaverMapsScript()

    // 현재 위치 가져오기 (이 부분은 변경 없음)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          setLocationData((prev) => ({
            ...prev,
            latitude,
            longitude,
            accuracy,
            selectedLocation: "현재 위치",
          }))
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 위치 정보 캐시 시간 증가
        },
      )
    }
  }, [activeTab]) // activeTab이 변경될 때마다 실행

  // 지도 초기화 및 마커 표시 (이 부분은 변경 없음)
  useEffect(() => {
    // 위치정보 탭이 아니거나 지도가 로드되지 않았거나 window.naver가 없으면 실행하지 않음
    if (
      activeTab !== 4 ||
      !locationData.mapLoaded ||
      typeof window === "undefined" ||
      !window.naver ||
      !window.naver.maps
    ) {
      return
    }

    const mapContainer = document.getElementById("map")
    if (!mapContainer) {
      console.warn("Map container not found.")
      return
    }
    // mapContainer가 비어있지 않으면 기존 지도를 제거 (중복 생성 방지)
    if (mapContainer.innerHTML !== "") {
      // mapContainer.innerHTML = ""; // 기존 지도를 강제로 지우는 것보다, map.destroy()를 사용하는 것이 좋습니다.
    }

    let map: naver.maps.Map | null = null // map 변수를 블록 외부에서 선언

    try {
      const mapOptions = {
        center: new window.naver.maps.LatLng(locationData.latitude, locationData.longitude),
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
          style: window.naver.maps.ZoomControlStyle.SMALL,
          position: window.naver.maps.Position.TOP_LEFT,
        },
      }

      map = new window.naver.maps.Map("map", mapOptions) // 여기서 map 할당

      // 현재 위치 마커 추가
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(locationData.latitude, locationData.longitude),
        map: map,
        icon: {
          content:
            '<div style="width: 20px; height: 20px; background-color: #4285f4; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
          anchor: new window.naver.maps.Point(10, 10),
        },
      })

      // 정보창 추가
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding: 10px; font-size: 12px;">${locationData.selectedLocation}</div>`,
      })

      // 마커 클릭 시 정보창 표시
      window.naver.maps.Event.addListener(marker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close()
        } else {
          infoWindow.open(map!, marker) // map이 null이 아님을 단언
        }
      })

      // 지도 클릭 시 위치 업데이트
      window.naver.maps.Event.addListener(map, "click", (e: naver.maps.PointerEvent) => {
        const latlng = e.coord
        marker.setPosition(latlng)

        setLocationData((prev) => ({
          ...prev,
          latitude: latlng.y,
          longitude: latlng.x,
          selectedLocation: "선택한 위치",
        }))

        // 정보창 업데이트 및 열기
        infoWindow.setContent(`<div style="padding: 10px; font-size: 12px;">선택한 위치</div>`)
        infoWindow.open(map!, marker) // map이 null이 아님을 단언
      })
    } catch (error) {
      console.error("Error initializing map:", error)
    }

    return () => {
      // 지도 정리
      if (map && typeof map.destroy === "function") {
        // map 객체와 destroy 메소드 존재 여부 확인
        try {
          map.destroy()
          console.log("Map destroyed successfully.")
        } catch (e) {
          console.error("Error destroying map:", e)
        }
      }
      // mapContainer의 내용을 직접 지우는 것은 Naver Maps API의 정상적인 정리 과정을 방해할 수 있습니다.
      // if (mapContainer) {
      //   mapContainer.innerHTML = "";
      // }
    }
  }, [activeTab, locationData.mapLoaded, locationData.latitude, locationData.longitude, locationData.selectedLocation])

  return (
    <div>
      <h1>Update Profile</h1>
      <button onClick={() => setActiveTab(4)}>Enable Location (Tab 4)</button>
      {activeTab === 4 && (
        <div>
          <h2>Location Information</h2>
          <div id="map" style={{ width: "400px", height: "300px" }}></div>
          <p>Latitude: {locationData.latitude}</p>
          <p>Longitude: {locationData.longitude}</p>
          <p>Selected Location: {locationData.selectedLocation}</p>
        </div>
      )}
    </div>
  )
}

export default UpdateProfile
