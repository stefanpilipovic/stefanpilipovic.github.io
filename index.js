function hideVideoControls() {
  // Select videos with autoplay classes
  const workVideos = document.querySelectorAll('.work__project--block--video, .work__project--block--video--slideshow');

  // Apply common attributes to each video
  workVideos.forEach(function (video) {
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      // Add click event to show controls
      video.onclick = function () {
          this.controls = true;
      };
  });
}

// Only load/play videos once they're near the viewport, and pause them
// when scrolled away, instead of every video autoplaying/downloading on page load.
function initLazyVideos() {
  const videos = document.querySelectorAll('video');

  const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
          const video = entry.target;
          if (entry.isIntersecting) {
              video.play().catch(function () {});
          } else {
              video.pause();
          }
      });
  }, { threshold: 0.1, rootMargin: '200px 0px' });

  videos.forEach(function (video) {
      observer.observe(video);
  });
}


document.addEventListener('DOMContentLoaded', function () {
  hideVideoControls();
  initSlideshow();
  initLazyVideos();
});
