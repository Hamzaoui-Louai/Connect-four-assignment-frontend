import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WavePoints() {
  const materialRef = useRef()

  // Build the grid geometry once
  const geometry = useMemo(() => {
    const size = 120
    const spacing = 26
    const offset = (size * spacing) / 2
    const count = size * size
    const positions = new Float32Array(count * 3)

    let i = 0
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        positions[i++] = x * spacing - offset
        positions[i++] = 0
        positions[i++] = z * spacing - offset
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 25.0 },
      uFrequency: { value: 0.02 },
      uPointSize: { value: 1.5 },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  const vertexShader = `
    uniform float uTime;
    uniform float uAmplitude;
    uniform float uFrequency;
    uniform float uPointSize;

    varying float vLight;

    float getWave(vec3 pos) {
      float dist = length(pos.xz);
      float wave1 = sin(dist * uFrequency - uTime * 2.0) * uAmplitude;
      float wave2 = sin(pos.x * uFrequency * 0.5 + uTime) * (uAmplitude * 0.5);
      float wave3 = cos(pos.z * uFrequency * 0.7 - uTime * 0.8) * (uAmplitude * 0.3);
      return wave1 + wave2 + wave3;
    }

    void main() {
      vec3 pos = position;
      float y = getWave(pos);
      pos.y = y;

      // Match original slope/lighting calculation
      float dist = length(pos.xz);
      float nextDist = dist + 1.0;
      float wave1Next = sin(nextDist * uFrequency - uTime * 2.0) * uAmplitude;
      float wave2Next = sin(pos.x * uFrequency * 0.5 + uTime) * (uAmplitude * 0.5);
      float wave3Next = cos(pos.z * uFrequency * 0.7 - uTime * 0.8) * (uAmplitude * 0.3);
      float yOffset = wave1Next + wave2Next + wave3Next;
      float slope = yOffset - y;

      vLight = 0.3 + (slope / uAmplitude + 1.0) * 0.35;
      vLight = clamp(vLight, 0.1, 1.0);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uPointSize * (1.0 + y / uAmplitude * 0.2) * (600.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    varying float vLight;

    void main() {
      // Circular point shape
      vec2 coord = gl_PointCoord - vec2(0.5);
      if (length(coord) > 0.5) discard;

      float brightness = 0.862 + 0.137 * vLight;
      vec3 color = vec3(brightness);

      if (vLight > 0.7) {
        color = mix(color, vec3(1.0), 0.4);
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={true}
        depthTest={true}
      />
    </points>
  )
}

export default function Background() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#141414',
      }}
    >
      <Canvas
        camera={{ position: [0, 200, 400], fov: 75, near: 1, far: 3000 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor('#141414')}
      >
        <WavePoints />
      </Canvas>
    </div>
  )
}