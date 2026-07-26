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
// Shows a skeleton shimmer on each video until it has enough data to render a frame.
function initLazyVideos() {
  const videos = document.querySelectorAll('video');

  videos.forEach(function (video) {
      video.classList.add('video-loading');
      video.addEventListener('loadeddata', function () {
          video.classList.remove('video-loading');
      });
  });

  const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
          const video = entry.target;
          if (entry.isIntersecting) {
              video.play().catch(function () {});
          } else {
              video.pause();
          }
      });
  }, { threshold: 0.1, rootMargin: '600px 0px' });

  videos.forEach(function (video) {
      observer.observe(video);
  });
}


document.addEventListener('DOMContentLoaded', function () {
  hideVideoControls();
  initSlideshow();
  initLazyVideos();
});
