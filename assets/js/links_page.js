// links_page.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Links Directory DOM loaded.");

    // --- Project Data (Replace with your actual projects) ---
    const projects = [
        {
            id: "project-1",
            title: "Project Alpha",
            description: "A revolutionary web application using AI to optimize workflows and enhance productivity across teams.",
            // Example using Heroicons (Outline): https://heroicons.com/
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591l3.409 3.409c.836.836 1.4 2.047 1.4 3.291v1.313M9.75 3.104c1.63.204 3.162.526 4.5 0m4.5 0a2.25 2.25 0 0 1 .659 1.591l3.409 3.409c.836.836 1.4 2.047 1.4 3.291v1.313M3 18.375v-1.313c0-1.243.564-2.455 1.4-3.29L7.81 10.36a2.25 2.25 0 0 1 .659-1.59V3.104a2.25 2.25 0 0 1-1.5-.082A24.299 24.299 0 0 0 3 18.375Z" /> </svg>',
            projectUrl: "#", // Link to project demo/page
            githubUrl: "#", // Link to GitHub repo
            glowHue: 0 // Red-ish glow
        },
        {
            id: "project-2",
            title: "Gamma Framework",
            description: "Lightweight CSS framework for rapid prototyping with a focus on accessibility and modern design patterns.",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>',
            projectUrl: "#",
            githubUrl: "#",
            glowHue: 280 // Purple-ish glow
        },
        {
            id: "project-3",
            title: "Neon Dreams",
            description: "Interactive WebGL experience showcasing procedural generation and advanced shader techniques.",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a17.96 17.96 0 0 0-5.84 7.38m5.84-7.38a17.96 17.96 0 0 1-7.38 5.84m7.38-5.84a6 6 0 0 1 2.18-5.84m0 5.84a7.5 7.5 0 0 0-2.18-5.84m-7.38 2.56a17.96 17.96 0 0 1 7.38-5.84m-7.38 5.84a6 6 0 0 1-5.84-2.18m0 2.18a7.5 7.5 0 0 0 5.84 2.18m-5.84 0h4.82m2.56a17.96 17.96 0 0 0 7.38-5.84m-7.38 5.84a17.96 17.96 0 0 1-5.84 7.38m5.84-7.38a6 6 0 0 1-7.38 5.84m7.38-5.84a7.5 7.5 0 0 0-7.38 5.84m0 0v4.82m-2.56a17.96 17.96 0 0 1-7.38-5.84m7.38 5.84a17.96 17.96 0 0 0-5.84 7.38m-5.84-7.38a6 6 0 0 1 5.84-7.38m-5.84 7.38a7.5 7.5 0 0 0 5.84 7.38M9 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /></svg>',
            projectUrl: "#",
            githubUrl: "#",
            glowHue: 330 // Pink/Red glow
        },
        {
            id: "project-4",
            title: "Data Visualizer",
            description: "A tool for creating stunning, interactive charts and graphs from complex datasets using D3.js.",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>',
            projectUrl: "#",
            githubUrl: "#",
            glowHue: 210 // Blue-ish glow
        },
        {
            id: "project-5",
            title: "Synthwave Player",
            description: "A retro-themed music player with audio visualization effects built with Tone.js.",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V7.5A2.25 2.25 0 0 0 18.75 5.25H17.25A2.25 2.25 0 0 0 15 7.5v1.81M9 9l-6.75-3m0 12.75a2.25 2.25 0 0 1-1.632-2.163l1.32-.377a1.803 1.803 0 1 1 .99 3.467l-2.31.66A2.25 2.25 0 0 0 2.25 16.5Zm0 0v1.81" /></svg>',
            projectUrl: "#",
            githubUrl: "#",
            glowHue: 300 // Magenta glow
        },
         {
            id: "project-6",
            title: "Portfolio v3",
            description: "The latest iteration of my personal portfolio website, showcasing skills and projects.",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>',
            projectUrl: "#",
            githubUrl: "#",
            glowHue: 260 // Indigo glow
        },
    ];

    // --- DOM Element Selectors ---
    const menu = document.getElementById('menu');
    const menuToggle = document.getElementById('menu-toggle');
    const menuProjectList = document.getElementById('menu-project-list');
    const cardsContainer = document.querySelector(".cards-container");
    const cardsWrapper = document.querySelector(".cards-wrapper");
    const cursorLight = document.querySelector(".cursor-light");

    // --- State Variables ---
    let menuItems = []; // Will be populated after dynamic loading
    let totalWidthOfOneSet = 0;
    let scrollPosition = 0;
    let animationFrameId = null;
    let isManuallyScrolling = false;
    let resizeTimeout;
    const scrollSpeed = 0.4; // Adjust speed as needed (pixels per frame)

    // --- Initialization Functions ---

    /**
     * Populates the project list in the menu.
     */
    function populateMenuProjectList() {
        if (!menuProjectList) {
            console.warn("Menu project list container (#menu-project-list) not found.");
            return;
        }
        menuProjectList.innerHTML = ''; // Clear loading/static items
        if (projects.length === 0) {
            menuProjectList.innerHTML = '<li class="text-gray-500 italic p-2">No projects found.</li>';
            return;
        }
        projects.forEach(project => {
            const li = document.createElement('li');
            li.setAttribute('data-target-card', project.id);
            // Ensure icon SVG has fixed size and doesn't affect layout
            const iconHtml = project.icon ? project.icon.replace('<svg', '<svg class="w-5 h-5 flex-shrink-0"') : '<span class="w-5 h-5 flex-shrink-0">?</span>';
            li.innerHTML = `
                ${iconHtml}
                <span>${project.title}</span>
            `;
            menuProjectList.appendChild(li);
        });
    }

    /**
     * Attaches event listeners to all menu items (static and dynamic).
     */
    function attachMenuListeners() {
        if (!menu) return;
        // Query *all* list items within the menu
        menuItems = Array.from(menu.querySelectorAll('li'));
        menuItems.forEach(item => {
            // Remove potential old listener before adding new one to prevent duplicates
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            // Add the click listener to the new node
            newItem.addEventListener('click', () => handleMenuItemClick(newItem));
        });
    }

    /**
     * Creates a DOM element for a project card.
     * @param {object} project - The project data object.
     * @returns {HTMLElement} - The created card element.
     */
    function createCardElement(project) {
        const card = document.createElement("div");
        card.className = "card";
        card.id = project.id;
        card.style.setProperty("--glow-hue", String(project.glowHue));

        // Randomize animation timings
        const glowDuration = 3 + Math.random() * 3; // 3-6s
        const glowDelay = Math.random() * -4; // Start at different times
        const floatDuration = 4 + Math.random() * 3; // 4-7s

        card.style.setProperty("--glow-duration", `${glowDuration}s`);
        card.style.setProperty("--glow-delay", `${glowDelay}s`);
        card.style.animationDuration = `${floatDuration}s, ${glowDuration}s`;

        const iconHtml = project.icon ? project.icon.replace('<svg', '<svg class="w-full h-full object-contain"') : '?';
        card.innerHTML = `
            <div class="card-content">
                <div class="flex-grow"> <div class="card-header">
                        <span class="card-icon">${iconHtml}</span>
                        <h3 class="card-title">${project.title}</h3>
                    </div>
                    <p class="card-description">${project.description}</p>
                </div>
                <div class="card-links">
                    <a href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" class="card-link" title="View Project: ${project.title}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                        <span>View</span>
                    </a>
                    <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="card-github-link" title="View GitHub Repository for ${project.title}">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>`;

        // Card click listener (opens project URL if not clicking a link)
        card.addEventListener('click', (e) => {
             if (!e.target.closest('a')) {
                if (project.projectUrl && project.projectUrl !== '#') {
                    window.open(project.projectUrl, '_blank', 'noopener,noreferrer');
                }
             }
        });
        return card;
    }

    /**
     * Initializes the carousel by creating and appending card elements.
     */
    function initializeCarousel() {
        if (!cardsContainer || !cardsWrapper) {
             console.error("Cannot initialize carousel: container or wrapper missing.");
             return;
        }
        cardsContainer.innerHTML = ""; // Clear existing
        const fragment = document.createDocumentFragment();

        if (projects.length === 0) {
             console.warn("Projects array is empty. Cannot initialize carousel.");
             cardsContainer.innerHTML = '<p class="text-center text-gray-500 p-10">No projects to display.</p>';
             return;
        }

        // Create three sets of cards for infinite scroll
        for (let i = 0; i < 3; i++) {
            projects.forEach((project) => {
                const cardElement = createCardElement(project);
                fragment.appendChild(cardElement);
            });
        }
        cardsContainer.appendChild(fragment);

        // Use requestAnimationFrame to ensure layout is calculated before getting width
        requestAnimationFrame(() => {
            totalWidthOfOneSet = calculateSetWidth();

            if (totalWidthOfOneSet > 0) {
                 scrollPosition = totalWidthOfOneSet; // Start at the beginning of the second set
                 cardsWrapper.style.transform = `translateX(-${scrollPosition}px)`;
                 console.log(`Carousel initialized. Set width: ${totalWidthOfOneSet}px. Initial scroll: ${scrollPosition}px`);
                 startCarouselAnimation(); // Start animation
            } else {
                console.warn("Carousel set width calculation failed after render. Animation not started.");
                cardsWrapper.style.transform = `translateX(0px)`; // Show first set statically
            }
        });
    }

    /**
     * Calculates the total width of one set of project cards including gaps.
     * @returns {number} - The calculated width in pixels.
     */
    function calculateSetWidth() {
        if (projects.length === 0 || !cardsContainer) return 0;
        const firstCard = cardsContainer.querySelector('.card');
        if (!firstCard) {
            // console.warn("calculateSetWidth: No cards found in container yet.");
            return 0; // No cards rendered yet
        }

        try {
            const cardStyle = window.getComputedStyle(firstCard);
            const containerStyle = window.getComputedStyle(cardsContainer);
            const cardWidth = firstCard.offsetWidth; // Includes padding/border
            const gap = parseFloat(containerStyle.gap) || 0; // Get gap value
            // Width = (N * cardWidth) + ((N-1) * gap)
            // Ensure N > 0 before calculating gap term
            const gapTerm = projects.length > 1 ? (gap * (projects.length - 1)) : 0;
            const setWidth = (cardWidth * projects.length) + gapTerm;
            // console.log(`Calculated - Card Width: ${cardWidth}, Gap: ${gap}, Set Width: ${setWidth}`);
            return setWidth > 0 ? setWidth : 0; // Ensure non-negative width
        } catch (e) {
            console.error("Error calculating set width:", e);
            return 0;
        }
    }

    // --- Event Handlers ---

    /**
     * Handles clicks on menu items, selects the item, and scrolls if needed.
     * @param {HTMLElement} item - The clicked menu item (li element).
     */
    function handleMenuItemClick(item) {
        // Remove 'selected' from all items
        menuItems.forEach(el => el.classList.remove('selected'));
        // Add 'selected' to the clicked item
        item.classList.add('selected');

        const targetCardId = item.getAttribute('data-target-card');
        const link = item.querySelector('a');

        if (targetCardId) {
            scrollToCard(targetCardId);
            // Optional: Close menu after scrolling
            // closeMenu();
        } else if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') {
            // Is a navigation link, close menu and allow navigation
            closeMenu();
        } else {
            // Clicked on a non-project, non-link item (e.g., header, separator)
            // Or a placeholder link (#) - do nothing or maybe close menu
            // closeMenu(); // Decide if you want to close menu here
        }
    }

    /**
     * Toggles the menu open/closed state.
     */
    function toggleMenu() {
        if (!menu || !menuToggle) return;
        menu.classList.toggle('open');
        menuToggle.textContent = menu.classList.contains('open') ? 'Close' : 'Menu';
    }

    /**
     * Closes the menu if it's open.
     */
    function closeMenu() {
        if (!menu || !menuToggle) return;
        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
            menuToggle.textContent = 'Menu';
        }
    }

    /**
     * Handles mouse movement for the cursor light effect.
     * @param {MouseEvent} e - The mouse event.
     */
    function handleMouseMove(e) {
        if (!cursorLight) return;
        requestAnimationFrame(() => {
            cursorLight.style.left = `${e.clientX}px`;
            cursorLight.style.top = `${e.clientY}px`;
        });
    }

    /**
     * Handles mouseover events to change cursor light color.
     * @param {MouseEvent} e - The mouse event.
     */
    function handleMouseOver(e) {
         if (!cursorLight) return;
         const card = e.target.closest('.card');
         const interactiveElement = e.target.closest('button, a, li[data-target-card]');
         let targetHue = 'var(--hue1, 300)'; // Default purple

         if (card) {
             targetHue = card.style.getPropertyValue('--glow-hue') || targetHue;
         } else if (interactiveElement) {
             targetHue = 'var(--hue2, 0)'; // Red for interactive elements
         }
         cursorLight.style.background = `radial-gradient(circle, hsla(${targetHue}, 80%, 70%, 0.1) 0%, transparent 70%)`;
    }

    /**
      * Handles window resize events, debounced for performance.
      */
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("Window resized, recalculating...");
            stopCarouselAnimation(); // Stop animation

            // Recalculate width using rAF for accuracy after layout changes
            requestAnimationFrame(() => {
                totalWidthOfOneSet = calculateSetWidth();

                if (totalWidthOfOneSet > 0) {
                    // Reset scroll position to the start of the second set based on new width
                    scrollPosition = totalWidthOfOneSet;
                    cardsWrapper.style.transition = 'none'; // No transition during resize adjustment
                    cardsWrapper.style.transform = `translateX(-${scrollPosition}px)`;
                    void cardsWrapper.offsetWidth; // Force reflow
                    cardsWrapper.style.transition = ''; // Re-enable potential CSS transitions
                    startCarouselAnimation(); // Restart animation
                    console.log(`Recalculated set width: ${totalWidthOfOneSet}, Reset scroll: ${scrollPosition}`);
                } else {
                     console.warn("Recalculation failed after resize. Carousel might not function correctly.");
                     cardsWrapper.style.transform = `translateX(0px)`; // Fallback
                }
            });
        }, 250); // Debounce time
    }


    // --- Carousel Animation Control ---

    /**
     * The main animation loop for the carousel.
     */
    function animateCarouselLoop() {
        // Check if animation should run
        if (isManuallyScrolling || totalWidthOfOneSet <= 0 || !cardsWrapper) {
            // If stopped or invalid state, request the next frame and exit
            animationFrameId = requestAnimationFrame(animateCarouselLoop);
            return;
        }

        scrollPosition += scrollSpeed; // Increment scroll position

        // Reset logic: when the scroll position exceeds the start of the third set
        if (scrollPosition >= totalWidthOfOneSet * 2) {
             // Calculate the amount scrolled past the reset point
             const overshoot = scrollPosition - (totalWidthOfOneSet * 2);
             // Jump back to the start of the second set, plus the overshoot
             scrollPosition = totalWidthOfOneSet + overshoot;
             // Apply the transform without transition for an "instant" jump
             cardsWrapper.style.transition = 'none';
             cardsWrapper.style.transform = `translateX(-${scrollPosition}px)`;
             // Force reflow/repaint might help ensure the jump is seamless
             void cardsWrapper.offsetWidth;
             // Re-enable transition if defined in CSS (though likely not needed here)
             cardsWrapper.style.transition = '';
             // console.log(`Carousel reset. Overshoot: ${overshoot.toFixed(2)}, New scrollPosition: ${scrollPosition.toFixed(2)}`); // Debug log for reset
        } else {
            // Apply the normal transform for smooth scrolling
            cardsWrapper.style.transform = `translateX(-${scrollPosition}px)`;
        }

        // Request the next frame to continue the loop
        animationFrameId = requestAnimationFrame(animateCarouselLoop);
    }


    /**
     * Starts the carousel animation if it's not already running and conditions are met.
     */
    function startCarouselAnimation() {
        // Only start if not already running and width is valid
        if (!animationFrameId && totalWidthOfOneSet > 0) {
            console.log("Starting carousel animation.");
            isManuallyScrolling = false; // Ensure manual scroll flag is off
            animationFrameId = requestAnimationFrame(animateCarouselLoop);
        } else if (totalWidthOfOneSet <= 0) {
             console.warn("Cannot start animation: Carousel width is invalid.");
        } else {
            // console.log("Animation already running or conditions not met.");
        }
    }

    /**
     * Stops the carousel animation.
     */
    function stopCarouselAnimation() {
        if (animationFrameId) {
            console.log("Stopping carousel animation.");
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null; // Clear the ID
        }
    }

    // --- Scrolling Function ---

    /**
     * Smoothly scrolls the carousel to bring the specified card into view.
     * @param {string} cardId - The ID of the card element to scroll to.
     */
    function scrollToCard(cardId) {
        const allCards = Array.from(cardsContainer.querySelectorAll('.card'));
        if (allCards.length === 0 || projects.length === 0 || !cardsWrapper || totalWidthOfOneSet <= 0) {
             console.warn("Cannot scroll to card: Invalid state (no cards, no projects, no wrapper, or zero width).");
             return;
        }

        const projectIndex = projects.findIndex(p => p.id === cardId);
        if (projectIndex === -1) {
             console.warn(`Project index for card ID ${cardId} not found.`);
             return;
        }

        // Target the instance in the *second* set for calculation reference
        const targetCardInstanceIndex = projects.length + projectIndex;
        const targetCardInstance = allCards[targetCardInstanceIndex];
        if (!targetCardInstance) {
             console.warn(`Card instance for ID ${cardId} in the second set not found.`);
             return;
        }

        const carouselVisibleWidth = cardsWrapper.parentElement.offsetWidth;
        const cardWidth = targetCardInstance.offsetWidth;
        // Calculate offset relative to the start of the cardsContainer
        const cardOffsetLeft = targetCardInstance.offsetLeft;

        // Calculate target scroll to center the card
        let targetScroll = cardOffsetLeft - (carouselVisibleWidth / 2) + (cardWidth / 2);

        // --- IMPORTANT: Adjust targetScroll relative to the infinite scroll ---
        // Since we reset the scroll position, the actual target might be in the
        // first or third visual set when calculating. We want to scroll to the
        // equivalent position within the second set's range [totalWidthOfOneSet, totalWidthOfOneSet * 2).

        // Find the current visual "set" based on scrollPosition
        const currentSetOffset = Math.floor(scrollPosition / totalWidthOfOneSet) * totalWidthOfOneSet;
        // Calculate the target offset within a single set
        const targetOffsetWithinSet = targetScroll % totalWidthOfOneSet;
        // The final target scroll should be within the second set's range
        targetScroll = totalWidthOfOneSet + targetOffsetWithinSet;


        // Clamp scroll position (optional, but good practice)
        targetScroll = Math.max(0, targetScroll);

        console.log(`Scrolling to card: ${cardId}. Target Scroll: ${targetScroll.toFixed(2)}`);

        stopCarouselAnimation(); // Stop auto-scroll
        isManuallyScrolling = true; // Set flag

        // Animate the scroll
        cardsWrapper.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        cardsWrapper.style.transform = `translateX(-${targetScroll}px)`;
        scrollPosition = targetScroll; // Update current scroll position state

        // Resume automatic animation after the transition
        // Clear any existing timeout to prevent conflicts if user clicks rapidly
        clearTimeout(window.resumeScrollTimeout);
        window.resumeScrollTimeout = setTimeout(() => {
             cardsWrapper.style.transition = ''; // Remove transition style
             isManuallyScrolling = false; // Reset flag
             startCarouselAnimation(); // Restart auto-scroll
        }, 900); // Delay slightly longer than transition (800ms + 100ms buffer)
    }

    // --- Event Listeners ---
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent body click listener from closing immediately
            toggleMenu();
        });
    }
    document.addEventListener('click', (event) => {
        // Close menu if clicking outside the menu and not on the toggle button
        if (menu && menu.classList.contains('open') && !menu.contains(event.target) && event.target !== menuToggle) {
            closeMenu();
        }
    });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('resize', handleResize);

    // --- Initial Setup ---
    populateMenuProjectList(); // Add projects to menu
    attachMenuListeners();    // Add listeners to all menu items
    initializeCarousel();     // Setup the carousel cards and attempt to start animation

}); // End DOMContentLoaded
