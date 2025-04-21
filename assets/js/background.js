// Three.js Particle Background - Updated with Brighter Normal State Colors
(function() {
    'use strict';
    try {
        if (typeof THREE === 'undefined') {
            console.error("Three.js library not loaded. Background cannot be initialized.");
            return;
        }

        var scene, camera, renderer;
        var container, HEIGHT, WIDTH, fieldOfView, aspectRatio, nearPlane, farPlane;
        var geometry, particleCount, i, h, color, size, materials = [], mouseX = 0, mouseY = 0;
        var windowHalfX, windowHalfY, cameraZ, fogHex, fogDensity, parameters = {}, parameterCount, particles;
        var rafId = null;
        var backgroundState = 'normal'; // State variable for effects

        // --- Parameters for Theme ---
        const BACKGROUND_COLOR = 0x0a0514;
        const FOG_COLOR = 0x0a0514;
        const FOG_DENSITY = 0.001;
        const PARTICLE_COUNT = 10000;
        // Base parameters for NORMAL state (Dark) - Increased Lightness
        const PARTICLE_PARAMS_NORMAL = [
            // Hue (0-1), Saturation (0-1), Lightness (0-1) | Size
            [[0.95, 0.7, 0.25], 3],   // Was 0.18 -> Brighter Reddish-Purple
            [[0.80, 0.7, 0.22], 2.5], // Was 0.15 -> Brighter Purple
            [[0.0,  0.7, 0.22], 2.5], // Was 0.15 -> Brighter Red
            [[0.85, 0.6, 0.20], 2],   // Was 0.12 -> Brighter Dark Purple
            [[0.98, 0.6, 0.20], 2]    // Was 0.12 -> Brighter Dark Red
        ];
         // Parameters for ENHANCED state (Brighter Rave) - Remain bright
         const PARTICLE_PARAMS_ENHANCED = [
            [[0.95, 0.9, 0.6], 3.5],
            [[0.80, 0.9, 0.55], 3],
            [[0.0,  0.9, 0.55], 3],
            [[0.85, 0.8, 0.5], 2.5],
            [[0.98, 0.8, 0.5], 2.5]
        ];
        const CAMERA_Z = 1000;
        const ROTATION_SPEED_NORMAL = 0.000015;
        const ROTATION_SPEED_ENHANCED = 0.00008;
        const BREATHING_INTENSITY = 25;
        const BREATHING_SPEED = 0.0001;

        function initThreeJS() {
            container = document.getElementById('threejs-bg');
            if (!container) { console.error("Three.js container #threejs-bg not found."); return; }

            HEIGHT = window.innerHeight; WIDTH = window.innerWidth;
            windowHalfX = WIDTH / 2; windowHalfY = HEIGHT / 2;
            fieldOfView = 75; aspectRatio = WIDTH / HEIGHT; nearPlane = 1; farPlane = 3000;
            cameraZ = CAMERA_Z; fogHex = FOG_COLOR; fogDensity = FOG_DENSITY;

            camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
            camera.position.z = cameraZ;

            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(fogHex, fogDensity);

            geometry = new THREE.BufferGeometry();
            const positions = []; particleCount = PARTICLE_COUNT;
            for (i = 0; i < particleCount; i++) { const x = Math.random() * 2000 - 1000; const y = Math.random() * 2000 - 1000; const z = Math.random() * 2000 - 1000; positions.push(x, y, z); }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            // Use normal parameters initially
            parameters = PARTICLE_PARAMS_NORMAL;
            parameterCount = parameters.length;
            materials = [];
            for (i = 0; i < parameterCount; i++) {
                color = parameters[i][0]; size = parameters[i][1];
                materials[i] = new THREE.PointsMaterial({
                    size: size, vertexColors: false,
                    blending: THREE.NormalBlending,
                    transparent: true,
                    opacity: 0.7 // Slightly increased base opacity
                });
                particles = new THREE.Points(geometry, materials[i]);
                particles.rotation.x = Math.random() * 6; particles.rotation.y = Math.random() * 6; particles.rotation.z = Math.random() * 6;
                scene.add(particles);
            }

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(WIDTH, HEIGHT);
            renderer.setClearColor(BACKGROUND_COLOR, 1);
            container.appendChild(renderer.domElement);

            // --- Event Listeners ---
            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('touchstart', onDocumentTouchStart, { passive: false });
            document.addEventListener('touchmove', onDocumentTouchMove, { passive: false });

            // Listen for background state change from interactions.js
            document.addEventListener('background-state-change', (e) => {
                console.log("Background state change received:", e.detail.state);
                backgroundState = e.detail.state || 'normal';
            });

            animate();
            console.log("Three.js background initialized.");
        }

        function animate() {
            rafId = requestAnimationFrame(animate);
            renderThreeJS();
        }

        function renderThreeJS() {
            const currentRotationSpeed = backgroundState === 'enhanced' ? ROTATION_SPEED_ENHANCED : ROTATION_SPEED_NORMAL;
            const time = Date.now() * currentRotationSpeed;

            camera.position.z = cameraZ + Math.sin(Date.now() * BREATHING_SPEED) * BREATHING_INTENSITY;
            const followSpeed = backgroundState === 'enhanced' ? 0.03 : 0.02;
            camera.position.x += (mouseX - camera.position.x) * followSpeed;
            camera.position.y += (-mouseY - camera.position.y) * followSpeed;
            camera.lookAt(scene.position);

            const rotationMultiplier = backgroundState === 'enhanced' ? 12 : 1;
            for (i = 0; i < scene.children.length; i++) {
                const object = scene.children[i];
                if (object instanceof THREE.Points) {
                    object.rotation.y = time * rotationMultiplier * (i < (parameterCount/2) ? i + 1 : -(i + 1));
                }
            }

            // Use correct parameter set based on state
            const currentParams = backgroundState === 'enhanced' ? PARTICLE_PARAMS_ENHANCED : PARTICLE_PARAMS_NORMAL;
            for (i = 0; i < materials.length; i++) {
                const paramIndex = i % currentParams.length;
                const baseColor = currentParams[paramIndex][0];
                const baseSat = baseColor[1];
                const baseLight = baseColor[2]; // This now uses the adjusted lightness for normal state

                const hueSpeed = backgroundState === 'enhanced' ? 0.0006 : 0.0003;
                let h = baseColor[0] + Math.sin(Date.now() * hueSpeed + i * Math.PI) * 0.05;
                h = (h + 1) % 1;

                materials[i].color.setHSL(h, baseSat, baseLight);

                // Adjust opacity and size based on state
                materials[i].opacity = backgroundState === 'enhanced' ? 0.85 : 0.7; // Use updated normal opacity
                materials[i].size = currentParams[paramIndex][1];
            }

            if (renderer) { renderer.render(scene, camera); }
        }

        // --- Event Handlers ---
        function onDocumentMouseMove(e) { mouseX = e.clientX - windowHalfX; mouseY = e.clientY - windowHalfY; }
        function onDocumentTouchStart(e) { if (e.touches.length === 1) { e.preventDefault(); mouseX = e.touches[0].pageX - windowHalfX; mouseY = e.touches[0].pageY - windowHalfY; } }
        function onDocumentTouchMove(e) { if (e.touches.length === 1) { e.preventDefault(); mouseX = e.touches[0].pageX - windowHalfX; mouseY = e.touches[0].pageY - windowHalfY; } }
        function onWindowResize() { try { WIDTH = window.innerWidth; HEIGHT = window.innerHeight; windowHalfX = WIDTH / 2; windowHalfY = HEIGHT / 2; if(camera){ camera.aspect = WIDTH / HEIGHT; camera.updateProjectionMatrix(); } if (renderer) renderer.setSize(WIDTH, HEIGHT); } catch(e) { console.error("Error on window resize:", e); } }

        // --- Initialize ---
        if (document.readyState === 'loading') {
             document.addEventListener('DOMContentLoaded', initThreeJS);
        } else {
             initThreeJS(); // DOM already ready
        }

         // Cleanup on unload
         window.addEventListener('unload', () => {
              if (rafId) cancelAnimationFrame(rafId);
              window.removeEventListener('resize', onWindowResize);
              document.removeEventListener('mousemove', onDocumentMouseMove);
              document.removeEventListener('touchstart', onDocumentTouchStart);
              document.removeEventListener('touchmove', onDocumentTouchMove);
              // Clean up custom event listener if possible (might need reference)
              // document.removeEventListener('background-state-change', ...);
              console.log("Three.js background cleaned up.");
         });

    } catch(e) {
         console.error("Error in Three.js background script:", e);
         const bgContainer = document.getElementById('threejs-bg');
         if (bgContainer) bgContainer.style.background = '#111'; // Fallback on error
    }
})();
