document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('video-player');
    const player = new Plyr(videoElement, {
        captions: {active: true, update: true, language: 'auto'},
        quality: {default: 2160, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]},
        speed: {selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4]},
        keyboard: {focused: true, global: true}
    });
    const playlist = document.getElementById('playlist');
    const uploadForm = document.getElementById('upload-form');

    function playVideo(videoSrc) {
        videoElement.src = videoSrc;
        player.source = {
            type: 'video',
            sources: [
                {
                    src: videoSrc,
                    type: 'video/mp4',
                },
            ],
        };
        player.play();
    }

    function addToPlaylist(videoName, videoSrc) {
        const li = document.createElement('li');
        li.textContent = videoName;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            playVideo(videoSrc);
        });
        playlist.appendChild(li);
    }

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                refreshPlaylist();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function refreshPlaylist() {
        try {
            const response = await fetch('/videos');
            const videos = await response.json();
            playlist.innerHTML = '';
            videos.forEach(video => {
                addToPlaylist(video, `/uploads/${video}`);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    refreshPlaylist();
});