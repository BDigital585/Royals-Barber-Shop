// Video loading optimization script for Royals Barber Shop
document.addEventListener('DOMContentLoaded', () => {
  // Create link preload element for the video
  const videoLink = document.createElement('link');
  videoLink.rel = 'preload';
  videoLink.href = '/videos/newset.mp4';
  videoLink.as = 'video';
  videoLink.type = 'video/mp4';
  document.head.appendChild(videoLink);
  
  // Helper function to play video as soon as possible
  function playVideoWhenReady(videoElement) {
    if (videoElement) {
      // First attempt on page load
      videoElement.play().catch(() => {
        // If auto-play is blocked, try again on user interaction
        document.addEventListener('click', () => {
          videoElement.play().catch(() => {});
        }, { once: true });
      });
      
      // Force check on video load status
      videoElement.addEventListener('loadeddata', () => {
        if (videoElement.paused) {
          videoElement.play().catch(() => {});
        }
      });
    }
  }
  
  // Find the hero video and optimize playback
  const findAndEnhanceVideo = () => {
    const videoElement = document.querySelector('video[data-hero-video="true"]');
    if (videoElement) {
      playVideoWhenReady(videoElement);
    } else {
      // If not found yet, try again shortly
      setTimeout(findAndEnhanceVideo, 50);
    }
  };
  
  // Start the process
  findAndEnhanceVideo();
});