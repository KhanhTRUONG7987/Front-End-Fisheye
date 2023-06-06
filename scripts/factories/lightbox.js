// Factory function for creating a photographer object
function lightboxFactory(medias) {
  let mediaSources = [];
  mediaSources = medias;
  // Variable to keep track of the current image index
  let currentImageIndex = 0;
  let lightboxContainer;
  let lightboxContent = document.createElement("div");

  // Function to create the lightbox
  function createLightbox(mediaSources) {
    // Retrieve necessary data from the provided object
    console.log("mediaSources :>> ", mediaSources);

    // Create lightbox container element
    lightboxContainer = document.createElement("div");
    lightboxContainer.id = "lightbox";
    lightboxContainer.className = "lightbox-container";

    // Create lightbox content element
    const lightboxContent = document.createElement("div");
    lightboxContent.className = "lightbox-content";
    lightboxContainer.appendChild(lightboxContent);

    // Create previous button
    const previousButton = document.createElement("button");
    previousButton.setAttribute("role", "link");
    previousButton.textContent = "Previous image";
    previousButton.addEventListener("click", showPreviousImage);
    lightboxContent.appendChild(previousButton);

    // Create next button
    const nextButton = document.createElement("button");
    nextButton.setAttribute("role", "link");
    nextButton.textContent = "Next image";
    nextButton.addEventListener("click", showNextImage);
    lightboxContent.appendChild(nextButton);

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.className = "lightbox-close";
    closeButton.innerHTML = "&#10005;"; // X symbol for close button
    closeButton.addEventListener("click", closeLightbox);
    lightboxContent.appendChild(closeButton);

    // Check if mediaSources is defined and not empty
    if (mediaSources && mediaSources.length > 0) {
      // Iterate through the mediaSources and create DOM elements for each media
      for (const source of mediaSources) {
        const imgElement = document.createElement("img");
        imgElement.src = source.path;
        lightboxContent.appendChild(imgElement);
      }
    }

    // Add event listeners to handle closing the lightbox
    lightboxContainer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });

    return lightboxContainer;
  }

  // Call createLightbox to initialize the lightboxContainer
  createLightbox(mediaSources);

  // Function to show the previous image in the lightbox
  function showPreviousImage() {
    const images = lightboxContainer.querySelectorAll("img");
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    const previousMediaId =
      images[currentImageIndex].parentNode.dataset.mediaId;
    openLightbox(previousMediaId);
  }

  // Function to show the next image in the lightbox
  function showNextImage() {
    const images = lightboxContainer.querySelectorAll("img");
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextMediaId = images[currentImageIndex].parentNode.dataset.mediaId;
    openLightbox(nextMediaId);
  }

  // Function to close the lightbox
  function closeLightbox() {
    lightboxContainer.classList.remove("open");
  }

  // Function to open the lightbox
  function openLightbox(mediaId) {
    console.log("mediaId :>> ", mediaId);
    const mediaElements = document.querySelectorAll(
      "#photographer_media .media_element"
    );
    console.log("mediaElements :>> ", mediaElements);
    const clickedMediaIndex = Array.from(mediaElements).findIndex(
      (element) => element.dataset.mediaId === String(mediaId)
    );
    console.log("clickedMediaIndex :>> ", clickedMediaIndex);

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
