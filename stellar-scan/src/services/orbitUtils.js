import * as satellite from 'satellite.js';

export function getOrbitPositions(tle1, tle2, stepMinutes = 1) {
  const satrec = satellite.twoline2satrec(tle1, tle2);
  const positions = [];

  const meanMotion = satrec.no; // radians per minute
  const orbitalPeriod = (2 * Math.PI) / meanMotion; // minutes per orbit

  const startTime = new Date();
  const gmst = satellite.gstime(startTime); // FIX: Use constant GMST to avoid twist

  const scale = 1 / 6371; // Earth radius to unit sphere

  for (let i = 0; i <= orbitalPeriod; i += stepMinutes) {
    const time = new Date(startTime.getTime() + i * 60000);
    const posVel = satellite.propagate(satrec, time);

    if (!posVel.position) continue;

    const ecf = satellite.eciToEcf(posVel.position, gmst); // GMST stays constant

    const x = ecf.x * scale;
    const y = ecf.z * scale;
    const z = -ecf.y * scale;

    positions.push([x, y, z]);
  }

  return positions;
}
