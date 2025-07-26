function hideVideoControls() {
  // Select videos with autoplay classes
  const workVideos = document.querySelectorAll('.work__project--block--video, .work__project--block--video--slideshow');

  // Apply common attributes to each video
  workVideos.forEach(function (video) {
      video.loop = true;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;

      // Add click event to show controls
      video.onclick = function () {
          this.controls = true;
      };
  });
}


document.addEventListener('DOMContentLoaded', function () {
  hideVideoControls();
  initSlideshow();
});
