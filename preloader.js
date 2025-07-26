// === PRODUCTION PRELOADER ===





// === HOMEPAGE PRELOADER ===

window.addEventListener("load", () => {
    const pagePreloader = document.querySelector("#preloader");
    pagePreloader.classList.add("hidden");
    preloadProjectAssetsSequentially();
});

// === SELECTORS ===
const modalTriggers = document.querySelectorAll("[data-project-id]");
const modals = document.querySelectorAll(".modal");

// === HARDCODED MODALS (already have content in HTML) ===
const hardcodedModals = ["reaqta"]; // Add other hardcoded modal IDs here if needed

// === MODAL CLICK HANDLING ===
modalTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => {
        const id = trigger.getAttribute("data-project-id");
        const modalElement = modals[index]; // Get corresponding modal by index
        const modalContent = modalElement.querySelector(".modal__content");
        const modalLoader = modalContent.querySelector(".modal__loader");

        // Check if content is already available
        const isHardcoded = hardcodedModals.includes(id);
        const isCached = modalCache[id];
        
        // 1. If hardcoded modal, content is already in HTML - no loader needed
        if (isHardcoded) {
            return;
        }

        // 2. If cached modal, insert immediately - no loader needed
        if (isCached) {
            insertModalContent(modalContent, modalCache[id]);
            return;
        }

        // 3. Show loader for content that needs to be fetched
        modalLoader.classList.add("visible");
        modalLoader.classList.remove("hidden");
        
        // Failsafe: Force hide after 10 seconds maximum
        setTimeout(() => {
            modalLoader.classList.remove("visible");
            modalLoader.classList.add("hidden");
        }, 10000);

        // 4. Fetch dynamic modal content
        fetch(`/modals/${id}.html`)
            .then(res => res.text())
            .then(html => {
                modalCache[id] = html;
                insertModalContent(modalContent, html);
                // Hide loader immediately after content insertion, let media load in background
                modalLoader.classList.remove("visible");
                modalLoader.classList.add("hidden");
            })
            .catch(() => {
                modalLoader.classList.remove("visible");
                modalLoader.classList.add("hidden");
            });
    });
});

// === INSERT MODAL CONTENT (for dynamic modals only) ===
function insertModalContent(modalContent, html) {
    modalContent.insertAdjacentHTML("beforeend", html);
}

// === WAIT FOR ALL IMAGES/VIDEOS IN MODAL TO LOAD ===
function waitForMediaLoad(container) {
    const mediaElements = container.querySelectorAll("img, video");

    // If no media elements, resolve immediately
    if (mediaElements.length === 0) {
        return Promise.resolve();
    }

    const promises = Array.from(mediaElements).map(el => {
        return new Promise(resolve => {
            const timeout = setTimeout(resolve, 2000); // Reduced to 2 seconds

            const cleanup = () => {
                clearTimeout(timeout);
                resolve();
            };

            if (el.tagName === "IMG") {
                el.complete ? cleanup() : el.addEventListener("load", cleanup, { once: true });
                el.addEventListener("error", cleanup, { once: true });
            } else if (el.tagName === "VIDEO") {
                el.readyState >= 3 ? cleanup() : el.addEventListener("loadeddata", cleanup, { once: true });
                el.addEventListener("error", cleanup, { once: true });
            } else {
                cleanup();
            }
        });
    });

    return Promise.all(promises);
}

// === OPTIONAL: BACKGROUND PRELOADING OF MODALS ===
const modalCache = {};
const projectOrder = ["renofi", "element451", "aic", "watchtowr", "serena_williams", "exodus"]; // reaqta is hardcoded in HTML

function preloadProjectAssetsSequentially(index = 0) {
    if (index >= projectOrder.length) return;

    const id = projectOrder[index];
    fetch(`/modals/${id}.html`)
        .then(res => res.text())
        .then(html => {
            modalCache[id] = html;
            preloadProjectAssetsSequentially(index + 1);
        })
        .catch(() => preloadProjectAssetsSequentially(index + 1));
}
