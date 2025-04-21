// interactions.js - Fixed Sound Effect Playback
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for interactions.js v5");

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
    songNameDisplay.textContent = "---";
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
    function updateSongName(audioElement) { /* ... (same as before) ... */ }
    function setVolume(volumeValue) { /* ... (same as before) ... */ }
    function setupAudio() { /* ... (same as before) ... */ }

    // --- Function to Initialize Audio on User Interaction ---
    function initAudio() {
        if (audioInitialized) return;
        audioInitialized = true;
        console.log("Audio Initializing on user interaction...");
        if (audioPrompt) { audioPrompt.remove(); }
        document.body.appendChild(audioControlContainer);
        setupAudio();
        backgroundMusic.play()
            .then(() => { console.log("Background music playing."); updateSongName(backgroundMusic); })
            .catch(error => { console.error('Error playing background music after interaction:', error); if (songNameDisplay) songNameDisplay.textContent = "Audio Error"; });
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
            isMuted = !isMuted; // This now ONLY affects music
            // --- MUTE FIX: Only mute music files ---
            backgroundMusic.muted = isMuted;
            raveMusic.muted = isMuted;
            // --- End MUTE FIX ---
            muteButton.textContent = isMuted ? '🔇' : '🔊';
            console.log("Music Muted:", isMuted);
        });
    }

    if (volumeContainer) {
         volumeContainer.addEventListener('mouseenter', showVolumeSlider);
         volumeContainer.addEventListener('mouseleave', scheduleHideVolumeSlider);
    }

    if (raveModeButton) { /* ... (Rave mode logic remains the same, respects isMuted for music) ... */ }

    // --- Hell Button Interactions ---
    if (hellButton) {
        hellButton.addEventListener('mouseenter', () => {
             // Play static if audio is ready (regardless of music mute state)
             if (audioInitialized) {
                 tvStaticSound.currentTime = 0;
                 // Log errors for hover sound
                 tvStaticSound.play().catch(e => console.error("Error playing static sound on hover:", e));
             }
        });

        hellButton.addEventListener('mouseleave', () => {
            tvStaticSound.pause();
        });

        hellButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (!audioInitialized) initAudio(); // Try init audio if not done

            console.log('Hell Button Clicked - Triggering Transition');

            hellButton.classList.add('clicked');
            setTimeout(() => { hellButton.classList.remove('clicked'); }, 150);

            // Stop other sounds/music
            tvStaticSound.pause();
            backgroundMusic.pause();
            raveMusic.pause();

            document.dispatchEvent(new CustomEvent('background-state-change', { detail: { state: 'enhanced' } }));

            // Play TV shutoff sound (Always play this sound if audio initialized)
            if (audioInitialized) {
                 console.log("Attempting to play TV Shutoff Sound...");
                 tvShutoffSound.currentTime = 0;
                 tvShutoffSound.play().catch(e => console.error("Error playing shutoff sound:", e));
            } else {
                 console.warn("Audio not initialized, cannot play shutoff sound.");
            }


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
