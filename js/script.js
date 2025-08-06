document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-audio');
    const musicToggleButton = document.getElementById('music-toggle-button');
    const musicToggleIcon = musicToggleButton.querySelector('.icon-placeholder');
    const musicToggleSpinner = musicToggleButton.querySelector('.loading-spinner');
    const musicIndicator = document.querySelector('.music-indicator');

    const initialPlayOverlay = document.getElementById('initial-play-overlay');
    const initialPlayButton = document.getElementById('initial-play-button');
    const initialPlayIcon = initialPlayButton.querySelector('.icon-placeholder');
    const initialPlaySpinner = initialPlayButton.querySelector('.loading-spinner');

    const showPhraseButton = document.getElementById('show-phrase-button');
    const romanticPhraseDisplay = document.getElementById('romantic-phrase-display');
    const currentRomanticPhrase = document.getElementById('current-romantic-phrase');

    let isPlaying = false;
    let showPlayButton = false; // Controls visibility of the large initial play button
    let isLoading = false;
    let playPromise = null;
    let phraseTimeoutId = null;

    const romanticPhrases = [
        "Eres la luz que ilumina mis días más oscuros ✨",
        "Te demostraré que si valgo la pena ✨ ",
        "Cada día a tu lado es un regalo del cielo ",
        "Eres un sueño hecho realidad. 💫",
        "No me cansaré de luchar por ti ",
        "Eres la melodía más hermosa de mi corazón ",
        "Contigo el tiempo se detiene y la eternidad comienza ",
        "Eres mi estrella, mi luna, mi universo completo ",
        "Tu existir es lo mas hermoso que tengo ",
        "Eres la respuesta a todas mis oraciones ✨",
        "Contigo vale la pena luchar por todo ",
        "Eres increible ",
        "Se que sera dificil, pero no me rendiré ",
        "Eres la princesa de mi cuento de hadas ",
        "Contigo cada momento es mágico e inolvidable "
    ];

    // --- UI Update Functions ---
    const updateMusicButtonUI = () => {
        if (isLoading) {
            musicToggleIcon.classList.add('hidden');
            musicToggleSpinner.classList.remove('hidden');
            musicToggleButton.disabled = true;
        } else {
            musicToggleIcon.classList.remove('hidden');
            musicToggleSpinner.classList.add('hidden');
            musicToggleButton.disabled = false;
            musicToggleIcon.innerHTML = isPlaying ? '⏸️' : '▶️'; // Pause or Play icon
        }

        if (isPlaying && !isLoading) {
            musicIndicator.classList.remove('hidden');
        } else {
            musicIndicator.classList.add('hidden');
        }
    };

    const updateInitialPlayOverlayUI = () => {
        if (showPlayButton) {
            initialPlayOverlay.classList.remove('hidden');
        } else {
            initialPlayOverlay.classList.add('hidden');
        }

        if (isLoading) {
            initialPlayIcon.classList.add('hidden');
            initialPlaySpinner.classList.remove('hidden');
            initialPlayButton.disabled = true;
        } else {
            initialPlayIcon.classList.remove('hidden');
            initialPlaySpinner.classList.add('hidden');
            initialPlayButton.disabled = false;
            initialPlayIcon.innerHTML = '🔊'; // Volume icon
        }
    };

    // --- Audio Event Handlers ---
    const handlePlay = () => {
        isPlaying = true;
        isLoading = false;
        updateMusicButtonUI();
        updateInitialPlayOverlayUI();
    };

    const handlePause = () => {
        isPlaying = false;
        isLoading = false;
        updateMusicButtonUI();
        updateInitialPlayOverlayUI();
    };

    const handleError = () => {
        isLoading = false;
        showPlayButton = true;
        updateMusicButtonUI();
        updateInitialPlayOverlayUI();
        console.error('Error al reproducir el audio.');
    };

    // --- Audio Control Logic ---
    const toggleMusic = async () => {
        if (isLoading) return;

        isLoading = true;
        updateMusicButtonUI();
        updateInitialPlayOverlayUI();

        try {
            if (isPlaying) {
                if (playPromise) {
                    await playPromise; // Wait for any pending play promise before pausing
                }
                audio.pause();
                playPromise = null;
            } else {
                if (audio.paused) {
                    playPromise = audio.play();
                    await playPromise;
                    showPlayButton = false;
                }
            }
        } catch (error) {
            console.log('Reproducción de audio interrumpida o fallida:', error);
            isLoading = false;
            if (!isPlaying) {
                showPlayButton = true;
            }
            updateMusicButtonUI();
            updateInitialPlayOverlayUI();
        }
    };

    // --- Romantic Phrase Logic ---
    const showRandomPhrase = () => {
        if (phraseTimeoutId) {
            clearTimeout(phraseTimeoutId);
            phraseTimeoutId = null;
        }

        const randomIndex = Math.floor(Math.random() * romanticPhrases.length);
        currentRomanticPhrase.textContent = romanticPhrases[randomIndex];
        romanticPhraseDisplay.classList.remove('hidden');
        romanticPhraseDisplay.classList.add('animate-fade-in');

        phraseTimeoutId = setTimeout(() => {
            romanticPhraseDisplay.classList.add('hidden');
            romanticPhraseDisplay.classList.remove('animate-fade-in');
        }, 7000); // Phrase duration: 7 seconds
    };

    // --- Event Listeners ---
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplaythrough', () => {
        // Try autoplay only when audio is ready
        if (!isPlaying && !showPlayButton) {
            playPromise = audio.play();
            playPromise
                .then(() => {
                    isPlaying = true;
                    updateMusicButtonUI();
                    updateInitialPlayOverlayUI();
                })
                .catch(() => {
                    showPlayButton = true;
                    updateMusicButtonUI();
                    updateInitialPlayOverlayUI();
                });
        }
    });

    musicToggleButton.addEventListener('click', toggleMusic);
    initialPlayButton.addEventListener('click', toggleMusic);
    showPhraseButton.addEventListener('click', showRandomPhrase);

    // Initial UI setup
    updateMusicButtonUI();
    updateInitialPlayOverlayUI();
});
