'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreePlaygroundProps {
  resetRef?: React.MutableRefObject<(() => void) | null>;
  setSceneTypeRef?: React.MutableRefObject<((type: number) => void) | null>;
}

export default function ThreePlayground({ resetRef, setSceneTypeRef }: ThreePlaygroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<THREE.Group[]>([]);
  const [sceneType, setSceneType] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030014, 0.035);

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.set(0, 2, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.maxDistance = 15;
    controls.minDistance = 2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Save initial state so reset() can restore camera position, target & zoom
    controls.saveState();

    // Expose smooth reset function to parent via resetRef
    if (resetRef) {
      resetRef.current = () => {
        // Smooth animated reset: lerp camera from current to saved state over ~500ms
        const startPos = camera.position.clone();
        const startTarget = controls.target.clone();
        const endPos = new THREE.Vector3(0, 2, 6);
        const endTarget = new THREE.Vector3(0, 0, 0);
        const duration = 500;
        const startTime = performance.now();
        let rafId: number;

        const animateReset = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic for a smooth deceleration feel
          const ease = 1 - Math.pow(1 - progress, 3);

          camera.position.lerpVectors(startPos, endPos, ease);
          controls.target.lerpVectors(startTarget, endTarget, ease);

          controls.update();
          renderer.render(scene, camera);

          if (progress < 1) {
            rafId = requestAnimationFrame(animateReset);
          } else {
            // Final snap + update controls state
            controls.reset();
            controls.update();
            renderer.render(scene, camera);
          }
        };

        // Cancel auto-rotate briefly during reset for a cleaner feel
        controls.autoRotate = false;
        rafId = requestAnimationFrame(animateReset);

        // Re-enable auto-rotate after animation completes
        setTimeout(() => {
          controls.autoRotate = true;
        }, duration + 100);
      };
    }

    // Expose scene switching function to parent (for outer demo buttons)
    if (setSceneTypeRef) {
      setSceneTypeRef.current = (type: number) => {
        setSceneType(type);
      };
    }

    // Lights
    scene.add(new THREE.AmbientLight(0x222244, 0.5));
    const light1 = new THREE.PointLight(0x00ff88, 2, 20);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    const light2 = new THREE.PointLight(0xffd700, 1.5, 20);
    light2.position.set(-5, 3, -5);
    scene.add(light2);
    const light3 = new THREE.PointLight(0xff6b35, 1, 15);
    light3.position.set(0, -3, 5);
    scene.add(light3);

    // Groups
    const groups: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group();
      g.visible = i === 0;
      scene.add(g);
      groups.push(g);
    }
    groupsRef.current = groups;

    // ===== SCENE 0: Particle Field =====
    const pCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    const pSiz = new Float32Array(pCount);
    const c1 = new THREE.Color(0x00ff88);
    const c2 = new THREE.Color(0xffd700);
    const c3 = new THREE.Color(0xff6b35);

    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      const r = Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i3 + 2] = r * Math.cos(phi);
      const c = Math.random() < 0.33 ? c1 : Math.random() < 0.66 ? c2 : c3;
      pCol[i3] = c.r; pCol[i3 + 1] = c.g; pCol[i3 + 2] = c.b;
      pSiz[i] = Math.random() * 3 + 1;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aParticleColor', new THREE.BufferAttribute(pCol, 3));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSiz, 1));

    const pMat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 aParticleColor;
        attribute float aSize;
        varying vec3 vColor;
        void main() {
          vColor = aParticleColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particleMesh = new THREE.Points(pGeo, pMat);
    groups[0].add(particleMesh);

    // ===== SCENE 1: 3D Geometry =====
    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x00ff88, metalness: 0.7, roughness: 0.1,
        emissive: 0x003311, clearcoat: 1.0, clearcoatRoughness: 0.1,
      })
    );
    groups[1].add(torusKnot);

    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.5, 1),
      new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true, transparent: true, opacity: 0.15 })
    );
    groups[1].add(ico);

    // ===== SCENE 2: Wave =====
    const waveGeo = new THREE.PlaneGeometry(12, 12, 64, 64);
    const waveMesh = new THREE.Mesh(waveGeo, new THREE.MeshPhysicalMaterial({
      color: 0x00ff88, metalness: 0.3, roughness: 0.4,
      wireframe: true, transparent: true, opacity: 0.6, side: THREE.DoubleSide,
    }));
    waveMesh.rotation.x = -Math.PI / 2.5;
    waveMesh.position.y = -1;
    groups[2].add(waveMesh);

    // ===== SCENE 3: Orbit =====
    const centralSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhysicalMaterial({ color: 0xffd700, emissive: 0x443300, metalness: 0.8, roughness: 0.2 })
    );
    groups[3].add(centralSphere);

    const orbitData: { mesh: THREE.Mesh; r: number; spd: number; off: number }[] = [];
    const oColors = [0x00ff88, 0xff6b35, 0x00ccff, 0xff2d55, 0xffd700];
    for (let i = 0; i < 5; i++) {
      const or = 1.2 + i * 0.7;
      const sz = 0.12 + (4 - i) * 0.04;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(or - 0.005, or + 0.005, 64),
        new THREE.MeshBasicMaterial({ color: oColors[i], transparent: true, opacity: 0.1, side: THREE.DoubleSide })
      );
      ring.rotation.x = Math.PI / 2;
      groups[3].add(ring);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(sz, 16, 16),
        new THREE.MeshPhysicalMaterial({ color: oColors[i], emissive: oColors[i], emissiveIntensity: 0.3, metalness: 0.6, roughness: 0.3 })
      );
      groups[3].add(mesh);
      orbitData.push({ mesh, r: or, spd: 0.5 + i * 0.3, off: (i * Math.PI * 2) / 5 });
    }

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (groups[0].visible) {
        particleMesh.rotation.y = t * 0.05;
        particleMesh.rotation.x = Math.sin(t * 0.03) * 0.1;
        const arr = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < pCount; i++) {
          arr[i * 3 + 1] += Math.sin(t * 0.5 + i * 0.01) * 0.002;
        }
        pGeo.attributes.position.needsUpdate = true;
      }

      if (groups[1].visible) {
        torusKnot.rotation.x = t * 0.3;
        torusKnot.rotation.y = t * 0.5;
        ico.rotation.x = -t * 0.15;
        ico.rotation.y = t * 0.2;
        torusKnot.position.y = Math.sin(t * 0.8) * 0.3;
      }

      if (groups[2].visible) {
        const wArr = waveGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < wArr.length; i += 3) {
          wArr[i + 2] = Math.sin(wArr[i] * 0.5 + t * 2) * 0.5 + Math.cos(wArr[i + 1] * 0.5 + t * 1.5) * 0.5;
        }
        waveGeo.attributes.position.needsUpdate = true;
        waveGeo.computeVertexNormals();
      }

      if (groups[3].visible) {
        centralSphere.rotation.y = t * 0.5;
        orbitData.forEach((o) => {
          const a = t * o.spd + o.off;
          o.mesh.position.set(Math.cos(a) * o.r, Math.sin(a * 2 + o.off) * 0.3, Math.sin(a) * o.r);
        });
      }

      light1.position.x = Math.sin(t * 0.3) * 5;
      light1.position.z = Math.cos(t * 0.3) * 5;
      light2.position.x = Math.sin(t * 0.2 + 2) * 5;
      light2.position.z = Math.cos(t * 0.2 + 2) * 5;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w2 = container.clientWidth;
      const h2 = container.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (resetRef) resetRef.current = null;
      if (setSceneTypeRef) setSceneTypeRef.current = null;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // Handle scene switching via ref to groups
  useEffect(() => {
    groupsRef.current.forEach((g, i) => {
      g.visible = i === sceneType;
    });
  }, [sceneType]);

  return (
    <div ref={containerRef} className="w-full h-[400px] sm:h-[500px] relative">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {['Particles', 'Geometry', 'Wave', 'Orbit'].map((label, i) => (
          <button
            key={label}
            onClick={() => setSceneType(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
              sceneType === i
                ? 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
