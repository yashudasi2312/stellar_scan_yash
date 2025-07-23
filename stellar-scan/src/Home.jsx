import './CSS/HomeCSS.css';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import muteIcon from './icons/audio-off-svgrepo-com.svg';
import unmuteIcon from './icons/audio-svgrepo-com.svg';
import contactIcon from './icons/telephone-svgrepo-com.svg';
import aboutIcon from './icons/about-svgrepo-com.svg';
import githubIcon from './icons/github-svgrepo-com.svg';
import springIcon from './icons/spring-svgrepo-com.svg';
import reactIcon from './icons/react-svgrepo-com.svg';
import linkedinIcon from './icons/linkedin-svgrepo-com.svg';
import useUserLocation from './services/useUserLocation';
import favIcon from './icons/star-inverted.png';
import { Link } from 'react-router-dom';
import Favorites from './Favorites';
import './About.jsx';

function Home() {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [selectedSatellite, setSelectedSatellite] = useState('');

    const { location, detectLocation } = useUserLocation();

    useEffect(() => {
        if (location) {
            console.log("📍 User location:", location.lat, location.lon);
            setLatitude(location.lat);
            setLongitude(location.lon);
        }
    }, [location]);

    const [showParagraph, setShowParagraph] = useState(false);
    const [showDetect, setShowDetect] = useState(false);
    const [showOr, setShowOr] = useState(false);
    const [showCoordsText, setShowCoordsText] = useState(false);
    const [showLat, setShowLat] = useState(false);
    const [showLon, setShowLon] = useState(false);
    const [showSelector, setShowSelector] = useState(false);
    const [showGo, setShowGo] = useState(false);
    const [showFavIcon, setShowFavIcon] = useState(false); // 👈 Added

    const satelliteIdMap = {
        "SWISSCUBE": 35932,
        "NORSAT 1": 42826,
        "NOAA 15": 25338,
        "AISSAT 1": 36797,
        "ISS (ZARYA)": 25544,
        "ISS (NAUKA)": 49044,
        "NORSAT 2": 42828,
        "LANDSAT 9": 49260,
        "AISSAT 2": 40075,
        "ITASAT": 43786,
        "CENTAURI-1": 43809,
        "NOAA 19": 33591,
        "NOAA 18": 28654,
        "NORSAT 3": 48272,
        "KKS-1 (KISEKI)": 33499,
    };

    const handleGoClick = () => {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (isNaN(lat) || lat < -90 || lat > 90) {
            alert("Latitude must be between -90 and 90 degrees.");
            return;
        }

        if (isNaN(lon) || lon < -180 || lon > 180) {
            alert("Longitude must be between -180 and 180 degrees.");
            return;
        }

        if (!selectedSatellite) {
            alert("Please select a satellite.");
            return;
        }

        navigate('/globe', {
            state: {
                lat: lat,
                lon: lon,
                satName: selectedSatellite,
                noradId: satelliteIdMap[selectedSatellite]
            }
        });
    };

    useEffect(() => {
        const timers = [];
        timers.push(setTimeout(() => setShowParagraph(true), 1500));
        timers.push(setTimeout(() => setShowFavIcon(true), 1500)); 
        timers.push(setTimeout(() => setShowDetect(true), 2000));
        timers.push(setTimeout(() => setShowOr(true), 2150));
        timers.push(setTimeout(() => setShowCoordsText(true), 2250));
        timers.push(setTimeout(() => setShowLat(true), 2350));
        timers.push(setTimeout(() => setShowLon(true), 2650));
        timers.push(setTimeout(() => setShowSelector(true), 2800));
        timers.push(setTimeout(() => setShowGo(true), 2950));
        return () => timers.forEach(clearTimeout);
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuteState = !isMuted;
            videoRef.current.muted = newMuteState;
            setIsMuted(newMuteState);
        }
    };

    const handleLatChange = (e) => {
        const value = e.target.value;
        if (/^-?\d*\.?\d*$/.test(value)) {
            setLatitude(value);
        }
    };

    const handleLonChange = (e) => {
        const value = e.target.value;
        if (/^-?\d*\.?\d*$/.test(value)) {
            setLongitude(value);
        }
    };

    const satelliteList = Object.keys(satelliteIdMap);

    return (
        <>

            <div className={`favorite-top-left ${showFavIcon ? 'show' : ''}`}>
                <Link to="/favorites">
                    <img src={favIcon} alt="Favorites" />
                </Link>
            </div>

            <video
                ref={videoRef}
                className="background-video"
                autoPlay
                loop
                playsInline
                muted
            >
                <source src="/stellar-scan-two.mp4" type="video/mp4" />
            </video>

            <button className="mute-toggle" onClick={toggleMute}>
                <img
                    src={isMuted ? muteIcon : unmuteIcon}
                    alt={isMuted ? "Muted" : "Unmuted"}
                    className="mute-icon"
                />
            </button>

            <div className="home1">
                <div className="info1">
                    <h1 className="title-animation">
                        {"StellarScan".split("").map((char, index) => (
                            <span key={index} style={{ animationDelay: `${1.5 + index * 0.1}s` }}>
                                {char}
                            </span>
                        ))}
                    </h1>

                    <p className={`fade-in-para ${showParagraph ? 'show' : ''}`}>
                        Keen on improving your astrophotography skills? Or just wanna see an object go Mach 22 hundreds of kilometers above ground?
                        If yes, then you're at the right place! Welcome to StellarScan - an amazing space where you can check from a group of 15 popular
                        satellites which one will go over your position. Or, you can add a location of your choice (yes, literally anywhere in the world)
                        and save satellites which you find fascinating.
                    </p>
                </div>

                <button
                    className={`detect1 fade-in-down ${showDetect ? 'show' : ''}`}
                    onClick={detectLocation}
                >
                    Detect my location
                </button>

                <p id='or-division' className={`fade-in-down ${showOr ? 'show' : ''}`}>OR</p>

                <div className="coordinates1">
                    <p id='entercoordinates' className={`fade-in-down ${showCoordsText ? 'show' : ''}`}>Enter the desired coordinates</p>

                    <input
                        type="text"
                        className={`lat-lon-pos fade-in-down ${showLat ? 'show' : ''}`}
                        placeholder="latitude"
                        value={latitude}
                        onChange={handleLatChange}
                    />

                    <input
                        type="text"
                        className={`lat-lon-pos fade-in-down ${showLon ? 'show' : ''}`}
                        placeholder="longitude"
                        value={longitude}
                        onChange={handleLonChange}
                    />

                    <div className={`satellite-selector fade-in-down ${showSelector ? 'show' : ''}`}>
                        <label htmlFor="satellite-dropdown"></label>
                        <select
                            id="satellite-dropdown"
                            value={selectedSatellite}
                            onChange={(e) => setSelectedSatellite(e.target.value)}
                        >
                            <option value="" className='dropdown1' disabled>Select a satellite</option>
                            {satelliteList.map((sat, idx) => (
                                <option key={idx} value={sat}>{sat}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        className={`lat-lon-button ${showGo ? 'show' : ''}`}
                        onClick={handleGoClick}
                    >
                        <span>GO</span>
                    </button>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-icons">
                    <a href="mailto:yashudasi0926@gmail.com" target="_blank" rel="noopener noreferrer" className="footer-item fade-in-icon">
                        <img src={contactIcon} alt="Contact" />
                    </a>
                    <Link to="/about" className="footer-item fade-in-icon">
                        <img src={aboutIcon} alt="About" />
                    </Link>
                    <a href="https://github.com/yashudasi2312" target="_blank" rel="noopener noreferrer" className="footer-item fade-in-icon">
                        <img src={githubIcon} alt="GitHub" />
                    </a>
                    <a href="https://www.linkedin.com/in/yash-udasi-a11167317/" target="_blank" rel="noopener noreferrer" className="footer-item fade-in-icon">
                        <img src={linkedinIcon} alt="LinkedIn" />
                    </a>
                    <a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener noreferrer" className="footer-item fade-in-icon">
                        <img src={springIcon} alt="Spring" />
                    </a>
                    <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="footer-item fade-in-icon">
                        <img src={reactIcon} alt="React" />
                    </a>
                </div>
            </footer>
        </>
    );
}

export default Home;
