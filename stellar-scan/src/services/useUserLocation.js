import { useState } from 'react';

export default function useUserLocation() {
  const [location, setLocation] = useState(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude.toFixed(6),
          lon: position.coords.longitude.toFixed(6),
        };
        setLocation(coords);
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  };

  return { location, detectLocation };
}