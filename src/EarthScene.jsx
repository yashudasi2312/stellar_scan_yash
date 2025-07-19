import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import earthTexture from './assets/8081_earthmap10k.jpg';
import { OrbitControls, Stars } from '@react-three/drei';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import OrbitPath from './OrbitPath';
import SatelliteLive from './SatelliteLive';
import { useLocation } from 'react-router-dom';
import UserMarker from './UserMarker';
import { fetchTLE } from './services/TLEfetch';
import homeIcon from './icons/image.png'
import './CSS/EarthSceneCSS.css'
import { Link } from 'react-router-dom';
import aboutIcon from './icons/info_color_invert.png';
import favIcon from './icons/star-inverted.png';
import { satelliteInfo } from './services/SatelliteInfo';
import starred from './icons/favorite1.png';
import notYetStarred from './icons/favorite2.png';

function getSunPositionFromTime() {
  const now = new Date();
  const JD = (now.getTime() / 86400000) + 2440587.5;
  const D = JD - 2451545.0;

  const g = (357.529 + 0.98560028 * D) * (Math.PI / 180);
  const q = (280.459 + 0.98564736 * D) * (Math.PI / 180);
  const L = q + (1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * (Math.PI / 180);
  const e = 23.439 * (Math.PI / 180);

  
  const x = Math.cos(L);
  const y = Math.cos(e) * Math.sin(L);
  const z = Math.sin(e) * Math.sin(L);

  const distance = 5;
  return [x * distance, z * distance, -y * distance];
}

function Earth() {
  const texture = useLoader(TextureLoader, earthTexture);
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Scene({ lat, lon, tle, satName, setLiveData }) {
  const [rotation, setRotation] = useState(0);
  const [sunPosition, setSunPosition] = useState(getSunPositionFromTime());

  useFrame(() => {
    setRotation(prev => prev + 0.0005);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSunPosition(getSunPositionFromTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade />
      <directionalLight castShadow intensity={1.5} position={sunPosition} color={0xffffff} />
      <ambientLight intensity={0.15} />

      <group rotation={[0, rotation, 0]}>
        <Earth />
        <OrbitPath tle1={tle[0]} tle2={tle[1]} />
        <SatelliteLive tle1={tle[0]} tle2={tle[1]} satName={satName} onUpdate={setLiveData} />
        <UserMarker lat={lat} lon={lon} />
      </group>

      <OrbitControls enableZoom={true} />
    </>
  );
}

export default function EarthScene() {
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const location = useLocation();
  const lat = location.state?.lat || 0;
  const lon = location.state?.lon || 0;
  const satName = location.state?.satName || "Unknown";
  const noradId = location.state?.noradId;

  const [tle, setTle] = useState(null);
  const [liveData, setLiveData] = useState({ name: satName, lat: null, lon: null, country: null });

  // Debug logging
  useEffect(() => {
    console.log("EarthScene mounted with:", { lat, lon, satName, noradId });
  }, [lat, lon, satName, noradId]);

  const getSatelliteInfo = (noradId) => {
    return satelliteInfo[noradId] || satelliteInfo["default"];
  };

  useEffect(() => {
    async function loadTLE() {
      if (!noradId) {
        console.warn("⚠️ NORAD ID missing — cannot fetch TLE");
        return;
      }

      try {
        const fetchedTLE = await fetchTLE(noradId);
        setTle(fetchedTLE);
      } catch (err) {
        console.error("❌ Failed to fetch TLE:", err);
      }
    }

    loadTLE();
  }, [noradId]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = stored.find((s) => s.noradId === noradId);
    setIsStarred(!!exists);
  }, [noradId]);

  const handleStarToggle = () => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];


    if (!noradId) {
      console.error("Cannot add to favorites: noradId is missing");
      alert("Error: Cannot add to favorites - satellite ID is missing");
      return;
    }

    const currentSat = {
      noradId: noradId,
      name: satName,
      lat: liveData.lat,
      lon: liveData.lon,
      country: liveData.country
    };

    const exists = stored.find((s) => s.noradId === noradId);

    let updatedFavorites;
    if (exists) {
      updatedFavorites = stored.filter((s) => s.noradId !== noradId);
      setIsStarred(false);
      console.log("Removed from favorites:", currentSat);
    } else {
      updatedFavorites = [...stored, currentSat];
      setIsStarred(true);
      console.log("Added to favorites:", currentSat);
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    console.log("Favorites updated:", updatedFavorites);
  };

  if (!tle) return (
    <div style={{
      color: 'white',
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1.2rem',
      fontFamily: 'Matangi',
      letterSpacing: '2px'
    }}>
      🛰️ Loading satellite data...
    </div>
  );

  return (
    <>
      <Canvas style={{ height: '100vh', background: 'black' }} camera={{ position: [0, 0, 3], fov: 45 }} shadows>
        <Scene lat={lat} lon={lon} tle={tle} satName={satName} setLiveData={setLiveData} />
      </Canvas>

      <div className="sidebar">
        <Link to="/" className="sidebar-icon">
          <img src={homeIcon} alt="Home" />
          <span className="sidebar-label">Home</span>
        </Link>

        <div
          className={`sidebar-icon ${showInfoPanel ? 'show-label' : ''}`}
          onClick={() => setShowInfoPanel(prev => !prev)}
        >
          <img src={aboutIcon} alt="Info" />
          <span className="sidebar-label">Satellite Information</span>
        </div>

        <div className={`sidebar-info-wrapper ${showInfoPanel ? 'expand' : ''}`}>
          <div className="sidebar-info">
            {noradId ? (
              <div><p>{getSatelliteInfo(noradId).description}</p></div>
            ) : (
              <p>No satellite information available. Please select a satellite from the main page.</p>
            )}
          </div>
        </div>

        <Link to="/favorites" className="sidebar-icon">
          <img src={favIcon} alt="Favorites" />
          <span className="sidebar-label">Favorites</span>
        </Link>
      </div>

      <div className="satellite-info-panel">
        <div className="star-toggle" onClick={handleStarToggle}>
          <img src={isStarred ? starred : notYetStarred} alt={isStarred ? 'Starred' : 'Not starred'} />
        </div>
        <div><strong>🛰️ {liveData.name}</strong></div>
        <div>NORAD ID: {noradId || "Missing"}</div>
        <div>Latitude: {liveData.lat?.toFixed(2) || "Loading..."}</div>
        <div>Longitude: {liveData.lon?.toFixed(2) || "Loading..."}</div>
        <div>Country: {liveData.country || "Loading..."}</div>
      </div>

      <div className='api1'>
        <p>This platform utilizes external APIs, including TLE API for orbital element data and Geoapify for geographic mapping.
          All data is subject to the terms, availability, and limitations of their respective providers. This project is for non-commercial and educational use only.
          Best seen in light theme for optimal visibility.
        </p>
      </div>
    </>
  );
}