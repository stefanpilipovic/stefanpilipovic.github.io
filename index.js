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


// Project modals are display:none until opened, so the IntersectionObserver
// above never triggers for the videos inside them - they'd otherwise only
// start loading the moment a visitor opens a project. Once the homepage's
// visible videos have had a chance to load, fetch the modal videos one at a
// time in the background (in page order) so projects are ready by the time
// they're opened.
function backgroundPreloadModalVideos() {
  const queue = Array.from(document.querySelectorAll('.modal video')).filter(function (video) {
      return video.readyState === 0;
  });

  function loadNext() {
      const video = queue.shift();
      if (!video) return;

      function proceed() {
          video.removeEventListener('loadeddata', proceed);
          video.removeEventListener('error', proceed);
          loadNext();
      }

      video.addEventListener('loadeddata', proceed, { once: true });
      video.addEventListener('error', proceed, { once: true });
      video.preload = 'auto';
      video.load();
  }

  loadNext();
}


document.addEventListener('DOMContentLoaded', function () {
  hideVideoControls();
  initSlideshow();
  initLazyVideos();

  window.addEventListener('load', function () {
      if ('requestIdleCallback' in window) {
          requestIdleCallback(backgroundPreloadModalVideos, { timeout: 4000 });
      } else {
          setTimeout(backgroundPreloadModalVideos, 2000);
      }
  });
});
