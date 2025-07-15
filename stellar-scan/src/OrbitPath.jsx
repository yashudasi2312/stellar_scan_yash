import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { getOrbitPositions } from './services/orbitUtils';

export default function OrbitPath({ tle1, tle2 }) {
  const orbitPoints = useMemo(() => getOrbitPositions(tle1, tle2), [tle1, tle2]);

  return (
    <Line
      points={orbitPoints} 
      color="cyan"
      lineWidth={1}
      dashed={false}
    />
  );
}