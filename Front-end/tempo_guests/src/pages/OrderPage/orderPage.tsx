import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGlobalStore } from '../../shared/state/globalStore';
import { Button, Container } from '@mui/material';
import Footer from '../../modules/footer/Footer';
import Header from '../../modules/header/Header';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Иконка машинки
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Позиция ресторана
const restaurantPosition: LatLngExpression = [53.90423370835105, 30.339150355782486];

// Компонент движущейся машинки
interface MovingMarkerProps {
  positions: LatLngExpression[];
  duration: number;
  onFinish?: () => void;
}

const MovingMarker: React.FC<MovingMarkerProps> = ({ positions, duration, onFinish }) => {
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression>(positions[0] || [0, 0]);

  const calculateRotation = useCallback((current: LatLngExpression, next: LatLngExpression) => {
    if (!Array.isArray(current) || !Array.isArray(next)) return 0;
    const dx = next[1] - current[1];
    const dy = next[0] - current[0];
    return Math.atan2(dy, dx) * 180 / Math.PI + 90;
  }, []);

  useEffect(() => {
    if (positions.length <= 1) {
      setCurrentPosition(positions[0] || [0, 0]);
      return;
    }

    const startTime = Date.now();
    let animationFrameId: number;
    let prevIndex = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      const exactIndex = progress * (positions.length - 1);
      const currentIndex = Math.floor(exactIndex);
      const partialProgress = exactIndex - currentIndex;

      if (currentIndex < positions.length - 1) {
        const current = positions[currentIndex];
        const next = positions[currentIndex + 1];
        
        if (Array.isArray(current) && Array.isArray(next)) {
          const newPosition: LatLngExpression = [
            current[0] + (next[0] - current[0]) * partialProgress,
            current[1] + (next[1] - current[1]) * partialProgress
          ];
          setCurrentPosition(newPosition);
        }
      } else {
        setCurrentPosition(positions[positions.length - 1]);
        onFinish?.();
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [positions, duration, onFinish]);

  return <Marker position={currentPosition} icon={carIcon} />;
};

// Компонент содержимого карты
interface MapContentProps {
  routeLine: LatLngExpression[];
  userPosition: LatLngExpression;
}

const MapContent: React.FC<MapContentProps> = ({ routeLine, userPosition }) => {
  const map = useMap();
  const polylineRef = useRef<L.Polyline>(null);

  useEffect(() => {
    if (polylineRef.current && routeLine.length > 0) {
      const bounds = L.latLngBounds(routeLine);
      bounds.extend(userPosition);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, routeLine, userPosition]);

  const calculateDuration = (route: LatLngExpression[]) => {
    if (route.length < 2) return 30;
    
    let totalDistance = 0;
    for (let i = 1; i < route.length; i++) {
      totalDistance += latLng(route[i-1]).distanceTo(route[i]);
    }
    
    // Средняя скорость 30 км/ч (8.33 м/с)
    return Math.max(10, Math.min(totalDistance / 8.33, 60)); // Ограничиваем от 10 до 60 секунд
  };

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {routeLine.length > 0 && (
        <>
          <Polyline
            ref={polylineRef}
            positions={routeLine}
            color="blue"
            weight={5}
            opacity={0.7}
          />
          <MovingMarker 
            positions={routeLine} 
            duration={calculateDuration(routeLine)}
            onFinish={() => console.log('Курьер прибыл!')}
          />
        </>
      )}
      
      <Marker position={restaurantPosition}>
        <Popup>Ресторан</Popup>
      </Marker>
      
      <Marker position={userPosition}>
        <Popup>Ваше местоположение</Popup>
      </Marker>
    </>
  );
};

// Основной компонент страницы заказа
const OrderPage: React.FC = () => {
  const { currentOrder, getOrder, getWaitTime, waitTime } = useGlobalStore();
  const [routeLine, setRouteLine] = useState<LatLngExpression[]>([]);
  const [userPosition, setUserPosition] = useState<LatLngExpression>(restaurantPosition);

  const fetchRoute = useCallback(async (from: LatLngExpression, to: LatLngExpression) => {
    try {
      const fromArr = Array.isArray(from) ? from : [from.lat, from.lng];
      const toArr = Array.isArray(to) ? to : [to.lat, to.lng];
      
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${fromArr[1]},${fromArr[0]};${toArr[1]},${toArr[0]}?overview=full&geometries=geojson`
      );

      const coordinates = response.data.routes[0].geometry.coordinates;
      setRouteLine(coordinates.map((coord: [number, number]): LatLngExpression => [coord[1], coord[0]]));
    } catch (error) {
      console.error('Ошибка при построении маршрута:', error);
      setRouteLine([restaurantPosition, userPosition]);
    }
  }, []);

  useEffect(() => {
    const successCallback = (position: GeolocationPosition) => {
      const newPosition: LatLngExpression = [position.coords.latitude, position.coords.longitude];
      setUserPosition(newPosition);
      fetchRoute(restaurantPosition, newPosition);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Ошибка геолокации:', error);
    };

    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    getOrder();
    getWaitTime();
  }, [getOrder, getWaitTime]);

  const getOrderStatusText = () => {
    switch (currentOrder.status) {
      case 0: return "принят";
      case 1: return "готовится";
      case 2: return "скоро принесут";
      case 3: return "готов";
      default: return "";
    }
  };

  const extractMinutesNumber = (timeString: string): number => {
    return parseInt(timeString.split(':')[1], 10) || 0;
  };

  const timeLeft = extractMinutesNumber(waitTime);

  return (
    <Container className="Container">
      <Header />
      <div id="content">
        <div id="cart">
          <div>Ваш заказ {getOrderStatusText()}</div>
          <div>{timeLeft <= 0 ? "Ваш заказ скоро будет готов" : `Еще примерно ${timeLeft} минут`}</div>
          <Button id="button" variant="contained">
            Запросить счет
          </Button>
          <MapContainer
            center={userPosition}
            zoom={13}
            style={{ height: '25rem', width: '25rem', margin: 'auto', marginTop: '3rem' }}
          >
            <MapContent routeLine={routeLine} userPosition={userPosition} />
          </MapContainer>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default OrderPage;