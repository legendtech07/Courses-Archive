// DOM Elements
const videoIframe = document.getElementById('courseVideo');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const theaterModeBtn = document.getElementById('theaterModeBtn');
const pipBtn = document.getElementById('pipBtn');
const markCompleteBtn = document.getElementById('markCompleteBtn');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const userNameInput = document.getElementById('userName');
const generateCertificateBtn = document.getElementById('generateCertificateBtn');
const certificateContainer = document.getElementById('certificateContainer');
const certificateActions = document.getElementById('certificateActions');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const printBtn = document.getElementById('printBtn');
const confirmationModal = document.getElementById('confirmationModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const certificateSection = document.getElementById('certificateSection');

// State variables
let isCourseCompleted = false;
let progress = 0;
let videoPlayer = null;

// YouTube API
function onYouTubeIframeAPIReady() {
    videoPlayer = new YT.Player('courseVideo', {
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady
        }
    });
}

// Initialize YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTube Player Events
function onPlayerReady(event) {
    console.log('YouTube player ready');
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        startProgressTracking();
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        stopProgressTracking();
        
        if (event.data === YT.PlayerState.ENDED && !isCourseCompleted) {
            completeCourse();
        }
    }
}

// Progress Tracking
let progressInterval = null;

function startProgressTracking() {
    if (progressInterval) clearInterval(progressInterval);
    
    progressInterval = setInterval(() => {
        if (videoPlayer && videoPlayer.getDuration) {
            const currentTime = videoPlayer.getCurrentTime();
            const duration = videoPlayer.getDuration();
            progress = (currentTime / duration) * 100;
            
            if (progress > 95 && !isCourseCompleted) {
                progress = 100;
                completeCourse();
                clearInterval(progressInterval);
            }
            
            updateProgressDisplay();
        }
    }, 1000);
}

function stopProgressTracking() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

function updateProgressDisplay() {
    progressFill.style.width = `${progress}%`;
    progressPercent.textContent = `${Math.min(100, Math.floor(progress))}%`;
}

// Course Completion
function completeCourse() {
    isCourseCompleted = true;
    progress = 100;
    updateProgressDisplay();
    markCompleteBtn.disabled = true;
    markCompleteBtn.innerHTML = '<i class="fas fa-check-circle"></i> Course Completed';
    markCompleteBtn.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
    
    setTimeout(() => {
        showConfirmationModal();
    }, 1000);
}

function showConfirmationModal() {
    confirmationModal.style.display = 'flex';
}

// Video Controls
fullscreenBtn.addEventListener('click', () => {
    const iframe = videoIframe;
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
});

theaterModeBtn.addEventListener('click', () => {
    const container = document.querySelector('.video-container');
    container.classList.toggle('theater-mode');
    
    if (container.classList.contains('theater-mode')) {
        theaterModeBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Theater Mode';
        theaterModeBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
    } else {
        theaterModeBtn.innerHTML = '<i class="fas fa-film"></i> Theater Mode';
        theaterModeBtn.style.background = 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)';
    }
});

pipBtn.addEventListener('click', async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
        await videoIframe.requestPictureInPicture();
    }
});

markCompleteBtn.addEventListener('click', completeCourse);

// Certificate Generation
userNameInput.addEventListener('input', () => {
    generateCertificateBtn.disabled = !userNameInput.value.trim() || !isCourseCompleted;
});

generateCertificateBtn.addEventListener('click', generateCertificate);

function generateCertificate() {
    const userName = userNameInput.value.trim();
    if (!userName || !isCourseCompleted) return;
    
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    certificateContainer.innerHTML = `
        <div class="certificate-content">
            <div class="certificate-logo">
                <img src="logo.png" alt="Legend Tech Logo">
            </div>
            <h1 class="certificate-title">CERTIFICATE OF COMPLETION</h1>
            <p class="certificate-subtitle">This certifies that</p>
            <h2 class="certificate-name">${userName}</h2>
            <p class="certificate-text">has successfully completed the</p>
            <h3 class="certificate-text">Java Programming Masterclass</h3>
            <p class="certificate-text">with distinction and demonstrated exceptional skill in Java programming</p>
            <p class="certificate-date">Awarded on ${currentDate}</p>
            
            <div class="signature-container">
                <p class="signature-title">Authorized Signature</p>
                <div class="signature">Legend Tech</div>
                <p class="signature-title">CEO & Founder</p>
            </div>
        </div>
    `;
    
    certificateContainer.style.display = 'block';
    certificateActions.style.display = 'flex';
    
    // Smooth scroll to certificate
    certificateSection.scrollIntoView({ behavior: 'smooth' });
}

// Certificate Actions
downloadBtn.addEventListener('click', downloadCertificate);
shareBtn.addEventListener('click', shareCertificate);
printBtn.addEventListener('click', printCertificate);

function downloadCertificate() {
    if (!certificateContainer.style.display || certificateContainer.style.display === 'none') {
        alert('Please generate a certificate first!');
        return;
    }
    
    html2canvas(certificateContainer).then(canvas => {
        const link = document.createElement('a');
        link.download = `Java_Certificate_${userNameInput.value.trim()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function shareCertificate() {
    if (!certificateContainer.style.display || certificateContainer.style.display === 'none') {
        alert('Please generate a certificate first!');
        return;
    }
    
    html2canvas(certificateContainer).then(canvas => {
        canvas.toBlob(blob => {
            const file = new File([blob], `Java_Certificate_${userNameInput.value.trim()}.png`, { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'My Java Programming Certificate',
                    text: `I just completed the Java Programming Masterclass from Legend Tech!`
                });
            } else {
                alert('Sharing not supported on this browser. You can download the certificate and share it manually.');
            }
        });
    });
}

function printCertificate() {
    if (!certificateContainer.style.display || certificateContainer.style.display === 'none') {
        alert('Please generate a certificate first!');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Java Certificate - ${userNameInput.value.trim()}</title>
                <style>
                    body { margin: 0; padding: 20px; background: #9d50bb; }
                    .certificate { 
                        background: linear-gradient(135deg, #9d50bb, #6e48aa);
                        padding: 40px;
                        color: white;
                        text-align: center;
                        border-radius: 20px;
                        min-height: 500px;
                    }
                    .certificate-logo img {
                        width: 120px;
                        height: 120px;
                        background: white;
                        border-radius: 50%;
                        padding: 10px;
                    }
                    .certificate-title {
                        font-size: 3.5rem;
                        font-weight: 800;
                        color: #ffd700;
                        margin: 20px 0;
                    }
                    .certificate-name {
                        font-size: 3rem;
                        font-weight: 700;
                        color: #ffd700;
                        margin: 30px 0;
                        text-transform: uppercase;
                    }
                    .signature {
                        font-family: cursive;
                        font-size: 3.5rem;
                        color: #ffd700;
                        margin: 30px 0;
                        transform: rotate(-5deg);
                        display: inline-block;
                    }
                    @media print {
                        body { background: white; }
                        .certificate { 
                            background: purple !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    ${certificateContainer.innerHTML}
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Modal Controls
modalCloseBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === confirmationModal) {
        confirmationModal.style.display = 'none';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgressDisplay();
    
    // Initialize html2canvas library
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    document.head.appendChild(script);
});