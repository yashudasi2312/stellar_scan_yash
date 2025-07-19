import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as satellite from 'satellite.js';
import { fetchTLE } from './services/TLEfetch';
import './CSS/Favorites.css';
import homeIcon from './icons/white-house.png';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [livePositions, setLivePositions] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setIsPageVisible(true), 100); 
    return () => clearTimeout(timeout);
  }, []);

  const calculateCurrentPosition = (tle1, tle2) => {
    try {
      const satrec = satellite.twoline2satrec(tle1, tle2);
      const now = new Date();
      const posVel = satellite.propagate(satrec, now);
      const gmst = satellite.gstime(now);

      if (!posVel.position || posVel.position.x === false) return null;

      const geo = satellite.eciToGeodetic(posVel.position, gmst);
      const lat = satellite.degreesLat(geo.latitude);
      const lon = satellite.degreesLong(geo.longitude);
      if (isNaN(lat) || isNaN(lon)) return null;
      return { lat, lon };
    } catch (error) {
      console.error('Error calculating position:', error);
      return null;
    }
  };

  const fetchCountryFromBackend = async (lat, lon) => {
    try {
      const res = await fetch(`http://localhost:8080/api/country?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error("Failed to fetch country");
      return await res.text();
    } catch (err) {
      console.error("Error fetching country from backend:", err);
      return "Unknown";
    }
  };

  const updateLivePositions = async () => {
    if (favorites.length === 0) return;
    const newPositions = {};
    for (const fav of favorites) {
      if (!fav.noradId) continue;
      try {
        const tleData = await fetchTLE(fav.noradId);
        if (tleData && tleData.length >= 2) {
          const position = calculateCurrentPosition(tleData[0], tleData[1]);
          if (position) {
            const country = await fetchCountryFromBackend(position.lat, position.lon);
            newPositions[fav.noradId] = {
              lat: position.lat,
              lon: position.lon,
              country: country,
              lastUpdate: new Date()
            };
          }
        }
      } catch (error) {
        console.error(`Error processing ${fav.name}:`, error);
      }
    }
    setLivePositions(newPositions);
  };

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        const parsedFavorites = JSON.parse(stored);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error("Error parsing favorites:", error);
        setFavorites([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      updateLivePositions();
      const interval = setInterval(updateLivePositions, 15000);
      return () => clearInterval(interval);
    }
  }, [favorites]);

  const goToGlobe = (fav) => {
    if (!fav.noradId) {
      alert("Satellite ID missing.");
      return;
    }
    const livePos = livePositions[fav.noradId];
    const lat = livePos ? livePos.lat : fav.lat;
    const lon = livePos ? livePos.lon : fav.lon;
    navigate('/globe', {
      state: {
        lat,
        lon,
        satName: fav.name,
        noradId: fav.noradId
      }
    });
  };

  const removeFavorite = (index) => {
    const updatedFavorites = favorites.filter((_, i) => i !== index);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const clearAllFavorites = () => {
    if (window.confirm("Clear all favorites?")) {
      setFavorites([]);
      setLivePositions({});
      localStorage.removeItem('favorites');
    }
  };

  if (loading) {
    return (
      <div className="fade-wrapper">
        <div className="loading">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className={`fade-wrapper ${isPageVisible ? 'visible' : ''}`}>
      <div className="home-icon fade-fadein" onClick={() => navigate('/')}>
        <img src={homeIcon} alt="Home" />
      </div>

      <div className="favorites-header">
        <h2 className="fade-fadein">Your Favorite Satellites</h2>
        {favorites.length > 0 && (
          <div className="header-buttons">
            <button className="clear-all-button fade-fadein" onClick={clearAllFavorites}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites fade-fadein">
          <p>No favorites saved yet.</p>
          <p>Go to the main page and star some satellites to see them here!</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map((fav, index) => {
            if (!fav || typeof fav !== 'object') return null;

            const livePos = livePositions[fav.noradId];
            const currentLat = livePos?.lat ?? fav.lat;
            const currentLon = livePos?.lon ?? fav.lon;
            const currentCountry = livePos?.country ?? fav.country;

            return (
              <div className="favorite-card" key={fav.noradId || index}>
                <h3>{fav.name || 'Unknown Satellite'}</h3>
                <div className="satellite-details">
                  <p><strong>NORAD ID:</strong> {fav.noradId || 'Missing'}</p>
                  <p><strong>Latitude:</strong> {currentLat?.toFixed(2) || 'Unknown'} {livePos?.lat && <span className="live-indicator">🟢</span>}</p>
                  <p><strong>Longitude:</strong> {currentLon?.toFixed(2) || 'Unknown'} {livePos?.lon && <span className="live-indicator">🟢</span>}</p>
                  <p><strong>Country:</strong> {currentCountry || 'Unknown'} {livePos?.country && <span className="live-indicator">🟢</span>}</p>
                  {livePos?.lastUpdate && (
                    <p className="last-update"><small>Last updated: {livePos.lastUpdate.toLocaleTimeString()}</small></p>
                  )}
                </div>
                <div className="card-buttons">
                  <button className="go-button" onClick={() => goToGlobe(fav)} disabled={!fav.noradId}>
                    View on Earth
                  </button>
                  <button className="remove-button" onClick={() => removeFavorite(index)}>
                    Remove
                  </button>
                </div>
                {!fav.noradId && <div className="error-message">⚠️ Missing NORAD ID. Remove and re-add.</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Favorites;