// interactions.js - Handles UI interactions, audio playback, and transitions
// Includes attempt to initialize audio on Hell Button hover (with browser limitations)
// Implements 2-stage mute button: Click 1 shows slider, Click 2+ toggles mute.

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for interactions.js"); // Log initialization

    // --- Element Selectors ---
    // Get references to interactive elements in the DOM
    const horrorBallWrapper = document.querySelector('.horror-ball-wrapper');
    const horrorBall = document.querySelector('.horror-ball');
    const hellButton = document.getElementById('hell-button');
    const audioPrompt = document.getElementById('audio-prompt'); // Prompt to enable audio
    const tvShutdownOverlay = document.getElementById('tv-shutdown-overlay'); // Transition overlay

    // Basic check for essential elements
    if (!hellButton || !tvShutdownOverlay) {
        console.error("Essential HTML elements missing! (hellButton or tvShutdownOverlay)");
        // Decide if functionality should stop; maybe some parts can proceed.
    }
    if (!audioPrompt) {
        console.warn("Audio prompt element (#audio-prompt) not found on initial load.");
    }


    // --- State Variables ---
    let audioInitialized = false;      // Flag: Has the user interacted to allow audio?
    let isMuted = false;               // Flag: Is the *music* currently muted? (Initial state: Not Muted)
    let isRaveMode = false;            // Flag: Is Rave Mode active?
    let isVolumeSliderVisible = false; // Flag: Is the volume slider currently visible? (Initial state: Hidden)

    // --- Audio Management ---
    // Create Audio objects for sounds and music
    // IMPORTANT: Ensure these paths are correct relative to your HTML file!
    const backgroundMusic = new Audio('./assets/music/Pokemon RedBlue - Pokemon tower (slowed reverb).mp3');
    const raveMusic = new Audio('./assets/music/Pokemon BlueRed - Bicycle Theme.mp3');
    const tvShutoffSound = new Audio('./assets/sounds/tv-shutoff.mp3');
    const tvStaticSound = new Audio('./assets/sounds/tv-static.mp3');
    // Preload sounds that need quick response (optional but good practice)
    tvShutoffSound.preload = 'auto';
    tvStaticSound.preload = 'auto';

    // --- Create Audio Controls Dynamically ---
    // Create elements for audio controls programmatically
    const audioControlContainer = document.createElement('div');
    audioControlContainer.id = 'audio-control-container';
    const songNameDisplay = document.createElement('div');
    songNameDisplay.id = 'song-name';
    songNameDisplay.textContent = "---"; // Default text until audio loads
    const volumeContainer = document.createElement('div');
    volumeContainer.id = 'volume-container'; // Container for the slider
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range'; volumeSlider.min = 0; volumeSlider.max = 100; volumeSlider.value = 25; // Default volume 25%
    volumeSlider.id = 'volume-slider';
    const muteButton = document.createElement('button');
    muteButton.id = 'mute-button';
    muteButton.classList.add('audio-button');
    // Set initial icon based on the initial 'isMuted' state
    muteButton.textContent = isMuted ? '🔇' : '🔊';
    const raveModeButton = document.createElement('button');
    raveModeButton.textContent = '🎉'; // Rave mode toggle icon
    raveModeButton.classList.add('audio-button');

    // Assemble the controls
    volumeContainer.appendChild(volumeSlider); // Put slider inside its container
    audioControlContainer.appendChild(songNameDisplay); // Add song name display
    audioControlContainer.appendChild(volumeContainer); // Add slider container
    audioControlContainer.appendChild(muteButton);      // Add mute button
    audioControlContainer.appendChild(raveModeButton);  // Add rave button
    // Note: audioControlContainer is appended to the body later in initAudio()

    // --- Audio Utility Functions ---

    /**
     * Updates the song name display based on the currently playing audio element.
     * @param {HTMLAudioElement} audioElement - The audio element whose name should be displayed.
     */
    function updateSongName(audioElement) {
        if (!audioElement || !songNameDisplay) return; // Safety check
        try {
            // Check if src is valid before trying to parse
            if (!audioElement.src || !audioElement.src.includes('/') || audioElement.src.endsWith('/')) {
                songNameDisplay.textContent = "Loading...";
                const updateOnLoad = () => updateSongName(audioElement);
                const updateOnError = () => { songNameDisplay.textContent = "Audio Error"; };
                audioElement.addEventListener('loadedmetadata', updateOnLoad, { once: true });
                audioElement.addEventListener('error', updateOnError, { once: true });
                audioElement.addEventListener('emptied', () => {
                     audioElement.removeEventListener('loadedmetadata', updateOnLoad);
                     audioElement.removeEventListener('error', updateOnError);
                }, { once: true });
                return;
            }
            const filename = audioElement.src.split('/').pop();
            if (!filename) { songNameDisplay.textContent = "---"; return; }
            const decodedName = decodeURIComponent(filename)
                .replace(/\.(mp3|wav|ogg)$/i, '').replace(/_/g, ' ').replace(/-/g, ' - ')
                .replace(/ {2,}/g,' ').replace(/\(.*?\)/g, '').trim();
            songNameDisplay.textContent = decodedName || "---";
        } catch (e) {
            console.error("Error parsing/updating song name:", e);
            songNameDisplay.textContent = "Error";
        }
    }

    /**
     * Sets the volume for all relevant audio elements.
     * @param {number|string} volumeValue - Volume level from 0 to 100.
     */
    function setVolume(volumeValue) {
        const volume = parseFloat(volumeValue) / 100; // Convert 0-100 range to 0.0-1.0
        backgroundMusic.volume = volume;
        raveMusic.volume = volume;
        console.log("Volume set to:", volumeValue);
    }

    /**
     * Initial setup common to all audio elements (looping, initial volume).
     */
    function setupAudio() {
        backgroundMusic.loop = true;
        raveMusic.loop = true;
        setVolume(volumeSlider.value); // Set initial volume
    }

    // --- Function to Initialize Audio on User Interaction ---
    /**
     * Called once after the first user interaction (or attempted on hover)
     * to enable audio playback and add audio controls to the page.
     */
    function initAudio() {
        if (audioInitialized) return; // Run only once
        audioInitialized = true; // Set flag immediately
        console.log("Running initAudio()...");

        // Remove the "Click to enable" prompt if it exists
        const currentAudioPrompt = document.getElementById('audio-prompt');
        if (currentAudioPrompt) {
            currentAudioPrompt.remove();
        } else {
            // Warning moved to initial load check, less noise here.
        }

        // Add the dynamically created audio controls to the page body
        // Check if not already appended (safety for multiple calls, though flag should prevent)
        if (!document.getElementById('audio-control-container')) {
            document.body.appendChild(audioControlContainer);
        }

        // Perform initial audio setup (volume, looping)
        setupAudio();

        // --- Try playing the initial background music ---
        // NOTE: This .play() call will likely fail if initAudio was triggered
        // solely by HOVER before any click/tap occurred, due to browser policy.
        console.log("Attempting backgroundMusic.play() inside initAudio...");
        backgroundMusic.play()
            .then(() => {
                // This 'then' block likely only runs if initAudio was triggered by a click/tap.
                console.log("Background music playing started successfully.");
                updateSongName(backgroundMusic); // Update display
            })
            .catch(error => {
                // This 'catch' block WILL likely run if initAudio was triggered by hover first.
                console.warn(`Background music play() failed inside initAudio (Error: ${error.name}). This is expected if triggered by hover before user click/tap.`);
                if (songNameDisplay) songNameDisplay.textContent = "Audio Paused"; // Indicate inactive state
            });
    }

    // --- Autoplay Fix: Require User Interaction (Reliable Method) ---
    /**
     * Handler for the first *reliable* user interaction (click, touch, keydown).
     * Calls initAudio() if it hasn't run successfully yet.
     */
    function interactionHandler() {
        // Call initAudio only if the flag isn't set. It's safe to call multiple times
        // as initAudio itself checks the flag.
        if (!audioInitialized) {
            console.log("User interaction (click/tap/key) detected, ensuring audio initialization.");
            initAudio();
        }
        // Listeners with {once: true} remove themselves automatically.
    }

    // Add listeners for the *first* reliable interaction.
    document.addEventListener('click', interactionHandler, { once: true });
    document.addEventListener('touchstart', interactionHandler, { once: true });
    document.addEventListener('keydown', interactionHandler, { once: true });
    // Also listen specifically on the prompt itself.
    const initialAudioPrompt = document.getElementById('audio-prompt');
    if (initialAudioPrompt) {
        initialAudioPrompt.addEventListener('click', interactionHandler, { once: true });
    }

    // --- Audio Control Interactions ---

    // Volume Slider Interaction
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            setVolume(e.target.value);
        });
    }

    // --- Mute Button & Volume Slider Visibility (LOGIC: Click 1: Show, Click 2: Mute) ---
    // Function to explicitly hide the slider
    function hideVolumeSlider() {
        if (isVolumeSliderVisible && volumeContainer) {
            volumeContainer.style.display = 'none';
            isVolumeSliderVisible = false;
        }
    }
    // Function to explicitly show the slider
    function showVolumeSlider() {
        if (!isVolumeSliderVisible && volumeContainer) {
            volumeContainer.style.display = 'block';
            isVolumeSliderVisible = true;
        }
    }

    if (muteButton) {
        // Ensure the initial icon reflects the starting mute state
        muteButton.textContent = isMuted ? '🔇' : '🔊';

        muteButton.addEventListener('click', () => {
            // Ensure audio context has been attempted (important if mute is the *very first* interaction)
            if (!audioInitialized) initAudio();

            if (isVolumeSliderVisible) {
                // --- SECOND+ CLICK LOGIC (Slider is already visible) ---
                isMuted = !isMuted; // Toggle the state variable
                backgroundMusic.muted = isMuted; // Apply mute state
                raveMusic.muted = isMuted;
                muteButton.textContent = isMuted ? '🔇' : '🔊'; // Update the icon
                console.log("Music Muted Toggled:", isMuted);
                // Slider remains visible.
            } else {
                // --- FIRST CLICK LOGIC (Slider is hidden) ---
                showVolumeSlider(); // ONLY show the slider.
                console.log("Volume slider shown on first click.");
                // Mute state and icon are NOT changed by this action.
            }
        });
    }

    // Add listeners to hide volume slider ONLY if user clicks/taps outside the controls
    document.addEventListener('click', (event) => {
        if (isVolumeSliderVisible &&
            muteButton && !muteButton.contains(event.target) &&
            volumeContainer && !volumeContainer.contains(event.target)) {
            hideVolumeSlider();
        }
    });
    document.addEventListener('touchstart', (event) => {
        if (isVolumeSliderVisible &&
            muteButton && !muteButton.contains(event.target) &&
            volumeContainer && !volumeContainer.contains(event.target)) {
            hideVolumeSlider();
        }
    }, { passive: true });


    // Rave Mode Button Interaction
    if (raveModeButton) {
        raveModeButton.addEventListener('click', () => {
            if (!audioInitialized) initAudio();
            isRaveMode = !isRaveMode;
            console.log("Rave Mode Toggled:", isRaveMode);
            let targetMusic = isRaveMode ? raveMusic : backgroundMusic;
            let otherMusic = isRaveMode ? backgroundMusic : raveMusic;
            otherMusic.pause();
            if (!isMuted) {
                targetMusic.play().catch(e => console.error(`Error playing ${isRaveMode ? 'rave' : 'background'} music:`, e));
            }
            updateSongName(targetMusic);
            document.dispatchEvent(new CustomEvent('background-state-change', {
                detail: { state: isRaveMode ? 'enhanced' : 'normal' }
            }));
        });
    }

    // --- Hell Button Interactions (MODIFIED MOUSEENTER) ---
    if (hellButton) {
        // MODIFIED: Attempt to init audio and play static sound on hover
        hellButton.addEventListener('mouseenter', () => {
            // --- Attempt to initialize audio context on hover ---
            // This will run setup, but browser policy likely prevents audible .play()
            // calls initiated by hover alone until a click/tap occurs somewhere.
            if (!audioInitialized) {
                 console.log("Hover detected on Hell Button, attempting initAudio...");
            }
            initAudio(); // Call initAudio - it handles the 'audioInitialized' flag internally

            // --- Attempt to play static sound ---
            // Play only if initAudio has run at least once.
            // The browser might STILL block this play() until a click/tap gesture.
            if (audioInitialized && tvStaticSound) {
                tvStaticSound.currentTime = 0; // Rewind
                tvStaticSound.play().catch(e => {
                    // Catch the likely NotAllowedError silently or log for debugging
                    console.warn(`Static sound play() on hover failed or was blocked (Error: ${e.name}). This is expected before the first click/tap.`);
                });
            }
        });

        // Pause static sound when mouse leaves
        hellButton.addEventListener('mouseleave', () => {
             if (tvStaticSound) tvStaticSound.pause();
        });

        // Handle click on the Hell Button (Transition)
        hellButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link navigation immediately
            if (!audioInitialized) initAudio(); // Ensure initialized if click is first interaction

            console.log('Hell Button Clicked - Triggering Transition');
            hellButton.classList.add('clicked');
            setTimeout(() => { hellButton.classList.remove('clicked'); }, 150);

            // Stop other sounds/music
            try {
                tvStaticSound.pause(); tvStaticSound.currentTime = 0;
                backgroundMusic.pause();
                raveMusic.pause();
                console.log("Other sounds/music paused for transition.");
            } catch (err) { console.error("Error pausing sounds:", err); }

            // Play TV Shutoff Sound (should work if audioInitialized is true)
            if (audioInitialized && tvShutoffSound) {
                console.log("Attempting to play TV Shutoff Sound...");
                tvShutoffSound.currentTime = 0;
                tvShutoffSound.play().catch(e => console.error("Error playing shutoff sound:", e));
            } else {
                console.warn("Audio not initialized or shutoff sound missing, cannot play sound.");
            }

            // Trigger Visual TV Shutdown Transition
            if (tvShutdownOverlay) {
                void tvShutdownOverlay.offsetWidth; // Force reflow for transition
                tvShutdownOverlay.classList.add('active');
                console.log("TV Shutdown class added.");
            } else {
                console.error("TV Shutdown Overlay element not found!");
            }

            // Navigate After Transition Delay
            const navigationDelay = 350;
            setTimeout(() => {
                console.log("Navigating to homepage.html");
                window.location.href = 'homepage.html';
            }, navigationDelay);
        });
    } else {
        console.warn("Hell button element #hell-button not found.");
    }

    // --- Pokéball Interaction (If Applicable) ---
    if (horrorBallWrapper && horrorBall) {
        horrorBallWrapper.addEventListener('click', () => {
            if (horrorBall) {
                horrorBall.classList.remove('shake');
                void horrorBall.offsetWidth; // Force reflow
                horrorBall.classList.add('shake');
                console.log("Pokeball clicked, shake animation applied.");
            }
        });
     } else {
        console.warn("Pokeball elements not found for click listener.");
     }

    console.log("Interaction listeners added.");

}); // End DOMContentLoaded