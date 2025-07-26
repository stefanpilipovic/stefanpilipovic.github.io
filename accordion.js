const accordions = document.querySelectorAll(".accordion");

accordions.forEach(accordion => {
  accordion.addEventListener("click", () => {
    const header = accordion.querySelector(".accordion__header");
    const body = accordion.querySelector(".accordion__body");

    // Toggle the active state on the header
    const isActive = header.classList.contains("active");
    header.classList.toggle("active");

    // Toggle open/close
    if (!isActive) {
      body.style.maxHeight = body.scrollHeight + "px";
    } else {
      body.style.maxHeight = 0;
    }
  });
});



// Header only clickable //

// const accordionItemHeaders = document.querySelectorAll(".accordion__header");

// accordionItemHeaders.forEach(accordionItemHeader => {
//    accordionItemHeader.addEventListener("click", event => {
    
//      // Uncomment in case you only want to allow for the display of only one collapsed item at a time!
    
// //     const currentlyActiveAccordionItemHeader = document.querySelector(".accordion-item-header.active");
// //     if(currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader!==accordionItemHeader) {
// //        currentlyActiveAccordionItemHeader.classList.toggle("active");
// //        currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
// //      }

//      accordionItemHeader.classList.toggle("active");
//      const accordionItemBody = accordionItemHeader.nextElementSibling;
//      if(accordionItemHeader.classList.contains("active")) {
//       accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
//      }
//      else {
//        accordionItemBody.style.maxHeight = 0;
//      }
    
//    });
// });
