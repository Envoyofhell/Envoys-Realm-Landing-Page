// background.js - Three.js Particle Background (Original Structure + Fixes)

// IIFE to create a private scope
(function() {
    'use strict'; // Enable strict mode

    // Basic check for Three.js library presence
    try {
        if (typeof THREE === 'undefined') {
            console.error("Three.js library not loaded. Background cannot be initialized.");
            return;
        }

        // --- Variable Declarations ---
        var scene, camera, renderer; // Core Three.js components
        var container, HEIGHT, WIDTH, fieldOfView, aspectRatio, nearPlane, farPlane; // DOM & Camera setup
        var geometry, particleCount, i, h, color, size, materials = [], mouseX = 0, mouseY = 0; // Particle system variables
        var windowHalfX, windowHalfY, cameraZ, fogHex, fogDensity, parameters = {}, parameterCount, particles; // Helpers & parameters
        var rafId = null; // ID for animation frame cancelling
        var backgroundState = 'normal'; // State variable ('normal' or 'enhanced')

        // --- Configuration Constants ---
        const BACKGROUND_COLOR = 0x0a0514;
        const FOG_COLOR = 0x0a0514;
        const FOG_DENSITY = 0.001;
        const PARTICLE_COUNT = 10000;
        // Parameters for NORMAL state: [ [H, S, L], Size ]
        const PARTICLE_PARAMS_NORMAL = [
            [[0.95, 0.7, 0.25], 3], [[0.80, 0.7, 0.22], 2.5], [[0.0, 0.7, 0.22], 2.5],
            [[0.85, 0.6, 0.20], 2], [[0.98, 0.6, 0.20], 2]
        ];
        // Parameters for ENHANCED state: [ [H, S, L], Size ]
        const PARTICLE_PARAMS_ENHANCED = [
            [[0.95, 0.9, 0.6], 3.5], [[0.80, 0.9, 0.55], 3], [[0.0, 0.9, 0.55], 3],
            [[0.85, 0.8, 0.5], 2.5], [[0.98, 0.8, 0.5], 2.5]
        ];
        const CAMERA_Z = 1000;
        const ROTATION_SPEED_NORMAL = 0.000015;
        const ROTATION_SPEED_ENHANCED = 0.00008;
        const BREATHING_INTENSITY = 25;
        const BREATHING_SPEED = 0.0001;

        /**
         * Initializes the Three.js environment.
         */
        function initThreeJS() {
            container = document.getElementById('threejs-bg');
            if (!container) { console.error("Three.js container #threejs-bg not found."); return; }

            // Setup dimensions and camera parameters
            HEIGHT = window.innerHeight; WIDTH = window.innerWidth;
            windowHalfX = WIDTH / 2; windowHalfY = HEIGHT / 2;
            fieldOfView = 75; aspectRatio = WIDTH / HEIGHT; nearPlane = 1; farPlane = 3000;
            cameraZ = CAMERA_Z; fogHex = FOG_COLOR; fogDensity = FOG_DENSITY;

            // Create camera and scene
            camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
            camera.position.z = cameraZ;
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(fogHex, fogDensity);

            // Create particle geometry (shared by all points systems)
            geometry = new THREE.BufferGeometry();
            const positions = []; particleCount = PARTICLE_COUNT;
            for (i = 0; i < particleCount; i++) {
                const x = Math.random() * 2000 - 1000; const y = Math.random() * 2000 - 1000; const z = Math.random() * 2000 - 1000;
                positions.push(x, y, z);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            // Create materials and points objects based on initial parameters
            parameters = PARTICLE_PARAMS_NORMAL; // Start in normal state
            parameterCount = parameters.length;
            materials = []; // Reset materials array
            for (i = 0; i < parameterCount; i++) {
                color = parameters[i][0]; size = parameters[i][1];
                materials[i] = new THREE.PointsMaterial({
                    size: size, vertexColors: false, // Use material color, not vertex colors
                    blending: THREE.NormalBlending, // Normal alpha blending
                    transparent: true,
                    opacity: 0.7 // Base opacity
                });
                particles = new THREE.Points(geometry, materials[i]); // Create points system
                // Random initial rotation for variety
                particles.rotation.x = Math.random() * 6; particles.rotation.y = Math.random() * 6; particles.rotation.z = Math.random() * 6;
                scene.add(particles); // Add to scene
            }

            // Initialize renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(WIDTH, HEIGHT);
            renderer.setClearColor(BACKGROUND_COLOR, 1);
            container.appendChild(renderer.domElement); // Add canvas to DOM

            // --- Event Listeners ---
            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            // Touch listeners - IMPORTANT: passive: false allows preventDefault
            document.addEventListener('touchstart', onDocumentTouchStart, { passive: false });
            document.addEventListener('touchmove', onDocumentTouchMove, { passive: false });

            // Listen for state changes from interactions.js
            document.addEventListener('background-state-change', (e) => {
                console.log("Background state change received:", e.detail.state);
                backgroundState = e.detail.state || 'normal';
            });

            // Start animation loop
            animate();
            console.log("Three.js background initialized.");
        }

        /**
         * Animation loop ticker.
         */
        function animate() {
            rafId = requestAnimationFrame(animate); // Request next frame
            renderThreeJS(); // Render the current frame
        }

        /**
         * Renders a single frame: updates positions, colors, and draws the scene.
         */
        function renderThreeJS() {
            // Determine current parameters based on state
            const currentRotationSpeed = backgroundState === 'enhanced' ? ROTATION_SPEED_ENHANCED : ROTATION_SPEED_NORMAL;
            const currentParams = backgroundState === 'enhanced' ? PARTICLE_PARAMS_ENHANCED : PARTICLE_PARAMS_NORMAL;
            const time = Date.now() * currentRotationSpeed; // Time for rotation calculation

            // Animate camera: breathing and following mouse/touch
            camera.position.z = cameraZ + Math.sin(Date.now() * BREATHING_SPEED) * BREATHING_INTENSITY;
            const followSpeed = backgroundState === 'enhanced' ? 0.03 : 0.02;
            camera.position.x += (mouseX - camera.position.x) * followSpeed;
            camera.position.y += (-mouseY - camera.position.y) * followSpeed;
            camera.lookAt(scene.position); // Always look at the center

            // Animate particle systems: rotation
            const rotationMultiplier = backgroundState === 'enhanced' ? 12 : 1;
            for (i = 0; i < scene.children.length; i++) {
                const object = scene.children[i];
                if (object instanceof THREE.Points) { // Only rotate the points objects
                    object.rotation.y = time * rotationMultiplier * (i < (parameterCount / 2) ? i + 1 : -(i + 1));
                }
            }

            // Animate materials: color hue, opacity, size based on state
            for (i = 0; i < materials.length; i++) {
                const paramIndex = i % currentParams.length;
                const baseColor = currentParams[paramIndex][0]; // [H, S, L]
                const baseSat = baseColor[1];
                const baseLight = baseColor[2];

                // Cycle hue slightly
                const hueSpeed = backgroundState === 'enhanced' ? 0.0006 : 0.0003;
                let h = baseColor[0] + Math.sin(Date.now() * hueSpeed + i * Math.PI) * 0.05;
                h = (h + 1) % 1; // Wrap hue value

                materials[i].color.setHSL(h, baseSat, baseLight); // Set color
                materials[i].opacity = backgroundState === 'enhanced' ? 0.85 : 0.7; // Adjust opacity
                materials[i].size = currentParams[paramIndex][1]; // Adjust size
            }

            // Render the scene if renderer exists
            if (renderer) { renderer.render(scene, camera); }
        }

        // --- Event Handlers ---
        function onDocumentMouseMove(e) { mouseX = e.clientX - windowHalfX; mouseY = e.clientY - windowHalfY; }

        // MOBILE FIX: Only prevent default if touch is on background, not UI elements
        function onDocumentTouchStart(e) {
            if (e.touches.length === 1) {
                // Check if the event target is the background container or canvas
                if (e.target === container || e.target === renderer?.domElement) {
                    // Only prevent default if necessary for the background interaction itself
                    // (e.g., if it interferes with scrolling/zooming). Often not needed if body overflow is hidden.
                    // e.preventDefault(); // Uncomment IF NEEDED for background interaction
                }
                // Update coordinates regardless
                mouseX = e.touches[0].pageX - windowHalfX;
                mouseY = e.touches[0].pageY - windowHalfY;
            }
        }

        // MOBILE FIX: Only prevent default if touch is on background
        function onDocumentTouchMove(e) {
            if (e.touches.length === 1) {
                 // Check if the event target is the background container or canvas
                if (e.target === container || e.target === renderer?.domElement) {
                    // e.preventDefault(); // Uncomment IF NEEDED for background interaction
                }
                // Update coordinates regardless
                mouseX = e.touches[0].pageX - windowHalfX;
                mouseY = e.touches[0].pageY - windowHalfY;
            }
        }

        function onWindowResize() {
            try {
                WIDTH = window.innerWidth; HEIGHT = window.innerHeight;
                windowHalfX = WIDTH / 2; windowHalfY = HEIGHT / 2;
                if (camera) { camera.aspect = WIDTH / HEIGHT; camera.updateProjectionMatrix(); }
                if (renderer) renderer.setSize(WIDTH, HEIGHT);
            } catch (e) { console.error("Error on window resize:", e); }
        }

        // --- Initialize ---
        // Wait for DOM if necessary, otherwise init immediately
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initThreeJS);
        } else {
            initThreeJS();
        }

        // --- Cleanup on page unload ---
        window.addEventListener('unload', () => {
            if (rafId) cancelAnimationFrame(rafId); // Stop animation loop
            // Remove listeners
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('mousemove', onDocumentMouseMove);
            document.removeEventListener('touchstart', onDocumentTouchStart);
            document.removeEventListener('touchmove', onDocumentTouchMove);
            // Note: Removing custom event listeners might require storing the handler reference.
            console.log("Three.js background cleaned up.");
        });

    // Catch top-level errors
    } catch (e) {
        console.error("Error in Three.js background script:", e);
        const bgContainer = document.getElementById('threejs-bg');
        if (bgContainer) bgContainer.style.background = '#111'; // Fallback background
    }
})(); // End of IIFE