const loadVideo = (iframe) => {
    const cid = "UC1IpbqPwFXaj4dHuh7uKltw"; // Kanal-ID
    const channelURL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`);
    const reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`;

    fetch(reqURL)
        .then(response => response.json())
        .then(result => {
            if (result.items && result.items.length > 0) {
                const videoNumber = iframe.getAttribute('vnum') || 0; // Standardmäßig das erste Video
                const link = result.items[videoNumber].link;
                const id = link.split('=')[1]; // Extrahiere die Video-ID aus dem Link
                iframe.setAttribute("src", `https://youtube.com/embed/${id}?controls=0&autoplay=1`);
            } else {
                console.error('No videos found in the RSS feed');
                iframe.innerHTML = 'No videos available.';
            }
        })
        .catch(error => {
            console.error('Error fetching video data:', error);
            iframe.innerHTML = 'Failed to load video. Please try again later.';
        });
}

// Lade das neueste Video
document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.getElementsByClassName('latestVideoEmbed');
    for (let i = 0, len = iframes.length; i < len; i++) {
        loadVideo(iframes[i]);
    }
});


        // Funktion zum Anzeigen und Abspielen des Videos
        const jakeButton = document.getElementById('jake-button');
        const videoContainer = document.getElementById('video-container-two');

        // Variable, um zu prüfen, ob der Button gedrückt wurde
        let buttonClicked = false;

        // Funktion, die das Video anzeigt, wenn der Button geklickt wird
        jakeButton.addEventListener('click', function() {
            if (!buttonClicked) {
                buttonClicked = true; // Setze buttonClicked auf true
                videoContainer.style.display = 'block'; // Video anzeigen
            }
        });