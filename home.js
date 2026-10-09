document.addEventListener('DOMContentLoaded', () => {
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

    songItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
    });

    // Putar lagu berikutnya otomatis saat lagu selesai
    if(audioElement) {
        audioElement.addEventListener('ended', () => {
            currentSongIndex = (currentSongIndex + 1) % songItems.length;
            loadSong(currentSongIndex);
            playSong();
        });
    }

    // Load lagu berdasarkan riwayat dari mail page (agar nyatu)
    const savedTime = localStorage.getItem('musicCurrentTime');
    const savedPlaying = localStorage.getItem('musicIsPlaying');
    const savedSong = localStorage.getItem('musicCurrentSong');
    
    if (savedSong !== null && savedTime !== null) {
        currentSongIndex = parseInt(savedSong, 10);
        loadSong(currentSongIndex);
        audioElement.currentTime = parseFloat(savedTime);
        if (savedPlaying === 'true') {
            playSong();
        }
        
        // Bersihkan localStorage agar tidak tersimpan terus-menerus selamanya
        localStorage.removeItem('musicCurrentTime');
        localStorage.removeItem('musicIsPlaying');
        localStorage.removeItem('musicCurrentSong');
    } else if (songItems.length > 0) {
        // Load lagu pertama secara otomatis jika tidak ada riwayat
        loadSong(0);
    }
});
