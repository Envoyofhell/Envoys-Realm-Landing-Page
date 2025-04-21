document.addEventListener('DOMContentLoaded', () => {
    const horrorBallWrapper = document.querySelector('.horror-ball-wrapper');
    const horrorBall = document.querySelector('.horror-ball');
    const hellButton = document.getElementById('hell-button');

    // Audio Management
    const backgroundMusic = new Audio('assets/music/Pokemon RedBlue - Pokemon tower (slowed  reverb).mp3');
    const raveMusic = new Audio('assets/music/Pokemon BlueRed - Bicycle Theme.mp3');
    const tvShutoffSound = new Audio('assets/sounds/tv-shutoff.mp3');
    const tvStaticSound = new Audio('assets/sounds/tv-static.mp3');

    // Audio Control Container
    const audioControlContainer = document.createElement('div');
    audioControlContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
    `;

    // Song Name Display
    const songNameDisplay = document.createElement('div');
    songNameDisplay.id = 'song-name';
    songNameDisplay.style.cssText = `
        color: white;
        font-size: 14px;
        margin-right: 10px;
    `;

    // Volume Slider Container
    const volumeContainer = document.createElement('div');
    volumeContainer.style.cssText = `
        position: relative;
        display: none;
    `;

    // Volume Slider
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = 0;
    volumeSlider.max = 100;
    volumeSlider.value = 50;
    volumeSlider.style.cssText = `
        width: 100px;
        transform: rotate(-90deg);
        position: absolute;
        bottom: 40px;
        right: -30px;
        background: rgba(255,255,255,0.3);
    `;

    // Mute Button
    const muteButton = document.createElement('button');
    muteButton.textContent = '🔊';
    muteButton.style.cssText = `
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        position: relative;
    `;

    // Rave Mode Button
    const raveModeButton = document.createElement('button');
    raveModeButton.textContent = '🎉';
    raveModeButton.style.cssText = `
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
    `;

    // Append Elements
    volumeContainer.appendChild(volumeSlider);
    audioControlContainer.appendChild(songNameDisplay);
    audioControlContainer.appendChild(volumeContainer);
    audioControlContainer.appendChild(muteButton);
    audioControlContainer.appendChild(raveModeButton);
    document.body.appendChild(audioControlContainer);

    // Utility Functions
    function updateSongName(filename) {
        const decodedName = decodeURIComponent(filename)
            .replace(/\.(mp3|wav|ogg)$/, '')
            .replace(/\s*-\s*/g, ' - ');
        songNameDisplay.textContent = decodedName;
    }

    function setVolume(volume) {
        const normalizedVolume = volume / 100;
        backgroundMusic.volume = normalizedVolume;
        raveMusic.volume = normalizedVolume;
        tvStaticSound.volume = normalizedVolume * 0.1;
    }

    // Initial Audio Setup
    backgroundMusic.loop = true;
    raveMusic.loop = true;
    tvStaticSound.loop = true;
    setVolume(50);

    // Volume Slider Interaction
    volumeSlider.addEventListener('input', (e) => {
        setVolume(e.target.value);
    });

    // Mute Button Hover Effects
    muteButton.addEventListener('mouseenter', () => {
        volumeContainer.style.display = 'block';
    });

    muteButton.addEventListener('mouseleave', () => {
        setTimeout(() => {
            volumeContainer.style.display = 'none';
        }, 500);
    });

    // Mute Toggle
    let isMuted = false;
    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        backgroundMusic.muted = isMuted;
        raveMusic.muted = isMuted;
        muteButton.textContent = isMuted ? '🔇' : '🔊';
    });

    // Rave Mode Toggle
    let isRaveMode = false;
    raveModeButton.addEventListener('click', () => {
        isRaveMode = !isRaveMode;
        
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        raveMusic.pause();
        raveMusic.currentTime = 0;

        if (isRaveMode) {
            raveMusic.play();
            updateSongName(raveMusic.src.split('/').pop());
            document.dispatchEvent(new CustomEvent('background-state-change', {
                detail: { state: 'enhanced' }
            }));
        } else {
            backgroundMusic.play();
            updateSongName(backgroundMusic.src.split('/').pop());
            document.dispatchEvent(new CustomEvent('background-state-change', {
                detail: { state: 'normal' }
            }));
        }
    });

    // Start Background Music
    backgroundMusic.play()
        .then(() => {
            updateSongName(backgroundMusic.src.split('/').pop());
        })
        .catch(error => {
            console.error('Error playing background music:', error);
        });

    // TV Shutdown Overlay
    const tvShutdownOverlay = document.createElement('div');
    tvShutdownOverlay.id = 'tv-shutdown';
    tvShutdownOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: none;
        pointer-events: none;
    `;

    // Top and Bottom Closing Lines
    const topLine = document.createElement('div');
    topLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 0;
        background: white;
        transition: height 0.3s ease;
    `;

    const bottomLine = document.createElement('div');
    bottomLine.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0;
        background: white;
        transition: height 0.3s ease;
    `;

    tvShutdownOverlay.appendChild(topLine);
    tvShutdownOverlay.appendChild(bottomLine);
    document.body.appendChild(tvShutdownOverlay);

    // Hell Button Interactions
    if (hellButton) {
        hellButton.addEventListener('mouseenter', () => {
            tvStaticSound.play();
        });

        hellButton.addEventListener('mouseleave', () => {
            tvStaticSound.pause();
            tvStaticSound.currentTime = 0;
        });

        hellButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            hellButton.classList.add('clicked');
            setTimeout(() => {
                hellButton.classList.remove('clicked');
            }, 150);

            tvStaticSound.pause();
            tvStaticSound.currentTime = 0;

            document.dispatchEvent(new CustomEvent('background-state-change', {
                detail: { state: 'enhanced' }
            }));

            backgroundMusic.pause();
            raveMusic.play();
            updateSongName(raveMusic.src.split('/').pop());

            tvShutdownOverlay.style.display = 'block';
            tvShutoffSound.play();

            topLine.style.height = '50%';
            bottomLine.style.height = '50%';
            
            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 500);
        });
    }

    // Pokéball Interaction
    if (horrorBallWrapper && horrorBall) {
        horrorBallWrapper.addEventListener('click', () => {
            if (horrorBall.style.animationName === 'pokeball-shake') return;
            
            const defaultAnimation = 'wobble 3s infinite both';
            horrorBall.style.animation = 'pokeball-shake 1.5s ease-in-out';
            
            setTimeout(() => {
                if (horrorBall.style.animationName === 'pokeball-shake') {
                    horrorBall.style.animation = defaultAnimation;
                }
            }, 1500);
        });
    }
});