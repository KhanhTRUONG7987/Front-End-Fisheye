// Mettre le code JavaScript lié à la page photographer.html

// 1. récupérer l'id du photographe dans la page `photographer.html`
// à partir des paramètres d'URL de la page
import { openLightbox, createLightbox } from "../factories/lightbox.js";
import photographerFactory from "../factories/photographer.js";
import {
  getPhotographerById,
  getMediaByPhotographerId,
  getMediaFilePath,
} from "./api.js";
import closeModal from "../utils/contactForm.js";

// Function to get the photographer ID from the query parameter in the URL
export function getPhotographerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get("id");
  return photographerId;
}

// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Get the photographer ID from the query parameter
  const photographerId = getPhotographerIdFromUrl();
  // Get the photographer data by ID using the getPhotographerById function
  const photographerData = await getPhotographerById(photographerId);
  console.log("photographerFromGetById :>> ", photographerData);
  // Display the photographer's page using the photographerData
  displayPagePhotographer(photographerData);
  // Add event listener to the close button of the modal
  document.querySelector(".close-modal").addEventListener("click", closeModal);
});

// Variables to store image sources, titles, and current image index for the lightbox
let mediaSources = [];
let imageTitles = [];
let currentImageIndex = 0;

// Function to display the photographer's page
async function displayPagePhotographer(photographerData) {
  const photographerModel = photographerFactory(photographerData);
  // Get the DOM element for the photographer's page header
  const photographerPageHeaderDOM =
    photographerModel.getPhotographerPageHeaderDOM();
  const mainElement = document.querySelector("main");
  // Get the photographer media container element from the HTML document
  const photographerMediaContainer =
    document.getElementById("photographer_media");
  console.log("photographerMediaContainer:", photographerMediaContainer);

  // Insert the photographer page header DOM element before the photographer_media element
  mainElement.insertBefore(
    photographerPageHeaderDOM,
    photographerMediaContainer
  );

  // Get the media for the photographer by ID using the getMediaByPhotographerId function
  const photographerMedia = await getMediaByPhotographerId(photographerData.id);
  console.log("photographerMedia :>> ", photographerMedia);

  if (photographerMedia && photographerMedia.length > 0) {
    // Call the createLightbox function and pass the mediaSources as an object property
    const lightbox = createLightbox({ mediaSources });
    console.log("lightbox :>> ", lightbox);
    // Find the container element where you want to append the lightbox modal
    const container = document.querySelector("#lightbox");
    console.log(container);
    // Append the returned element to the container
    container.append(lightbox);

    // Loop through each media item
    for (const media of photographerMedia) {
      //photographerMedia = data.media (in json file)

      const mediaElement = document.createElement("div");
      mediaElement.className = "media_element";

      // Add media ID as a data attribute
      mediaElement.dataset.mediaId = media.id;

      const mediaInfo = document.createElement("div");
      mediaInfo.className = "mediaInfo";

      const titleElement = document.createElement("h3");
      titleElement.textContent = media.title;
      imageTitles.push(media.title);
      const likesElement = document.createElement("div");
      likesElement.className = "likesDiv";
      likesElement.textContent = `${media.likes} \u2665`;

      // Get the file path for the media using the getMediaFilePath function
      const filePath = await getMediaFilePath(media);
      mediaSources.push(filePath);

      // Add click event listener to the media element to open the lightbox
      mediaElement.addEventListener("click", () => openLightbox(media.id));

      if (media.image) {
        const imageElement = document.createElement("img");
        imageElement.src = await getMediaFilePath(media);

        mediaElement.appendChild(imageElement);
      } else if (media.video) {
        const videoElement = document.createElement("video");
        videoElement.src = await getMediaFilePath(media);
        videoElement.alt = media.title;
        videoElement.controls = true;
        console.log("videoElement:", videoElement);

        mediaElement.appendChild(videoElement);
      }

      mediaInfo.appendChild(titleElement);
      mediaInfo.appendChild(likesElement);

      mediaElement.appendChild(mediaInfo);

      photographerMediaContainer.appendChild(mediaElement);
      console.log(
        "photographerMediaContainer :>> ",
        photographerMediaContainer
      );
    }
  }
  console.log("media:", photographerMedia);
}

const contactButton = document.querySelector(".contact_button");
const modalOverlay = document.createElement("div");
modalOverlay.className = "modal_overlay";
const contactModal = document.querySelector("#contact_modal");
const body = document.querySelector("body");

contactButton.addEventListener("click", () => {
  contactModal.classList.add("modal-open");
  body.classList.add("modal-open");
});

modalOverlay.addEventListener("click", () => {
  contactModal.classList.remove("modal-open");
  body.classList.remove("modal-open");
});

export { displayPagePhotographer };
