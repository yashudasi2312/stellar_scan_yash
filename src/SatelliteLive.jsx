import { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as satellite from 'satellite.js';
import { TextureLoader } from 'three';
import { Html } from '@react-three/drei';
import satelliteImg from './assets/satellite-svgrepo-com.png';

export default function SatelliteLive({ tle1, tle2, satName, onUpdate }) {
  const texture = useLoader(TextureLoader, satelliteImg);
  const spriteRef = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const [country, setCountry] = useState('Loading...');
  const scale = 1 / 6371;
  const satrec = satellite.twoline2satrec(tle1, tle2);

  const fetchCountryFromBackend = async (lat, lon) => {
    try {
      const res = await fetch(`http://localhost:8080/api/country?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error("Failed to fetch country");
      const result = await res.text();
      setCountry(result);
      onUpdate({ name: satName, lat, lon, country: result });
    } catch (err) {
      console.error("❌ Error fetching country from backend:", err);
      setCountry("Unknown");
      onUpdate({ name: satName, lat, lon, country: "Unknown" });
    }
  };

  useEffect(() => {
    const updateLocation = () => {
      const now = new Date();
      const posVel = satellite.propagate(satrec, now);
      const gmst = satellite.gstime(now);
      if (!posVel.position) return;

      const geo = satellite.eciToGeodetic(posVel.position, gmst);
      const lat = satellite.degreesLat(geo.latitude);
      const lon = satellite.degreesLong(geo.longitude);

      setPositionGeo(posVel.position);
      fetchCountryFromBackend(lat, lon); 
    };

    const setPositionGeo = (eciPos) => {
      const ecf = satellite.eciToEcf(eciPos, satellite.gstime(new Date()));
      const x = ecf.x * scale;
      const y = ecf.z * scale;
      const z = -ecf.y * scale;
      setPosition([x, y, z]);
    };

    updateLocation();
    const interval = setInterval(updateLocation, 5000);
    return () => clearInterval(interval);
  }, [tle1, tle2]);

  useFrame(() => {
    const now = new Date();
    const posVel = satellite.propagate(satrec, now);
    const gmst = satellite.gstime(now);
    if (!posVel.position) return;

    const ecf = satellite.eciToEcf(posVel.position, gmst);
    const x = ecf.x * scale;
    const y = ecf.z * scale;
    const z = -ecf.y * scale;

    if (spriteRef.current) {
      spriteRef.current.position.set(x, y, z);
    }
    setPosition([x, y, z]);
  });

  return (
    <>
      <sprite ref={spriteRef} scale={[0.05, 0.05, 1]}>
        <spriteMaterial map={texture} transparent />
      </sprite>

      <Html position={position} center style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '5px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          🛰️ {satName}
        </div>
      </Html>
    </>
  );
}
