import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasSceneProps {
  texts: string[];
  images: string[];
  showHearts?: boolean;
}

export const ThreeCanvasScene: React.FC<ThreeCanvasSceneProps> = ({
  texts,
  images,
  showHearts = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect headless test environment for performance optimization
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    // Scene, Camera, Renderer with romantic pink background tone
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x25091f);
    scene.fog = new THREE.FogExp2(0x270b21, 0.014);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(-5, 0, 32);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isHeadless ? 1 : 2));
    container.appendChild(renderer.domElement);

    // Warm pink ambient and atmospheric point lights
    const ambientLight = new THREE.AmbientLight(0xffb8d6, 1.8);
    scene.add(ambientLight);

    const pinkLight1 = new THREE.PointLight(0xff3385, 2.6, 100);
    pinkLight1.position.set(10, 16, 22);
    scene.add(pinkLight1);

    const pinkLight2 = new THREE.PointLight(0xff66b2, 2.0, 90);
    pinkLight2.position.set(-18, -12, 16);
    scene.add(pinkLight2);

    const pinkLight3 = new THREE.PointLight(0xff99cc, 1.6, 80);
    pinkLight3.position.set(0, -20, -10);
    scene.add(pinkLight3);

    // --- 1. Romantic Pink StarField & Cosmic Stardust Background ---
    const starCount = isHeadless ? 500 : 1400;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const pinkStarPalette = [
      new THREE.Color(0xffffff), // Diamond white
      new THREE.Color(0xff69b4), // Hot pink
      new THREE.Color(0xff85c0), // Vibrant rose
      new THREE.Color(0xffb6c1), // Light pink
      new THREE.Color(0xffc0cb), // Soft pink
      new THREE.Color(0xffd1dc), // Pastel petal
      new THREE.Color(0xffe4e1)  // Misty rose
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 170;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 170;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 170;

      const col = pinkStarPalette[Math.floor(Math.random() * pinkStarPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Circular glowing pink stardust particle texture
    const createDotTexture = () => {
      const dCanvas = document.createElement('canvas');
      dCanvas.width = 32;
      dCanvas.height = 32;
      const dCtx = dCanvas.getContext('2d')!;
      const grad = dCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(255, 115, 180, 0.95)');
      grad.addColorStop(0.7, 'rgba(255, 45, 130, 0.45)');
      grad.addColorStop(1, 'rgba(255, 20, 100, 0)');
      dCtx.fillStyle = grad;
      dCtx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(dCanvas);
    };

    const dotTexture = createDotTexture();

    const starMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      map: dotTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // --- 2. 3D Floating Particle Text Made of Tiny Glowing Pink Dots ---
    const textGroups: {
      group: THREE.Group;
      points: THREE.Points;
      text: string;
      initialY: number;
      speed: number;
      phase: number;
      wobbleSpeed: number;
    }[] = [];

    const pinkShades = [
      new THREE.Color(0xff2d75), // Bright hot fuchsia pink
      new THREE.Color(0xff5599), // Deep rose
      new THREE.Color(0xff77aa), // Soft pink
      new THREE.Color(0xff99bb), // Pastel blossom
      new THREE.Color(0xffc2d6), // Fairy light pink
      new THREE.Color(0xfff0f5)  // Shimmering white-pink
    ];

    const generateParticleGeometry = (text: string) => {
      const c = document.createElement('canvas');
      c.width = 540;
      c.height = 110;
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.font = 'bold 36px "Mali", "Segoe UI", Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 270, 55);

      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imgData.data;

      const positions: number[] = [];
      const colors: number[] = [];

      // Step size = 2 for high density, crisp tiny dots
      const step = 2;
      for (let y = 0; y < c.height; y += step) {
        for (let x = 0; x < c.width; x += step) {
          const idx = (y * c.width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 70) {
            // Position mapped to 3D space with gentle particle depth jitter
            const px = (x - 270) * 0.038;
            const py = -(y - 55) * 0.038;
            const pz = (Math.random() - 0.5) * 0.28;

            positions.push(px, py, pz);

            // Shimmering pink gradient along the words
            const ratio = x / c.width + (Math.random() - 0.5) * 0.25;
            const colIdx = Math.floor(Math.min(0.99, Math.max(0, ratio)) * pinkShades.length);
            const col = pinkShades[colIdx];
            colors.push(col.r, col.g, col.b);
          }
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      return geom;
    };

    const textList = texts.length > 0 ? texts : ['Yêu em', '20/10 hạnh phúc'];

    textList.forEach((text, i) => {
      const geom = generateParticleGeometry(text);
      const pointsMat = new THREE.PointsMaterial({
        size: 0.28,
        vertexColors: true,
        map: dotTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const points = new THREE.Points(geom, pointsMat);
      const group = new THREE.Group();
      group.add(points);

      // Positioning in 3D orbit - evenly distributed
      const angle = (i / textList.length) * Math.PI * 2;
      const radius = 18 + (i % 2 === 0 ? 4 : -3);
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 24;
      const z = Math.sin(angle) * radius;

      group.position.set(x, y, z);
      scene.add(group);

      textGroups.push({
        group,
        points,
        text,
        initialY: y,
        speed: 0.15 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.8 + Math.random() * 0.5
      });
    });

    // Re-generate point clouds once fonts are fully ready to guarantee perfect Unicode accents
    document.fonts.ready.then(() => {
      textGroups.forEach((item) => {
        const newGeom = generateParticleGeometry(item.text);
        item.points.geometry.dispose();
        item.points.geometry = newGeom;
      });
    });

    // --- 3. Floating 3D Photos with Soft Polaroid Frames ---
    const photoMeshes: {
      mesh: THREE.Mesh;
      initialY: number;
      speed: number;
      phase: number;
      rotSpeedX: number;
      rotSpeedY: number;
    }[] = [];

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    images.forEach((imgUrl, i) => {
      textureLoader.load(
        imgUrl,
        (photoTex) => {
          photoTex.colorSpace = THREE.SRGBColorSpace;

          // Photo plane
          const planeGeo = new THREE.PlaneGeometry(5.8, 7.6);
          const planeMat = new THREE.MeshBasicMaterial({
            map: photoTex,
            side: THREE.DoubleSide
          });
          const photoMesh = new THREE.Mesh(planeGeo, planeMat);

          // Add a soft glowing back/frame with subtle warm pink glow
          const frameGeo = new THREE.PlaneGeometry(6.2, 8.0);
          const frameMat = new THREE.MeshBasicMaterial({
            color: 0xfff0f6,
            side: THREE.DoubleSide
          });
          const frameMesh = new THREE.Mesh(frameGeo, frameMat);
          frameMesh.position.z = -0.02;
          photoMesh.add(frameMesh);

          // Slightly randomize scale for natural depth
          const randomScale = 0.85 + Math.random() * 0.25;
          photoMesh.scale.set(randomScale, randomScale, 1);

          // Orbit at comfortable distance behind text
          const angle = (i / images.length) * Math.PI * 2 + 0.5;
          const radius = 22 + (i % 3) * 5;
          const x = Math.cos(angle) * radius;
          const y = (Math.random() - 0.5) * 28;
          const z = Math.sin(angle) * radius;

          photoMesh.position.set(x, y, z);
          photoMesh.rotation.y = -angle + Math.PI / 2 + (Math.random() - 0.5) * 0.4;
          photoMesh.rotation.x = (Math.random() - 0.5) * 0.2;
          photoMesh.rotation.z = (Math.random() - 0.5) * 0.3;
          scene.add(photoMesh);

          photoMeshes.push({
            mesh: photoMesh,
            initialY: y,
            speed: 0.12 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2,
            rotSpeedX: (Math.random() - 0.5) * 0.15,
            rotSpeedY: (Math.random() - 0.5) * 0.15
          });
        },
        undefined,
        (err) => {
          console.warn('Could not load 3D photo texture:', imgUrl, err);
        }
      );
    });

    // --- 4. Floating 3D Hearts ---
    const heartMeshes: {
      mesh: THREE.Sprite;
      initialY: number;
      speed: number;
      phase: number;
    }[] = [];

    if (showHearts) {
      const heartCanvas = document.createElement('canvas');
      heartCanvas.width = 64;
      heartCanvas.height = 64;
      const hCtx = heartCanvas.getContext('2d')!;
      hCtx.font = '48px serif';
      hCtx.textAlign = 'center';
      hCtx.textBaseline = 'middle';
      hCtx.fillStyle = '#ff3385';
      hCtx.shadowColor = '#ff80bf';
      hCtx.shadowBlur = 14;
      hCtx.fillText('♥', 32, 32);

      const heartTex = new THREE.CanvasTexture(heartCanvas);
      const heartMat = new THREE.SpriteMaterial({
        map: heartTex,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      const heartCount = isHeadless ? 15 : 45;
      for (let i = 0; i < heartCount; i++) {
        const hSprite = new THREE.Sprite(heartMat);
        const x = (Math.random() - 0.5) * 45;
        const y = (Math.random() - 0.5) * 35;
        const z = (Math.random() - 0.5) * 35;

        hSprite.position.set(x, y, z);
        const s = 1.2 + Math.random() * 1.5;
        hSprite.scale.set(s, s, 1);
        scene.add(hSprite);

        heartMeshes.push({
          mesh: hSprite,
          initialY: y,
          speed: 0.3 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    // --- Interactive Orbit Drag / Touch & Zoom ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0.0008;
    let rotationVelocityY = 0;
    let targetZoom = camera.position.z;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rotationVelocityX = deltaX * 0.003;
      rotationVelocityY = deltaY * 0.003;

      // Orbit camera around center
      scene.rotation.y += rotationVelocityX;
      scene.rotation.x = Math.max(-0.6, Math.min(0.6, scene.rotation.x + rotationVelocityY));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoom = Math.max(12, Math.min(60, targetZoom + e.deltaY * 0.03));
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth zoom damping
      camera.position.z += (targetZoom - camera.position.z) * 0.08;

      // Gentle auto-rotation drift
      if (!isDragging) {
        scene.rotation.y += 0.0006;
      }

      // Animate pink starfield twinkling
      starPoints.rotation.y = elapsedTime * 0.01;
      starPoints.rotation.x = elapsedTime * 0.005;

      // Animate 3D particle text words (floating & billboarding so dots face camera)
      textGroups.forEach((item) => {
        item.group.position.y =
          item.initialY + Math.sin(elapsedTime * item.wobbleSpeed + item.phase) * 1.5;
        // Make the particle text face camera for perfect readability
        item.group.quaternion.copy(camera.quaternion);

        // Subtle organic breathing of particle points
        const breathe = 1 + Math.sin(elapsedTime * 2 + item.phase) * 0.03;
        item.points.scale.set(breathe, breathe, 1);
      });

      // Animate photos
      photoMeshes.forEach((item) => {
        item.mesh.position.y =
          item.initialY + Math.sin(elapsedTime * 0.6 + item.phase) * 1.2;
        item.mesh.rotation.z = Math.sin(elapsedTime * 0.4 + item.phase) * 0.06;
      });

      // Animate hearts drifting upward
      heartMeshes.forEach((item) => {
        item.mesh.position.y += item.speed * 0.08;
        if (item.mesh.position.y > 25) {
          item.mesh.position.y = -25;
        }
        item.mesh.position.x += Math.sin(elapsedTime * 1.2 + item.phase) * 0.03;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      textGroups.forEach((item) => {
        item.points.geometry.dispose();
        (item.points.material as THREE.Material).dispose();
      });
      dotTexture.dispose();
    };
  }, [texts, images, showHearts]);

  return (
    <div
      ref={containerRef}
      className="scene-canvas-container"
      role="application"
      aria-label="Không gian 3D ký ức và lời chúc"
      style={{ touchAction: 'none' }}
    />
  );
};
