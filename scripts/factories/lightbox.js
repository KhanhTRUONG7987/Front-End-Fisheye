import { getMediaFilePath } from "../pages/api.js";

// Function to open the lightbox
export function openLightbox(mediaId) {
  console.log('mediaId :>> ', mediaId);
  const mediaElements = document.querySelectorAll("#photographer_media .media_element");
  console.log('mediaElements :>> ', mediaElements);
  const clickedMediaIndex = Array.from(mediaElements).findIndex(element => element.dataset.mediaId ===  String(mediaId));
  console.log('clickedMediaIndex :>> ', clickedMediaIndex);

  if (clickedMediaIndex >= 0) {
    const clickedMediaElement = mediaElements[clickedMediaIndex];
    const currentMediaElement = clickedMediaElement.cloneNode(true);

    const lightboxContainer = document.getElementById("lightbox");
    const lightboxContent = lightboxContainer.querySelector(".lightbox-content");

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

// Function to create the lightbox
export function createLightbox({ mediaSources }) {
  // Retrieve necessary data from the provided object
  console.log("mediaSources :>> ", mediaSources);

  // Create lightbox container element
  const lightboxContainer = document.createElement("div");
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
      imgElement.src = getMediaFilePath(source);
      imgElement.alt = source.alt;

      imgElement.addEventListener("click", function () {
        openLightbox(source.id);
      });

      lightboxContent.appendChild(imgElement);
    }
  }

  // Add the open class to show the lightbox
  lightboxContainer.classList.add("open");

  // Variable to keep track of the current image index
  let currentImageIndex = 0;

  // Function to show the previous image in the lightbox
  function showPreviousImage() {
    const images = lightboxContent.querySelectorAll("img");
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    const previousImage = images[currentImageIndex].src;
    openLightbox(previousImage);
  }

  // Function to show the next image in the lightbox
  function showNextImage() {
    const images = lightboxContent.querySelectorAll("img");
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextImage = images[currentImageIndex].src;
    openLightbox(nextImage);
  }

  // Function to close the lightbox
  function closeLightbox() {
    lightboxContainer.classList.remove("open");
    lightboxContainer.querySelector(".lightbox-content").innerHTML = "";
  }

  // Add event listeners to handle closing the lightbox
  lightboxContainer.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  return lightboxContainer;
}