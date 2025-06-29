// Variables to store original body state
let scrollPosition = 0;
let bodyPaddingRight = "";
let currentModal = null;
let currentModalContent = null;

// Variables for touch handling
let startY = 0;
let currentY = 0;
let isScrolledToTop = false;

// Function to open modal with animation
function openModal(modalElement) {
  // Set current modal and modal content
  currentModal = modalElement;
  currentModalContent = modalElement.querySelector(".modal__content");
  
  // Save current scroll position
  scrollPosition = window.pageYOffset;
  
  // Save current body padding
  bodyPaddingRight = document.body.style.paddingRight;
  
  // Disable background scrolling
  document.body.classList.add('modal-open');
  
  // Reset scroll position
  if (currentModalContent) {
    currentModalContent.scrollTop = 0;
    
    // Reset scroll position of any browser preview content
    const browserContents = currentModalContent.querySelectorAll('.browser__content');
    browserContents.forEach(function(browserContent) {
      browserContent.scrollTop = 0;
    });
    
    // Reset any slideshows to the first slide
    const slideshows = currentModalContent.querySelectorAll('.slideshow');
    slideshows.forEach(function(slideshow) {
      // Get all slides and thumbnails
      const slides = slideshow.querySelectorAll('.slideshow__slide');
      const thumbnails = slideshow.querySelectorAll('.slideshow__thumbnail');
      
      // Hide all slides except the first one
      slides.forEach(function(slide, index) {
        if (index === 0) {
          slide.style.display = 'block';
        } else {
          slide.style.display = 'none';
        }
      });
      
      // Update thumbnails - remove active class from all and add to first
      thumbnails.forEach(function(thumbnail, index) {
        if (index === 0) {
          thumbnail.classList.add('active');
        } else {
          thumbnail.classList.remove('active');
        }
      });
    });
  }
  currentModal.scrollTop = 0;
  
  // Display the modal
  currentModal.style.display = "block";
  
  // Trigger animation after a small delay to ensure display:block has taken effect
  setTimeout(function() {
    currentModal.classList.add('visible');
  }, 10);
  
  // Add touch event listeners to the current modal
  setupTouchEvents(currentModal);
}

// Function to close modal with animation
function closeModal() {
  if (!currentModal) return;
  
  // Immediately reset scroll positions
  if (currentModalContent) {
    currentModalContent.scrollTop = 0;
    
    // Reset scroll position of any browser preview content
    const browserContents = currentModalContent.querySelectorAll('.browser__content');
    browserContents.forEach(function(browserContent) {
      browserContent.scrollTop = 0;
    });
  }
  currentModal.scrollTop = 0;
  
  // Start closing animation
  currentModal.classList.remove('visible');
  
  // Wait for animation to complete before hiding the modal
  setTimeout(function() {
    currentModal.style.display = "none";
    
    // Re-enable background scrolling
    document.body.classList.remove('modal-open');
    
    // Restore original body padding
    document.body.style.paddingRight = bodyPaddingRight;
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
    
    // Reset modal scroll position again when it's hidden
    currentModal.scrollTop = 0;
    if (currentModalContent) {
      currentModalContent.scrollTop = 0;
      
      // Reset scroll position of any browser preview content again
      const browserContents = currentModalContent.querySelectorAll('.browser__content');
      browserContents.forEach(function(browserContent) {
        browserContent.scrollTop = 0;
      });
    }
    
    // Clear current modal references
    currentModal = null;
    currentModalContent = null;
  }, 400); // Match this with the CSS transition duration
}

// Setup touch events for a modal
function setupTouchEvents(modal) {
  // Touch event handling for mobile pull-down gesture
  modal.addEventListener("touchstart", function(e) {
    startY = e.touches[0].clientY;
    
    // Check if scrolled to top
    isScrolledToTop = modal.scrollTop <= 0;
  }, { passive: true });

  modal.addEventListener("touchmove", function(e) {
    if (!isScrolledToTop) return;
    
    currentY = e.touches[0].clientY;
    let deltaY = currentY - startY;
    
    // If pulling down when already at the top
    if (deltaY > 0) {
      // Prevent default scrolling behavior
      e.preventDefault();
      
      // Apply a resistance factor to make the pull feel natural
      let pullDistance = Math.min(deltaY * 0.5, 150);
      
      // Visually move the modal content down slightly
      currentModalContent.style.transform = `translateY(${pullDistance}px)`;
      
      // Change opacity based on pull distance
      modal.style.backgroundColor = `rgba(0,0,0,${0.4 - (pullDistance / 250)})`;
    }
  }, { passive: false });

  modal.addEventListener("touchend", function() {
    if (!isScrolledToTop) return;
    
    let deltaY = currentY - startY;
    
    // If pulled down far enough, close the modal
    if (deltaY > 100) {
      closeModal();
      return; // Exit early since closeModal will handle everything
    }
    
    // Reset styles if not closing
    if (currentModalContent) {
      currentModalContent.style.transform = "";
    }
    if (currentModal) {
      currentModal.style.backgroundColor = "rgba(0,0,0,0.4)";
    }
    
    // Reset touch tracking variables
    startY = 0;
    currentY = 0;
    isScrolledToTop = false;
  });
}

// Initialize all modals when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Get all modal triggers (elements with class work__cover)
  const modalTriggers = document.querySelectorAll(".work__cover");
  
  // Get all modals (elements with class modal)
  const modals = document.querySelectorAll(".modal");
  
  // Add click event to each modal trigger
  modalTriggers.forEach(function(trigger, index) {
    // Find the corresponding modal (assuming they're in the same order)
    const modal = modals[index];
    
    if (modal) {
      // Add click event to trigger
      trigger.addEventListener("click", function() {
        openModal(modal);
      });
      
      // Add click event to close button in this modal
      const closeButton = modal.querySelector(".modal__close--button");
      if (closeButton) {
        closeButton.addEventListener("click", closeModal);
      }
      
      // Add click event to pull bar in this modal
      const pullBar = modal.querySelector(".modal__pull--bar");
      if (pullBar) {
        pullBar.addEventListener("click", closeModal);
      }
    }
  });
  
  // When the user clicks anywhere outside of the modal content, close it
  window.addEventListener("click", function(event) {
    if (currentModal && event.target === currentModal) {
      closeModal();
    }
  });
});
