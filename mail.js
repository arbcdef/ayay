document.addEventListener('DOMContentLoaded', () => {
    const attachmentBtn = document.getElementById('attachmentBtn');
    if (attachmentBtn) {
        attachmentBtn.addEventListener('click', () => {
            document.body.classList.add('fade-out');
            
            // Save music state before leaving
            const audioElement = document.getElementById('audioElement');
            if (audioElement) {
                localStorage.setItem('musicCurrentTime', audioElement.currentTime);
                // We check if it's playing based on if it's paused or not
                localStorage.setItem('musicIsPlaying', !audioElement.paused);
                
                // Find current song index
                const activeSong = document.querySelector('.song-item.active');
                if (activeSong) {
                    const songItems = Array.from(document.querySelectorAll('.song-item'));
                    localStorage.setItem('musicCurrentSong', songItems.indexOf(activeSong));
                }
            }

            setTimeout(() => {
                window.location.href = 'home.html';
            }, 400);
        });
    }

    // Typing effect logic
    const hiddenText = document.getElementById('hiddenText');
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');

    if (hiddenText && typingText) {
        const htmlContent = hiddenText.innerHTML.trim();
        let i = 0;
        let isTag = false;
        let text = '';
        
        // Wait for the popup and fade-in animations to finish before typing
        setTimeout(() => {
            function typeWriter() {
                if (i < htmlContent.length) {
                    let char = htmlContent.charAt(i);
                    if (char === '<') isTag = true;
                    
                    text += char;
                    if (isTag && char === '>') isTag = false;
                    
                    if (!isTag) typingText.innerHTML = text;
                    
                    i++;
                    setTimeout(typeWriter, isTag ? 0 : 35); // 35ms per character
                } else {
                    if (cursor) cursor.style.animation = 'blink 1s step-end infinite';
                }
            }
            typeWriter();
        }, 900); // Start typing after 0.9s
    }

    // --- MUSIC PLAYER LOGIC ---
    const musicToggle = document.getElementById('musicToggle');
    const musicPanel = document.getElementById('musicPanel');
    const audioElement = document.getElementById('audioElement');
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const songItems = document.querySelectorAll('.song-item');
    
    let currentSongIndex = 0;
    let isPlaying = false;

    // Menampilkan/menyembunyikan panel musik
    if(musicToggle) {
        musicToggle.addEventListener('click', () => {
            musicPanel.classList.toggle('show');
        });
    }

    // Fungsi untuk memuat lagu
    const loadSong = (index) => {
        songItems.forEach(item => item.classList.remove('active'));
        songItems[index].classList.add('active');
        audioElement.src = songItems[index].getAttribute('data-src');
        if (isPlaying) {
            audioElement.play().catch(e => console.log("Menunggu interaksi user untuk autoplay"));
        }
    };

    const playSong = () => {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
        audioElement.play().catch(e => console.log("Menunggu interaksi user untuk play"));
    };

    const pauseSong = () => {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        audioElement.pause();
    };

    const stopSong = () => {
        pauseSong();
        audioElement.currentTime = 0;
    };

    if(playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) pauseSong();
            else playSong();
        });
    }

    if(stopBtn) stopBtn.addEventListener('click', stopSong);

    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + songItems.length) % songItems.length;
            loadSong(currentSongIndex);
            playSong();
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex + 1) % songItems.length;
            loadSong(currentSongIndex);
            playSong();
        });
    }

    if(songItems.length > 0) {
        songItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
        });
    }

    // Putar lagu berikutnya otomatis saat lagu selesai
    if(audioElement) {
        audioElement.addEventListener('ended', () => {
            currentSongIndex = (currentSongIndex + 1) % songItems.length;
            loadSong(currentSongIndex);
            playSong();
        });
    }

    // Load lagu pertama secara otomatis dan putar
    if (songItems.length > 0) {
        loadSong(0);
        // Coba play secara otomatis
        playSong();
    }
});
