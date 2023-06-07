function lightboxFactory(medias) {
  let mediaSources = medias;
  let currentImageIndex = 0;
  let lightboxContainer;
  let lightboxContent = document.createElement("div");

  function createLightbox() {
    // console.log("mediaSources: ", mediaSources);

    lightboxContainer = document.createElement("div");
    lightboxContainer.id = "lightbox";
    lightboxContainer.className = "lightbox-container";

    const carouselContainer = document.createElement("div");
    carouselContainer.className = "carousel-container";
    lightboxContainer.appendChild(carouselContainer);

    const previousButton = document.createElement("button");
    previousButton.setAttribute("role", "link");
    previousButton.textContent = "Previous image";
    carouselContainer.appendChild(previousButton);

    previousButton.addEventListener("click", showPreviousImage);

    const nextButton = document.createElement("button");
    nextButton.setAttribute("role", "link");
    nextButton.textContent = "Next image";
    carouselContainer.appendChild(nextButton);

    nextButton.addEventListener("click", showNextImage);

    lightboxContent.className = "lightbox-content";
    carouselContainer.appendChild(lightboxContent);

    const closeButton = document.createElement("button");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.className = "lightbox-close";
    closeButton.innerHTML = "&#10005;";
    closeButton.addEventListener("click", closeLightbox);
    carouselContainer.appendChild(closeButton);

    if (mediaSources && mediaSources.length > 0) {
      for (const source of mediaSources) {
        const imgElement = document.createElement("img");
        imgElement.src = source.path;
        imgElement.className = "lightbox-image";
        lightboxContent.appendChild(imgElement);
      }
    }

    lightboxContainer.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });

    return lightboxContainer;
  }

  createLightbox(mediaSources);

  function showPreviousImage() {
    console.log("showPreviousImage() called");
    if (currentImageIndex === 0) {
      currentImageIndex = mediaSources.length - 1;
    } else {
      currentImageIndex--;
    }
    updateCurrentImage();
  }

  function showNextImage() {
    console.log("showNextImage()");
    if (currentImageIndex === mediaSources.length - 1) {
      currentImageIndex = 0;
    } else {
      currentImageIndex++;
    }
    updateCurrentImage();
  }

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

  function closeLightbox() {
    lightboxContainer.classList.remove("open");
  }

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

      while (lightboxContent.firstChild) {
        lightboxContent.removeChild(lightboxContent.firstChild);
      }

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