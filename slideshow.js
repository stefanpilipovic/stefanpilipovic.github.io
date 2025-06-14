   // Function to show a specific slide
   function showSlide(slideshow, index) {
    // Hide all slides
    Array.from(slideshow.slides).forEach(function (slideshow__slide) {
        slideshow__slide.style.display = 'none';
    });

    // Reset all thumbnails
    Array.from(slideshow.thumbnails).forEach(function (thumb) {
        thumb.classList.remove('active');
    });

    // Show the current slide
    if (slideshow.slides[index]) {
        slideshow.slides[index].style.display = 'block';
    }

    // Highlight the current thumbnail
    if (slideshow.thumbnails[index]) {
        slideshow.thumbnails[index].classList.add('active');
    }

    // Update the current index
    slideshow.currentIndex = index;
}


// Function to advance to the next slide
  function nextSlide(slideshow) {
  let nextIndex = slideshow.currentIndex + 1;

  if (nextIndex >= slideshow.slides.length) {
      nextIndex = 0;
  }

  showSlide(slideshow, nextIndex);
}


// Function to start the automatic slideshow
function startSlideshow(slideshow) {
  // Clear any existing interval first
  if (slideshow.interval) {
      clearInterval(slideshow.interval);
  }

  // Set a new interval
  slideshow.interval = setInterval(function () {
      nextSlide(slideshow);
  }, 2000);
}

// Function to set up intersection observer for a slideshow
function setupIntersectionObserver(slideshow) {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              // Start slideshow immediately if it's not already active and doesn't have no-autoplay class
              if (!slideshow.isActive && !slideshow.container.classList.contains('no-autoplay')) {
                  startSlideshow(slideshow);
                  slideshow.isActive = true;
              } else if (!slideshow.isActive && slideshow.container.classList.contains('no-autoplay')) {
                  // For no-autoplay slideshows, just mark as active but don't start autoplay
                  slideshow.isActive = true;
              }
          } else {
              // Stop slideshow when not in view
              if (slideshow.isActive) {
                  clearInterval(slideshow.interval);
                  slideshow.isActive = false;
              }
          }
      });
  }, {
      threshold: 0.3 // Trigger when 30% of the slideshow is visible
  });

// Start observing the slideshow container
  observer.observe(slideshow.container);
}

 // Function to reset the slideshow timer
 function resetSlideshow(slideshow) {
  clearInterval(slideshow.interval);
  startSlideshow(slideshow);
}

function initSlideshow() {
   // Find all slideshow containers
   const slideshowContainers = document.querySelectorAll('.slideshow');

   // Create slideshow objects but don't start them yet
   const slideshows = [];

   slideshowContainers.forEach(function (container, index) {
       // Initialize the slideshow structure
       const slideshow = {
           container: container,
           slides: container.querySelectorAll('.slideshow__slide'),
           thumbnails: container.querySelectorAll('.slideshow__thumbnail'),
           currentIndex: 0,
           interval: null,
           isActive: false
       };

       // Show the first slide
       showSlide(slideshow, 0);

       // Add click event listeners to thumbnails
       Array.from(slideshow.thumbnails).forEach(function (thumbnail, index) {
           thumbnail.addEventListener('click', function () {
               showSlide(slideshow, index);
               // Only reset slideshow timer if it's active and not a no-autoplay slideshow
               if (slideshow.isActive && !slideshow.container.classList.contains('no-autoplay')) {
                   resetSlideshow(slideshow);
               }
           });
       });

       // Add to slideshows array
       slideshows.push(slideshow);

       // Set up intersection observer for this slideshow
       setupIntersectionObserver(slideshow);
   });
}
