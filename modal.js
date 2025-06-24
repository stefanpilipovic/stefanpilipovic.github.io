// Get the modal
var modal = document.getElementById("Modal");

// Get the button that opens the modal
var btn = document.getElementById("openModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the pull bar element
var pullBar = document.querySelector(".modal__pull--bar");

// Get the round close button
var roundCloseBtn = document.querySelector(".modal__close--button");

// Variables for touch handling
let startY = 0;
let currentY = 0;
let isScrolledToTop = false;
let modalContent = document.querySelector(".modal__content");

// Variables to store original body state
let scrollPosition = 0;
let bodyPaddingRight = "";

// Function to open modal with animation
function openModal() {
  // Save current scroll position
  scrollPosition = window.pageYOffset;
  
  // Save current body padding
  bodyPaddingRight = document.body.style.paddingRight;
  
  // Disable background scrolling
  document.body.classList.add('modal-open');
  
  // Display the modal
  modal.style.display = "block";
  
  // Trigger animation after a small delay to ensure display:block has taken effect
  setTimeout(function() {
    modal.classList.add('visible');
  }, 10);
}

// Function to close modal with animation
function closeModal() {
  // Start closing animation
  modal.classList.remove('visible');
  
  // Wait for animation to complete before hiding the modal
  setTimeout(function() {
    modal.style.display = "none";
    
    // Re-enable background scrolling
    document.body.classList.remove('modal-open');
    
    // Restore original body padding
    document.body.style.paddingRight = bodyPaddingRight;
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  }, 400); // Match this with the CSS transition duration
}

// When the user clicks on the button, open the modal
btn.onclick = function() {
  openModal();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}

// Close modal when clicking on the pull bar (desktop)
pullBar.addEventListener("click", function() {
  closeModal();
});

// Close modal when clicking on the round close button
roundCloseBtn.addEventListener("click", function() {
  closeModal();
});

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
    modalContent.style.transform = `translateY(${pullDistance}px)`;
    
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
  }

});
