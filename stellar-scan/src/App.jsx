import Home from './Home';
import EarthScene from './EarthScene';
import Favorites from './Favorites'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/globe" element={<EarthScene />} />
        <Route path="/favorites" element={<Favorites />} /> 
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
