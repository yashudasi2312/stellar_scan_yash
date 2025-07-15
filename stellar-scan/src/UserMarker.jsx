import React from 'react';
import { Html } from '@react-three/drei';

export default function UserMarker({ lat, lon }) {
  if (lat === null || lon === null) return null;


  const radius = 1; 
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return (
    <>
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <Html position={[x, y, z]} center style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '5px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            marginTop: '5px',
          }}
        >
          🧍 You<br />
          {lat.toFixed(2)}, {lon.toFixed(2)}
        </div>
      </Html>
    </>
  );
}
