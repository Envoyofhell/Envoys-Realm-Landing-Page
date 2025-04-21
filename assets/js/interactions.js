// interactions.js - Fixed Audio Display & Button Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for interactions.js v7");

    // --- Element Selectors ---
    const horrorBallWrapper = document.querySelector('.horror-ball-wrapper');
    const horrorBall = document.querySelector('.horror-ball');
    const hellButton = document.getElementById('hell-button');
    const audioPrompt = document.getElementById('audio-prompt');
    const tvShutdownOverlay = document.getElementById('tv-shutdown-overlay');

    if (!hellButton || !tvShutdownOverlay || !audioPrompt) {
        console.error("Essential HTML elements missing!");
        return;
    }

    // --- State Variables ---
    let audioInitialized = false;
    let isMuted = false; // Mute state specifically for MUSIC
    let isRaveMode = false;

    // --- Audio Management ---
    // IMPORTANT: Ensure paths are correct!
    const backgroundMusic = new Audio('./assets/music/Pokemon RedBlue - Pokemon tower (slowed reverb).mp3');
    const raveMusic = new Audio('./assets/music/Pokemon BlueRed - Bicycle Theme.mp3');
    const tvShutoffSound = new Audio('./assets/sounds/tv-shutoff.mp3');
    const tvStaticSound = new Audio('./assets/sounds/tv-static.mp3');

    // --- Create Audio Controls Dynamically ---
    const audioControlContainer = document.createElement('div');
    audioControlContainer.id = 'audio-control-container';
    const songNameDisplay = document.createElement('div');
    songNameDisplay.id = 'song-name';
    songNameDisplay.textContent = "---"; // Default text
    const volumeContainer = document.createElement('div');
    volumeContainer.id = 'volume-container';
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range'; volumeSlider.min = 0; volumeSlider.max = 100; volumeSlider.value = 25;
    volumeSlider.id = 'volume-slider';
    const muteButton = document.createElement('button');
    muteButton.id = 'mute-button'; muteButton.textContent = '🔊'; muteButton.classList.add('audio-button'); muteButton.style.position = 'relative';
    const raveModeButton = document.createElement('button');
    raveModeButton.textContent = '🎉'; raveModeButton.classList.add('audio-button');
    volumeContainer.appendChild(volumeSlider); audioControlContainer.appendChild(songNameDisplay); audioControlContainer.appendChild(volumeContainer);
    audioControlContainer.appendChild(muteButton); audioControlContainer.appendChild(raveModeButton);
    // Controls are appended later in initAudio

    // --- Audio Utility Functions ---
    function updateSongName(audioElement) {
        // Ensure elements exist
        if (!audioElement || !songNameDisplay) {
             console.warn("Cannot update song name: Audio or display element missing.");
             if(songNameDisplay) songNameDisplay.textContent = "---";
             return;
        }

        // Check if src is valid and seems like a real path
        if (!audioElement.src || !audioElement.src.includes('/') || audioElement.src.endsWith('/')) {
            songNameDisplay.textContent = "Loading...";
            // Add listener as fallback if src isn't ready yet
            audioElement.addEventListener('loadedmetadata', () => updateSongName(audioElement), { once: true });
            audioElement.addEventListener('error', () => { songNameDisplay.textContent = "Audio Error"; }, { once: true }); // Handle loading errors
            console.log("Audio src not ready, waiting for metadata:", audioElement.src);
            return;
        }

        try {
            const filename = audioElement.src.split('/').pop();
            if (!filename) { songNameDisplay.textContent = "---"; return; }

            const decodedName = decodeURIComponent(filename)
                .replace(/\.(mp3|wav|ogg)$/i, '').replace(/_/g, ' ').replace(/-/g, ' - ').replace(/ {2,}/g,' ') // Normalize hyphens/spaces
                .replace(/ \(.*?\)/g, '').trim(); // Remove parentheses content

            songNameDisplay.textContent = decodedName || "---";
            console.log("Updated song name to:", songNameDisplay.textContent);

        } catch (e) {
            console.error("Error parsing/updating song name:", e);
            songNameDisplay.textContent = "Error";
        }
    }

    function setVolume(volumeValue) { /* ... (same as v6) ... */ }
    function setupAudio() { /* ... (same as v6) ... */ }

    // --- Function to Initialize Audio on User Interaction ---
    function initAudio() {
        if (audioInitialized) return;
        audioInitialized = true;
        console.log("Audio Initializing on user interaction...");

        if (audioPrompt) { audioPrompt.remove(); }
        else { console.warn("Audio prompt element not found when trying to remove."); }

        document.body.appendChild(audioControlContainer);
        setupAudio();

        // Try playing the initial background music
        backgroundMusic.play()
            .then(() => {
                console.log("Background music playing promise resolved.");
                // Update name *after* play starts successfully
                updateSongName(backgroundMusic);
            })
            .catch(error => {
                console.error('Error playing background music after interaction:', error);
                if (songNameDisplay) songNameDisplay.textContent = "Audio Error";
            });
    }

    // --- Autoplay Fix: Add one-time listeners ---
    function interactionHandler() { initAudio(); document.removeEventListener('click', interactionHandler); document.removeEventListener('touchstart', interactionHandler); document.removeEventListener('keydown', interactionHandler); }
    if (audioPrompt) { document.addEventListener('click', interactionHandler, { once: true }); document.addEventListener('touchstart', interactionHandler, { once: true }); document.addEventListener('keydown', interactionHandler, { once: true }); }
    else { console.warn("Audio prompt element not found."); setupAudio(); }


    // --- Audio Control Interactions ---
    if (volumeSlider) { volumeSlider.addEventListener('input', (e) => { setVolume(e.target.value); }); }

    let leaveTimeout;
    function showVolumeSlider() { clearTimeout(leaveTimeout); if (volumeContainer) volumeContainer.style.display = 'block'; }
    function hideVolumeSlider() { if (volumeContainer) volumeContainer.style.display = 'none'; }
    function scheduleHideVolumeSlider() { clearTimeout(leaveTimeout); leaveTimeout = setTimeout(() => { if (volumeContainer && muteButton && !volumeContainer.matches(':hover') && !muteButton.matches(':hover')) { hideVolumeSlider(); } }, 1500); }

    if (muteButton) {
        muteButton.addEventListener('mouseenter', showVolumeSlider);
        muteButton.addEventListener('mouseleave', scheduleHideVolumeSlider);
        muteButton.addEventListener('click', () => {
            if (!audioInitialized) initAudio();
            isMuted = !isMuted;
            backgroundMusic.muted = isMuted; // Only mute music
            raveMusic.muted = isMuted;
            muteButton.textContent = isMuted ? '🔇' : '🔊';
            console.log("Music Muted:", isMuted);
        });
    }

    if (volumeContainer) {
         volumeContainer.addEventListener('mouseenter', showVolumeSlider);
         volumeContainer.addEventListener('mouseleave', scheduleHideVolumeSlider);
    }

    if (raveModeButton) {
        raveModeButton.addEventListener('click', () => {
            if (!audioInitialized) initAudio(); // Make sure audio is ready
            isRaveMode = !isRaveMode;
            console.log("Rave Mode Toggled:", isRaveMode);

            // Pause both tracks before starting the correct one
            backgroundMusic.pause();
            raveMusic.pause();

            let targetMusic = isRaveMode ? raveMusic : backgroundMusic;
            let otherMusic = isRaveMode ? backgroundMusic : raveMusic;

            // Play the target music if not muted
            if (!isMuted) {
                 targetMusic.play().catch(e => console.error(`Error playing ${isRaveMode ? 'rave' : 'background'} music:`, e));
            }
            // Always update the song name display
            updateSongName(targetMusic);

            // Dispatch the state change event for the background script
            document.dispatchEvent(new CustomEvent('background-state-change', {
                detail: { state: isRaveMode ? 'enhanced' : 'normal' }
            }));
        });
    }

    // --- Hell Button Interactions ---
    if (hellButton) {
        hellButton.addEventListener('mouseenter', () => {
             if (audioInitialized) {
                 tvStaticSound.currentTime = 0;
                 tvStaticSound.play().catch(e => console.error("Error playing static sound on hover:", e));
             }
        });
        hellButton.addEventListener('mouseleave', () => { tvStaticSound.pause(); });

        hellButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (!audioInitialized) initAudio();

            console.log('Hell Button Clicked - Triggering Transition');

            hellButton.classList.add('clicked');
            setTimeout(() => { hellButton.classList.remove('clicked'); }, 150);

            // Stop ALL other sounds/music first
            try {
                tvStaticSound.pause(); tvStaticSound.currentTime = 0;
                backgroundMusic.pause(); // backgroundMusic.currentTime = 0; // Optional reset
                raveMusic.pause(); // raveMusic.currentTime = 0; // Optional reset
                console.log("Other sounds/music paused for transition.");
            } catch (err) { console.error("Error pausing sounds:", err); }

            document.dispatchEvent(new CustomEvent('background-state-change', { detail: { state: 'enhanced' } })); // Keep if needed

            // Play ONLY TV shutoff sound
            if (audioInitialized) {
                 console.log("Attempting to play TV Shutoff Sound...");
                 tvShutoffSound.currentTime = 0;
                 tvShutoffSound.play().catch(e => console.error("Error playing shutoff sound:", e));
            } else { console.warn("Audio not initialized, cannot play shutoff sound."); }

            // Trigger visual transition
            if (tvShutdownOverlay) {
                 void tvShutdownOverlay.offsetWidth;
                 tvShutdownOverlay.classList.add('active');
                 console.log("TV Shutdown class added.");
            } else { console.error("TV Shutdown Overlay not found!"); }

            // Navigate after transition
            const navigationDelay = 350;
            setTimeout(() => {
                console.log("Navigating to homepage.html");
                window.location.href = 'homepage.html';
            }, navigationDelay);
        });
    } else { console.warn("Hell button element #hell-button not found."); }

    // --- Pokéball Interaction ---
    if (horrorBallWrapper && horrorBall) { /* ... (Pokéball click logic remains the same) ... */ }
    else { console.warn("Pokeball elements not found for click listener."); }

    console.log("Interaction listeners added.");

}); // End DOMContentLoaded
