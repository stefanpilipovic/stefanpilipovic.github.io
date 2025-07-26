// --- GLOBAL PRELOADER ---
function showGlobalPreloader() {
  document.body.classList.add('loading');
  document.querySelector('.preloader').classList.remove('hidden');
}
function hideGlobalPreloader() {
  document.body.classList.remove('loading');
  document.querySelector('.preloader').classList.add('hidden');
}

// --- PER-MEDIA LOADER ---
function addMediaLoaderOverlay(media) {
  // Only add if not already present
  if (media.parentElement.querySelector('.media-loader')) return;
  const loader = document.createElement('div');
  loader.className = 'media-loader';
  loader.innerHTML = '<div class="preloader__spinner"></div>';
  loader.style.position = 'absolute';
  loader.style.top = 0;
  loader.style.left = 0;
  loader.style.width = '100%';
  loader.style.height = '100%';
  loader.style.display = 'flex';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.background = 'rgba(255,255,255,0.7)';
  loader.style.zIndex = 2;
  loader.style.pointerEvents = 'none';
  media.parentElement.style.position = 'relative';
  media.parentElement.appendChild(loader);
}
function removeMediaLoaderOverlay(media) {
  const loader = media.parentElement.querySelector('.media-loader');
  if (loader) loader.remove();
}

function waitForMediaLoad(media) {
  return new Promise((resolve) => {
    if (media.tagName === 'IMG') {
      if (media.complete && media.naturalWidth !== 0) {
        resolve();
      } else {
        addMediaLoaderOverlay(media);
        media.addEventListener('load', () => {
          removeMediaLoaderOverlay(media);
          resolve();
        }, { once: true });
        media.addEventListener('error', () => {
          removeMediaLoaderOverlay(media);
          resolve();
        }, { once: true });
      }
    } else if (media.tagName === 'VIDEO') {
      if (media.readyState >= 3) {
        resolve();
      } else {
        addMediaLoaderOverlay(media);
        media.addEventListener('loadeddata', () => {
          removeMediaLoaderOverlay(media);
          resolve();
        }, { once: true });
        media.addEventListener('error', () => {
          removeMediaLoaderOverlay(media);
          resolve();
        }, { once: true });
      }
    } else {
      resolve();
    }
  });
}

// --- HOMEPAGE LOADING ---
async function waitForHomepageMedia() {
  const selector = '.about__image, .work__cover--media, .work__cover--media--left, .work__cover--media--center, .work__cover--media--right, .work__cover img, .work__cover video';
  const mediaEls = Array.from(document.querySelectorAll(selector));
  await Promise.all(mediaEls.map(waitForMediaLoad));
}

// --- MODAL LOADING ---
async function waitForModalMedia(modal) {
  const mediaEls = Array.from(modal.querySelectorAll('img, video'));
  await Promise.all(mediaEls.map(waitForMediaLoad));
}

function showModalLoader(modal) {
  const loader = modal.querySelector('.modal__loading');
  if (loader) loader.classList.add('visible');
}
function hideModalLoader(modal) {
  const loader = modal.querySelector('.modal__loading');
  if (loader) loader.classList.remove('visible');
}

// --- BACKGROUND PRELOADING OF PROJECTS ---
async function preloadAllModalsInOrder() {
  const modals = Array.from(document.querySelectorAll('.modal'));
  for (const modal of modals) {
    await waitForModalMedia(modal);
  }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async function () {
  showGlobalPreloader();
  await waitForHomepageMedia();
  hideGlobalPreloader();
  // Start background preloading of all modals
  preloadAllModalsInOrder();
});

// --- MODAL INTEGRATION ---
// Patch openModal to show loader if needed
window.openModal = (function (origOpenModal) {
  return function (modalElement) {
    showModalLoader(modalElement);
    origOpenModal.call(this, modalElement);
    waitForModalMedia(modalElement).then(() => {
      hideModalLoader(modalElement);
    });
  };
})(window.openModal || function(){});

// Patch closeModal to always hide loader
window.closeModal = (function (origCloseModal) {
  return function () {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(hideModalLoader);
    origCloseModal.call(this);
  };
})(window.closeModal || function(){}); 