// Factory function for creating a photographer object
function lightboxFactory(medias) {
  let mediaSources = medias;
  let currentImageIndex = 0;
  let lightboxContainer;
  let lightboxContent = document.createElement("div");
  let images = [];

  // Function to create the lightbox
  function createLightbox() {
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
    previousButton.className = "previous";
    previousButton.innerHTML = "&lt;";
    carouselContainer.appendChild(previousButton);

    previousButton.addEventListener("click", showPreviousImage);

    // Create next button
    const nextButton = document.createElement("button");
    nextButton.setAttribute("role", "link");
    nextButton.className = "next";
    nextButton.innerHTML = "&gt;";
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
      mediaSources.forEach((source) => {
        let elementMedia;

        if (source.path.includes(".mp4")) {
          elementMedia = document.createElement("video");
          console.log('elementMedia :>> ', elementMedia);
          elementMedia.autoplay = true;
          elementMedia.controls = true;
        } else {
          elementMedia = document.createElement("img");
        }

        elementMedia.src = source.path;
        elementMedia.className = "lightbox-image";
        // elementMedia.dataset.mediaId = source.id; // Update the dataset attribute to data-media-id

        // TODO: `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`

        // Create title for the image
        const title = document.createElement("div");
        title.className = "image-title";
        title.innerText = source.title; // Set the title text
        console.log('source :>> ', source);
        console.log('title :>> ', title);
        elementMedia.appendChild(title); // Append the title to the image element
        console.log('elementMedia :>> ', elementMedia);

        // TODO: `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`

        // Append a click event listener to the image element
        elementMedia.addEventListener("click", () => {
          openLightbox(source.id, images); // Pass the source ID and images to the openLightbox function
        });

        lightboxContent.appendChild(elementMedia);
        images.push(elementMedia);
      });
    }

    // Add event listener to handle closing the lightbox
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });

    return lightboxContainer;
  }

  // Function to show the previous image in the lightbox
  function showPreviousImage() {
    console.log("showPreviousImage() called");
    currentImageIndex--;
    if (currentImageIndex < 0) {
      currentImageIndex = 0; // Set currentImageIndex to 0 to prevent going below the first media
    }
    updateCurrentImage();
  }

  // Function to show the next image in the lightbox
  function showNextImage() {
    console.log("showNextImage()");
    currentImageIndex++;
    if (currentImageIndex >= images.length) {
      currentImageIndex = images.length - 1; // Set currentImageIndex to the last index to prevent going beyond the last media
    }
    updateCurrentImage();
  }

  // Function to handle arrow key navigation
  function handleKeydown(event) {
    if (event.key === "ArrowLeft") {
      // Handle left arrow key press
      showPreviousImage();
    } else if (event.key === "ArrowRight") {
      // Handle right arrow key press
      showNextImage();
    } else if (event.key === "Enter") {
      // Handle enter key press
      const currentMediaElement = images[currentImageIndex];
      if (currentMediaElement.tagName.toLowerCase() === "video") {
        if (currentMediaElement.paused) {
          currentMediaElement.play();
        } else {
          currentMediaElement.pause();
        }
      }
    } else if (event.key === "f" || event.key === "F") {
      // Handle "F" key press
      const currentMediaElement = images[currentImageIndex];
      if (currentMediaElement.tagName.toLowerCase() === "video") {
        if (currentMediaElement.requestFullscreen) {
          currentMediaElement.requestFullscreen();
        } else if (currentMediaElement.mozRequestFullScreen) {
          currentMediaElement.mozRequestFullScreen();
        } else if (currentMediaElement.webkitRequestFullscreen) {
          currentMediaElement.webkitRequestFullscreen();
        } else if (currentMediaElement.msRequestFullscreen) {
          currentMediaElement.msRequestFullscreen();
        }
      }
    }
  }

  // Function to update the lightbox
  function updateCurrentImage() {
    images.forEach((img, index) => {
      if (index === currentImageIndex) {
        img.style.display = "block";
        img.querySelector(".image-title").style.display = "block";
      } else {
        img.style.display = "none";
        img.querySelector(".image-title").style.display = "none";
      }
    });
  }

  // Function to close the lightbox
  function closeLightbox() {
    lightboxContainer.classList.remove("open");
    // Remove event listeners for arrow key navigation
    document.removeEventListener("keydown", handleKeydown);
  }

  // Function to open the lightbox
  function openLightbox(mediaId, mediaElements) {
    console.log("mediaId :>> ", mediaId);
    console.log("mediaElements :>> ", mediaElements);
    if (!mediaElements || mediaElements.length === 0) {
      console.error("Invalid mediaElements");
      return;
    }

    let currentMediaElement = null;

    // Find the media element with the matching mediaId
    const clickedMediaElement = Array.from(mediaElements).find((element) => {
      return element.dataset.mediaId === mediaId;
    });

    if (clickedMediaElement) {
      console.log("clickedMediaElement 2 :>> ", clickedMediaElement);
      const dataIndex = Array.from(mediaElements).indexOf(clickedMediaElement);
      console.log("dataIndex :>> ", dataIndex);
      currentMediaElement = clickedMediaElement.cloneNode(true);

      // Remove existing content
      while (lightboxContent.firstChild) {
        lightboxContent.removeChild(lightboxContent.firstChild);
      }

      // Add all media elements to the lightbox
      images.forEach((img) => {
        lightboxContent.appendChild(img);
      });

      // Add the current media element to the lightbox
      lightboxContainer.classList.add("open");
      currentImageIndex = dataIndex; // Update the current image index
      console.log("currentImageIndex :>> ", currentImageIndex);

      updateCurrentImage();
    } else {
      console.error("Invalid mediaId");
      return;
    }

    // Add event listener for keydown events
    document.addEventListener("keydown", handleKeydown);
  }

  // Return the necessary functions
  return {
    createLightbox,
    openLightbox,
    closeLightbox,
    showPreviousImage,
    showNextImage,
  };
}

export default lightboxFactory;
