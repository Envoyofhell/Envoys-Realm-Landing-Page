// Three.js Particle Background
(function() {
    'use strict';
    
    // Scene variables
    let scene, camera, renderer;
    let container, particles, geometry, materials = [];
    
    // Interaction variables
    let mouseX = 0, mouseY = 0;
    let windowHalfX, windowHalfY;
    
    // Configuration constants
    const BACKGROUND_COLOR = 0x0a0514;
    const PARTICLE_COUNT = 10000;
    const CAMERA_Z = 1000;
    
    // Particle color and size parameters
    const PARTICLE_PARAMS = [
        [[0.95, 0.6, 0.2], 3],   // Dark Reddish-Purple
        [[0.80, 0.6, 0.15], 2.5], // Dark Purple
        [[0.0,  0.6, 0.15], 2.5], // Dark Red
        [[0.85, 0.5, 0.1], 2],   // Very Dark Purple
        [[0.98, 0.5, 0.1], 2]    // Very Dark Red
    ];

    function initBackground() {
        // Get container
        container = document.getElementById('threejs-bg');
        if (!container) {
            console.error('Background container not found');
            return;
        }

        // Scene setup
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(BACKGROUND_COLOR, 0.001);

        // Camera setup
        const width = window.innerWidth;
        const height = window.innerHeight;
        windowHalfX = width / 2;
        windowHalfY = height / 2;

        camera = new THREE.PerspectiveCamera(75, width / height, 1, 3000);
        camera.position.z = CAMERA_Z;

        // Geometry setup
        geometry = new THREE.BufferGeometry();
        const positions = [];

        // Generate particle positions
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions.push(
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000,
                Math.random() * 2000 - 1000
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        // Create particle systems
        PARTICLE_PARAMS.forEach(([color, size]) => {
            const material = new THREE.PointsMaterial({
                size: size,
                vertexColors: false,
                blending: THREE.NormalBlending,
                transparent: true,
                opacity: 0.6
            });

            const particleSystem = new THREE.Points(geometry, material);
            particleSystem.rotation.x = Math.random() * 6;
            particleSystem.rotation.y = Math.random() * 6;
            particleSystem.rotation.z = Math.random() * 6;
            
            scene.add(particleSystem);
            materials.push(material);
        });

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.setClearColor(BACKGROUND_COLOR, 1);
        container.appendChild(renderer.domElement);

        // Event listeners
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('touchmove', onTouchMove, { passive: false });

        // Start animation
        animate();
    }

    function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        windowHalfX = width / 2;
        windowHalfY = height / 2;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    function onMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onTouchMove(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const time = Date.now() * 0.00005;

        // Subtle camera movement
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Rotate particles
        scene.children.forEach((child, index) => {
            if (child instanceof THREE.Points) {
                child.rotation.y = time * (index % 2 === 0 ? 1 : -1);
            }
        });

        // Subtle color shift
        materials.forEach((material, index) => {
            const color = PARTICLE_PARAMS[index][0];
            const hue = (color[0] + time * 3) % 1;
            material.color.setHSL(hue, color[1], color[2]);
        });

        renderer.render(scene, camera);
    }

    // Initialize when Three.js is loaded
    if (typeof THREE !== 'undefined') {
        initBackground();
    } else {
        console.error('Three.js not loaded');
        if (container) container.style.background = '#111';
    }
})();