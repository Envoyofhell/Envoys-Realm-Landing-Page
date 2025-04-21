// interactions.js - Handles UI interactions, audio playback, and transitions (Original Structure + Fixes)

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
    if (!hellButton || !tvShutdownOverlay || !audioPrompt) {
        console.error("Essential HTML elements missing! (hellButton, tvShutdownOverlay, or audioPrompt)");
        return; // Stop if critical elements aren't found
    }

    // --- State Variables ---
    let audioInitialized = false; // Flag: Has the user interacted to allow audio?
    let isMuted = false;          // Flag: Is the *music* currently muted?
    let isRaveMode = false;       // Flag: Is Rave Mode active?

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
    muteButton.id = 'mute-button'; muteButton.textContent = '🔊'; // Initial icon: not muted
    muteButton.classList.add('audio-button');
    // muteButton.style.position = 'relative'; // Keep if needed by CSS, was in original
    const raveModeButton = document.createElement('button');
    raveModeButton.textContent = '🎉'; // Rave mode toggle icon
    raveModeButton.classList.add('audio-button');

    // Assemble the controls
    volumeContainer.appendChild(volumeSlider);
    audioControlContainer.appendChild(songNameDisplay);
    audioControlContainer.appendChild(volumeContainer); // Add slider container
    audioControlContainer.appendChild(muteButton);
    audioControlContainer.appendChild(raveModeButton);
    // Note: audioControlContainer is appended to the body later in initAudio()

    // --- Audio Utility Functions ---

    /**
     * Updates the song name display based on the currently playing audio element.
     * @param {HTMLAudioElement} audioElement - The audio element whose name should be displayed.
     */
    function updateSongName(audioElement) {
        if (!audioElement || !songNameDisplay) return; // Safety check

        // Attempt to extract and clean up the filename from the src
        try {
            if (!audioElement.src || !audioElement.src.includes('/')) {
                songNameDisplay.textContent = "Loading...";
                // Fallback listeners if src isn't ready immediately
                audioElement.addEventListener('loadedmetadata', () => updateSongName(audioElement), { once: true });
                audioElement.addEventListener('error', () => { songNameDisplay.textContent = "Audio Error"; }, { once: true });
                return;
            }
            const filename = audioElement.src.split('/').pop(); // Get filename.ext
            if (!filename) { songNameDisplay.textContent = "---"; return; }

            const decodedName = decodeURIComponent(filename)
                .replace(/\.(mp3|wav|ogg)$/i, '') // Remove extension
                .replace(/_/g, ' ') // Replace underscores with spaces
                .replace(/-/g, ' - ') // Add spaces around hyphens
                .replace(/ {2,}/g,' ') // Condense multiple spaces
                .replace(/\(.*?\)/g, '') // Remove content in parentheses
                .trim(); // Trim whitespace

            songNameDisplay.textContent = decodedName || "---"; // Display cleaned name or default
        } catch (e) {
            console.error("Error parsing/updating song name:", e);
            songNameDisplay.textContent = "Error";
        }
    }

    /**
     * Sets the volume for all relevant audio elements.
     * @param {number} volumeValue - Volume level from 0 to 100.
     */
    function setVolume(volumeValue) {
        const volume = volumeValue / 100; // Convert 0-100 range to 0.0-1.0
        // Apply volume to music tracks (sound effects might have fixed volume)
        backgroundMusic.volume = volume;
        raveMusic.volume = volume;
        // Optionally apply to sound effects too, or manage separately
        // tvShutoffSound.volume = volume;
        // tvStaticSound.volume = volume;
        console.log("Volume set to:", volumeValue);
    }

    /**
     * Initial setup common to all audio elements (looping, initial volume).
     */
    function setupAudio() {
        // Setup background music looping and initial volume
        backgroundMusic.loop = true;
        raveMusic.loop = true;
        setVolume(volumeSlider.value); // Set initial volume from slider's default value
    }

    // --- Function to Initialize Audio on User Interaction ---
    /**
     * Called once after the first user interaction to enable audio playback
     * and add audio controls to the page.
     */
    function initAudio() {
        if (audioInitialized) return; // Run only once
        audioInitialized = true;
        console.log("Audio Initializing on user interaction...");

        // Remove the "Click to enable" prompt
        if (audioPrompt) {
            audioPrompt.remove();
        } else {
            console.warn("Audio prompt element not found when trying to remove.");
        }

        // Add the dynamically created audio controls to the page
        document.body.appendChild(audioControlContainer);

        // Perform initial audio setup (volume, looping)
        setupAudio();

        // --- Try playing the initial background music ---
        // This play() call is now allowed because it's triggered by user interaction.
        backgroundMusic.play()
            .then(() => {
                console.log("Background music playing started.");
                updateSongName(backgroundMusic); // Update display now that it's playing
            })
            .catch(error => {
                // Handle potential errors during playback attempt
                console.error('Error playing background music after interaction:', error);
                if (songNameDisplay) songNameDisplay.textContent = "Audio Error";
            });
    }

    // --- Autoplay Fix: Require User Interaction ---
    /**
     * Handler for the first user interaction (click, touch, keydown).
     * Calls initAudio() and removes itself.
     */
    function interactionHandler() {
        console.log("User interaction detected, initializing audio.");
        initAudio();
        // No need to manually remove listeners added with { once: true }
    }

    // Add listeners for the *first* interaction. { once: true } automatically removes them after firing.
    // Listen on the document to catch interaction anywhere.
    document.addEventListener('click', interactionHandler, { once: true });
    document.addEventListener('touchstart', interactionHandler, { once: true });
    document.addEventListener('keydown', interactionHandler, { once: true });
    // Fallback: If the audio prompt element itself is clicked (useful if it's styled like a button)
    if (audioPrompt) {
        audioPrompt.addEventListener('click', interactionHandler, { once: true });
    } else {
        // This case should ideally not happen if the prompt element exists in HTML
        console.warn("Audio prompt element not found for specific click listener.");
    }


    // --- Audio Control Interactions ---

    // Volume Slider Interaction
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            setVolume(e.target.value); // Update volume as slider moves
        });
    }

    // --- Mute Button & Volume Slider Visibility (MOBILE FIX) ---
    let isVolumeSliderVisible = false; // State for slider visibility

    // Function to explicitly hide the slider
    function hideVolumeSlider() {
        if (isVolumeSliderVisible && volumeContainer) {
            volumeContainer.style.display = 'none';
            isVolumeSliderVisible = false;
            // console.log("Volume slider hidden."); // Optional log
        }
    }

    if (muteButton) {
        muteButton.addEventListener('click', () => {
            if (!audioInitialized) initAudio(); // Ensure audio is ready

            // 1. Toggle Mute State for MUSIC only
            isMuted = !isMuted;
            backgroundMusic.muted = isMuted;
            raveMusic.muted = isMuted;
            // Update button icon based on mute state
            muteButton.textContent = isMuted ? '🔇' : '🔊';
            console.log("Music Muted:", isMuted);

            // 2. Toggle Volume Slider Visibility
            isVolumeSliderVisible = !isVolumeSliderVisible;
            if (volumeContainer) {
                volumeContainer.style.display = isVolumeSliderVisible ? 'block' : 'none';
                // console.log("Volume slider visible:", isVolumeSliderVisible); // Optional log
            }
        });
    }

    // Add listener to hide volume slider if user clicks/taps outside of it or the mute button
    document.addEventListener('click', (event) => {
        if (isVolumeSliderVisible && // Only act if slider is visible
            muteButton && !muteButton.contains(event.target) && // Click wasn't on mute button
            volumeContainer && !volumeContainer.contains(event.target)) // Click wasn't inside volume container
        {
            hideVolumeSlider();
        }
    });
    // Also hide on touchstart for better mobile responsiveness when tapping away
     document.addEventListener('touchstart', (event) => {
        if (isVolumeSliderVisible &&
            muteButton && !muteButton.contains(event.target) &&
            volumeContainer && !volumeContainer.contains(event.target))
        {
            hideVolumeSlider();
        }
    }, { passive: true }); // Use passive: true as we are not preventing default


    // Rave Mode Button Interaction
    if (raveModeButton) {
        raveModeButton.addEventListener('click', () => {
            if (!audioInitialized) initAudio(); // Ensure audio is ready

            isRaveMode = !isRaveMode; // Toggle the rave mode state
            console.log("Rave Mode Toggled:", isRaveMode);

            // Determine which track should play and which should stop
            let targetMusic = isRaveMode ? raveMusic : backgroundMusic;
            let otherMusic = isRaveMode ? backgroundMusic : raveMusic;

            // Pause the track that *shouldn't* be playing
            otherMusic.pause();

            // Play the target track only if music isn't muted globally
            if (!isMuted) {
                targetMusic.play().catch(e => console.error(`Error playing ${isRaveMode ? 'rave' : 'background'} music:`, e));
            } else {
                // If muted, ensure the target track *would* be playing if unmuted later
                // We might not need to explicitly call play() if muted, depends on desired behavior on unmute.
                // Let's assume we want it to resume if unmuted, so we just don't pause it.
            }

            // Update the displayed song name
            updateSongName(targetMusic);

            // --- Dispatch state change event for the background ---
            // This tells background.js to change visual effects
            document.dispatchEvent(new CustomEvent('background-state-change', {
                detail: { state: isRaveMode ? 'enhanced' : 'normal' }
            }));
        });
    }

    // --- Hell Button Interactions ---
    if (hellButton) {
        // Play static sound on hover (only if audio is initialized)
        hellButton.addEventListener('mouseenter', () => {
            if (audioInitialized && tvStaticSound) {
                tvStaticSound.currentTime = 0; // Rewind
                tvStaticSound.play().catch(e => console.error("Error playing static sound on hover:", e));
            }
        });
        // Pause static sound when mouse leaves
        hellButton.addEventListener('mouseleave', () => { if (tvStaticSound) tvStaticSound.pause(); });

        // Handle click on the Hell Button (transition trigger)
        hellButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link navigation immediately

            // Initialize audio if it hasn't been already (e.g., if button is first interaction)
            if (!audioInitialized) initAudio();

            console.log('Hell Button Clicked - Triggering Transition');

            // Add visual click effect to button
            hellButton.classList.add('clicked');
            setTimeout(() => { hellButton.classList.remove('clicked'); }, 150); // Remove effect after short delay

            // --- Stop other sounds/music ---
            try {
                tvStaticSound.pause(); tvStaticSound.currentTime = 0;
                backgroundMusic.pause();
                raveMusic.pause();
                console.log("Other sounds/music paused for transition.");
            } catch (err) { console.error("Error pausing sounds:", err); }

            // Optional: Could force background to enhanced state here if desired during transition
            // document.dispatchEvent(new CustomEvent('background-state-change', { detail: { state: 'enhanced' } }));

            // --- Play TV Shutoff Sound ---
            if (audioInitialized && tvShutoffSound) {
                console.log("Attempting to play TV Shutoff Sound...");
                tvShutoffSound.currentTime = 0; // Rewind
                tvShutoffSound.play().catch(e => console.error("Error playing shutoff sound:", e));
            } else {
                console.warn("Audio not initialized or shutoff sound missing, cannot play sound.");
            }

            // --- Trigger Visual TV Shutdown Transition ---
            if (tvShutdownOverlay) {
                // Force reflow before adding class to ensure transition plays
                void tvShutdownOverlay.offsetWidth;
                tvShutdownOverlay.classList.add('active');
                console.log("TV Shutdown class added.");
            } else {
                console.error("TV Shutdown Overlay element not found!");
            }

            // --- Navigate After Transition Delay ---
            const navigationDelay = 350; // Delay in milliseconds (adjust to match sound/animation)
            setTimeout(() => {
                console.log("Navigating to homepage.html");
                window.location.href = 'homepage.html'; // Navigate to the target page
            }, navigationDelay);
        });
    } else {
        console.warn("Hell button element #hell-button not found.");
    }

    // --- Pokéball Interaction (If Applicable) ---
    if (horrorBallWrapper && horrorBall) {
        horrorBallWrapper.addEventListener('click', () => {
            // Add shake animation to the ball itself
            if (horrorBall) {
                 // Remove class first to allow re-triggering animation
                horrorBall.classList.remove('shake');
                // Force reflow
                void horrorBall.offsetWidth;
                // Add class to trigger animation
                horrorBall.classList.add('shake');
                console.log("Pokeball clicked, shake animation applied.");
                 // Optional: Remove class after animation duration (if 'infinite' isn't used in CSS)
                // setTimeout(() => horrorBall.classList.remove('shake'), 1000); // Match CSS animation duration
            }

            // Example: Optionally trigger rave mode or another effect
            // if (raveModeButton) raveModeButton.click(); // Simulate click on rave button
        });
    } else {
        console.warn("Pokeball elements not found for click listener.");
    }

    console.log("Interaction listeners added.");

}); // End DOMContentLoaded