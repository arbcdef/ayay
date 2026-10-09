document.addEventListener('DOMContentLoaded', () => {
    // --- NAVIGATION LOGIC ---
    const pageOpening = document.getElementById('page-opening');
    const pageMail = document.getElementById('page-mail');
    const pageHome = document.getElementById('page-home');
    const globalMusicPlayer = document.getElementById('globalMusicPlayer');

    const navigateTo = (fromPage, toPage, onShow) => {
        fromPage.classList.remove('active');
        fromPage.classList.add('hidden');
        
        setTimeout(() => {
            toPage.classList.remove('hidden');
            toPage.classList.add('active');
            if (onShow) onShow();
        }, 500); // Wait for transition
    };

    // 1. OPENING -> MAIL
    const openBtn = document.getElementById('openBtn');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const handleOpen = () => {
        navigateTo(pageOpening, pageMail, () => {
            startTyping();
            // Show and start music on mail page
            globalMusicPlayer.classList.add('show-player');
            if (songItems.length > 0) {
                loadSong(0);
                playSong();
            }
        });
    };
    if (openBtn) openBtn.addEventListener('click', handleOpen);
    if (envelopeContainer) envelopeContainer.addEventListener('click', handleOpen);


    // 2. MAIL -> HOME
    const attachmentBtn = document.getElementById('attachmentBtn');
    if (attachmentBtn) {
        attachmentBtn.addEventListener('click', () => {
            navigateTo(pageMail, pageHome);
        });
    }

    // 3. HOME -> GALLERY
    const galleryBtn = document.getElementById('galleryBtn');
    const pageGallery = document.getElementById('page-gallery');
    
    if (galleryBtn && pageGallery) {
        galleryBtn.addEventListener('click', () => {
            navigateTo(pageHome, pageGallery);
        });
    }

    // 4. GALLERY -> HOME
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            navigateTo(pageGallery, pageHome);
        });
    }

    // --- GALLERY DRAG TO SCROLL LOGIC ---
    const scrapbookContainer = document.querySelector('.scrapbook-container');
    if (scrapbookContainer) {
        let isDown = false;
        let startX;
        let startY;
        let scrollLeft;
        let scrollTop;

        scrapbookContainer.addEventListener('mousedown', (e) => {
            // Prevent dragging if clicking on a polaroid or button so they are still clickable
            if(e.target.closest('.polaroid') || e.target.closest('.back-btn')) return;
            
            isDown = true;
            scrapbookContainer.classList.add('active');
            startX = e.pageX - scrapbookContainer.offsetLeft;
            startY = e.pageY - scrapbookContainer.offsetTop;
            scrollLeft = scrapbookContainer.scrollLeft;
            scrollTop = scrapbookContainer.scrollTop;
        });

        scrapbookContainer.addEventListener('mouseleave', () => {
            isDown = false;
            scrapbookContainer.classList.remove('active');
        });

        scrapbookContainer.addEventListener('mouseup', () => {
            isDown = false;
            scrapbookContainer.classList.remove('active');
        });

        scrapbookContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrapbookContainer.offsetLeft;
            const y = e.pageY - scrapbookContainer.offsetTop;
            const walkX = (x - startX) * 1.5; // Scroll speed modifier
            const walkY = (y - startY) * 1.5;
            scrapbookContainer.scrollLeft = scrollLeft - walkX;
            scrapbookContainer.scrollTop = scrollTop - walkY;
        });
    }

    // --- TYPING EFFECT LOGIC (MAIL PAGE) ---
    const startTyping = () => {
        const hiddenText = document.getElementById('hiddenText');
        const typingText = document.querySelector('.typing-text');
        const cursor = document.querySelector('.cursor');

        if (hiddenText && typingText && typingText.innerHTML === '') {
            const htmlContent = hiddenText.innerHTML.trim();
            let i = 0;
            let isTag = false;
            let text = '';
            
            setTimeout(() => {
                function typeWriter() {
                    if (i < htmlContent.length) {
                        let char = htmlContent.charAt(i);
                        if (char === '<') isTag = true;
                        
                        text += char;
                        if (isTag && char === '>') isTag = false;
                        
                        if (!isTag) typingText.innerHTML = text;
                        
                        i++;
                        setTimeout(typeWriter, isTag ? 0 : 35);
                    } else {
                        if (cursor) cursor.style.animation = 'blink 1s step-end infinite';
                    }
                }
                typeWriter();
            }, 900);
        }
    };

    // --- MUSIC PLAYER LOGIC ---
    const musicToggle = document.getElementById('musicToggle');
    const musicPanel = document.getElementById('musicPanel');
    const audioElement = document.getElementById('audioElement');
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const songItems = document.querySelectorAll('#globalMusicPlayer .song-item');
    
    let currentSongIndex = 0;
    let isPlaying = false;

    if(musicToggle) {
        musicToggle.addEventListener('click', () => {
            musicPanel.classList.toggle('show');
        });
    }

    const loadSong = (index) => {
        songItems.forEach(item => item.classList.remove('active'));
        if (songItems[index]) {
            songItems[index].classList.add('active');
            audioElement.src = songItems[index].getAttribute('data-src');
        }
    };

    const playSong = () => {
        isPlaying = true;
        if(playPauseBtn) playPauseBtn.textContent = '⏸';
        audioElement.play().catch(e => console.log("Menunggu interaksi user untuk play"));
    };

    const pauseSong = () => {
        isPlaying = false;
        if(playPauseBtn) playPauseBtn.textContent = '▶';
        audioElement.pause();
    };

    if(playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) pauseSong();
            else playSong();
        });
    }

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

    if(audioElement) {
        audioElement.addEventListener('ended', () => {
            currentSongIndex = (currentSongIndex + 1) % songItems.length;
            loadSong(currentSongIndex);
            playSong();
        });

        // Progress bar logic
        const seekSlider = document.getElementById('seekSlider');
        const currentTimeEl = document.getElementById('currentTime');
        const durationTimeEl = document.getElementById('durationTime');

        const formatTime = (time) => {
            if (isNaN(time)) return "0:00";
            const min = Math.floor(time / 60);
            const sec = Math.floor(time % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        };

        audioElement.addEventListener('loadedmetadata', () => {
            seekSlider.max = Math.floor(audioElement.duration);
            durationTimeEl.textContent = formatTime(audioElement.duration);
        });

        audioElement.addEventListener('timeupdate', () => {
            seekSlider.value = Math.floor(audioElement.currentTime);
            currentTimeEl.textContent = formatTime(audioElement.currentTime);
        });

        if (seekSlider) {
            seekSlider.addEventListener('input', () => {
                audioElement.currentTime = seekSlider.value;
                currentTimeEl.textContent = formatTime(seekSlider.value);
            });
        }
    }
});
