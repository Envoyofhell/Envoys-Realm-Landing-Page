// Three.js Particle Background
(function() {
    'use strict';
    // Wrap entire script in try/catch for safety
    try {
        // Check if THREE is loaded
        if (typeof THREE === 'undefined') {
            console.error("Three.js library not loaded. Background cannot be initialized.");
            return;
        }

        var scene, camera, renderer;
        var container, HEIGHT, WIDTH, fieldOfView, aspectRatio, nearPlane, farPlane;
        var geometry, particleCount, i, h, color, size, materials = [], mouseX = 0, mouseY = 0;
        var windowHalfX, windowHalfY, cameraZ, fogHex, fogDensity, parameters = {}, parameterCount, particles;
        var rafId = null; // Store animation frame ID

        // --- Parameters for Theme ---
        const BACKGROUND_COLOR = 0x0a0514; // Darker purple/black base
        const FOG_COLOR = 0x0a0514;
        const FOG_DENSITY = 0.001; // Slightly denser fog
        const PARTICLE_COUNT = 10000; // Fewer particles for subtlety
        const PARTICLE_PARAMS = [
            // Hue (0-1), Saturation (0-1), Lightness (0-1) | Size
            // Adjusted Lightness to be darker (0.15 - 0.2)
            [[0.95, 0.7, 0.18], 3],   // Dark Reddish-Purple
            [[0.80, 0.7, 0.15], 2.5], // Dark Purple
            [[0.0,  0.7, 0.15], 2.5], // Dark Red
            [[0.85, 0.6, 0.12], 2],   // Very Dark Purple
            [[0.98, 0.6, 0.12], 2]    // Very Dark Red
        ];
        const CAMERA_Z = 1000;
        const ROTATION_SPEED_MULTIPLIER = 0.000015; // Slower rotation
        const BREATHING_INTENSITY = 25; // Less intense breathing
        const BREATHING_SPEED = 0.0001; // Slower breathing

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

            parameters = PARTICLE_PARAMS; parameterCount = parameters.length; materials = [];
            for (i = 0; i < parameterCount; i++) {
                color = parameters[i][0]; size = parameters[i][1];
                materials[i] = new THREE.PointsMaterial({
                    size: size, vertexColors: false,
                    blending: THREE.NormalBlending, // Use Normal Blending
                    transparent: true, opacity: 0.65
                });
                particles = new THREE.Points(geometry, materials[i]);
                particles.rotation.x = Math.random() * 6; particles.rotation.y = Math.random() * 6; particles.rotation.z = Math.random() * 6;
                scene.add(particles);
            }

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(WIDTH, HEIGHT);
            renderer.setClearColor(BACKGROUND_COLOR, 1); // Set background color
            container.appendChild(renderer.domElement);

            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('touchstart', onDocumentTouchStart, { passive: false });
            document.addEventListener('touchmove', onDocumentTouchMove, { passive: false });

            animate();
            console.log("Three.js background initialized.");
        }
        function animate() { rafId = requestAnimationFrame(animate); renderThreeJS(); }
        function renderThreeJS() {
            const time = Date.now() * ROTATION_SPEED_MULTIPLIER;
            // Breathing effect
            camera.position.z = cameraZ + Math.sin(Date.now() * BREATHING_SPEED) * BREATHING_INTENSITY;
            // Mouse follow
            camera.position.x += (mouseX - camera.position.x) * 0.02;
            camera.position.y += (-mouseY - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            // Rotation
            for (i = 0; i < scene.children.length; i++) { const object = scene.children[i]; if (object instanceof THREE.Points) { object.rotation.y = time * (i < (parameterCount/2) ? i + 1 : -(i + 1)); } }
            // Color update
            for (i = 0; i < materials.length; i++) {
                color = parameters[i][0];
                // Modulated Hue Oscillation for subtle color shift within range
                let h = color[0] + Math.sin(Date.now() * 0.0003 + i * Math.PI) * 0.05; // Slow oscillation +/- 0.05 hue
                h = (h + 1) % 1; // Keep hue between 0 and 1
                materials[i].color.setHSL(h, color[1], color[2]); // Use themed saturation/lightness
            }
            if (renderer) { renderer.render(scene, camera); }
        }
        function onDocumentMouseMove(e) { mouseX = e.clientX - windowHalfX; mouseY = e.clientY - windowHalfY; }
        function onDocumentTouchStart(e) { if (e.touches.length === 1) { e.preventDefault(); mouseX = e.touches[0].pageX - windowHalfX; mouseY = e.touches[0].pageY - windowHalfY; } }
        function onDocumentTouchMove(e) { if (e.touches.length === 1) { e.preventDefault(); mouseX = e.touches[0].pageX - windowHalfX; mouseY = e.touches[0].pageY - windowHalfY; } }
        function onWindowResize() { try { windowHalfX = window.innerWidth / 2; windowHalfY = window.innerHeight / 2; camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); if (renderer) renderer.setSize(window.innerWidth, window.innerHeight); } catch(e) { console.error("Error on window resize:", e); } }

         // Initialize Three.js after DOM is ready
         if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initThreeJS);
         } else {
              initThreeJS();
         }

         // Cleanup on unload
         window.addEventListener('unload', () => {
             if (rafId) cancelAnimationFrame(rafId);
             window.removeEventListener('resize', onWindowResize);
             document.removeEventListener('mousemove', onDocumentMouseMove);
             document.removeEventListener('touchstart', onDocumentTouchStart);
             document.removeEventListener('touchmove', onDocumentTouchMove);
             // Add cleanup for background-state-change listener if it exists elsewhere
         });

    } catch(e) {
         console.error("Error in Three.js main execution block:", e);
         // Display fallback background if init fails
         const bgContainer = document.getElementById('threejs-bg');
         if (bgContainer) bgContainer.style.background = '#111';
    }
})();
