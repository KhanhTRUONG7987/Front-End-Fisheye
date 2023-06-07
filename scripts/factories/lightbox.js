// Factory function for creating a photographer object
function lightboxFactory(medias) {
  let mediaSources = medias;
  let currentImageIndex = 0;
  let lightboxContainer;
  let lightboxContent = document.createElement("div");

  // Function to create the lightbox
  function createLightbox(mediaSources) {
    // Retrieve necessary data from the provided object
    // console.log("mediaSources: ", mediaSources);

    // Create lightbox container element
    lightboxContainer = document.createElement("div");
    lightboxContainer.id = "lightbox";
    lightboxContainer.className = "lightbox-container";

    // Create carousel container
    const carouselContainer = document.createElement("div");
    carouselContainer.className = "carousel-container";
    lightboxContainer.appendChild(carouselContainer);

    // Create previous button
    const previousButton = document.createElement("button");
    previousButton.setAttribute("role", "link");
    previousButton.textContent = "Previous image";
    carouselContainer.appendChild(previousButton);

    previousButton.addEventListener("click", showPreviousImage);

    // Create next button
    const nextButton = document.createElement("button");
    nextButton.setAttribute("role", "link");
    nextButton.textContent = "Next image";
    carouselContainer.appendChild(nextButton);

    nextButton.addEventListener("click", showNextImage);

    lightboxContent.className = "lightbox-content";
    carouselContainer.appendChild(lightboxContent);

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.className = "lightbox-close";
    closeButton.innerHTML = "&#10005;";
    closeButton.addEventListener("click", closeLightbox);
    carouselContainer.appendChild(closeButton);

    // Check if mediaSources is defined and not empty
    if (mediaSources && mediaSources.length > 0) {
      // Iterate through the mediaSources and create DOM elements for each media
      for (const source of mediaSources) {
        const imgElement = document.createElement("img");
        imgElement.src = source.path;
        imgElement.className = "lightbox-image";
        lightboxContent.appendChild(imgElement);
      }
    }

    // Add event listener to handle closing the lightbox
    lightboxContainer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });

    return lightboxContainer;
  }

  createLightbox(mediaSources);

  // Function to show the previous image in the lightbox
  function showPreviousImage() {
    console.log("showPreviousImage() called");
    if (currentImageIndex === 0) {
      currentImageIndex = mediaSources.length - 1;
    } else {
      currentImageIndex--;
    }
    updateCurrentImage();
  }

  // Function to show the next image in the lightbox
  function showNextImage() {
    console.log("showNextImage()");
    if (currentImageIndex === mediaSources.length - 1) {
      currentImageIndex = 0;
    } else {
      currentImageIndex++;
    }
    updateCurrentImage();
  }

  // Function to update the lightbox
  function updateCurrentImage() {
    const images = lightboxContent.querySelectorAll(".lightbox-image");
    images.forEach((img, index) => {
      if (index === currentImageIndex) {
        img.removeAttribute("hidden");
      } else {
        img.setAttribute("hidden", "true");
      }
    });
  }

  // Function to close the lightbox
  function closeLightbox() {
    lightboxContainer.classList.remove("open");
  }

  // Function to open the lightbox
  function openLightbox(mediaId) {
    console.log("mediaId: ", mediaId);
    const mediaElements = document.querySelectorAll(
      "#photographer_media .media_element"
    );
    console.log("mediaElements: ", mediaElements);
    const clickedMediaIndex = Array.from(mediaElements).findIndex(
      (element) => element.dataset.mediaId === String(mediaId)
    );
    console.log("clickedMediaIndex: ", clickedMediaIndex);

    if (clickedMediaIndex >= 0) {
      const clickedMediaElement = mediaElements[clickedMediaIndex];
      const currentMediaElement = clickedMediaElement.cloneNode(true);

      // Remove existing content
      while (lightboxContent.firstChild) {
        lightboxContent.removeChild(lightboxContent.firstChild);
      }

      // Add the current media element to the lightbox
      lightboxContent.appendChild(currentMediaElement);
      lightboxContainer.classList.add("open");
      currentImageIndex = 0; // Reset the image index when opening a new lightbox
      updateCurrentImage();
    } else {
      console.error("Invalid mediaId");
      return;
    }
  }

  return {
    createLightbox,
    openLightbox,
    closeLightbox,
    showPreviousImage,
    showNextImage,
  };
}

export default lightboxFactory;