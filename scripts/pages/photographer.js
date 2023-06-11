// Mettre le code JavaScript lié à la page photographer.html

// 1. récupérer l'id du photographe dans la page `photographer.html`
// à partir des paramètres d'URL de la page
import lightboxFactory from "../factories/lightbox.js";
import photographerFactory from "../factories/photographer.js";
import { updateTotalLikes } from "../factories/photographer.js";
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
    photographerModel.getPhotographerPageHeaderDOM(photographerData);
  updateTotalLikes(photographerData.totalLikes);
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

  // Update the totalLikes property in the photographerData object
  photographerData.totalLikes = photographerData.likes;

  // Update the total likes and price per day in the #total_likes element
  const totalLikesElement = document.getElementById("total_likes");
  if (totalLikesElement) {
    const pricePerDay = photographerData.price + "€/jour";
    totalLikesElement.innerHTML = `${photographerData.totalLikes} \u2665 ${pricePerDay}`;
  } else {
    console.error("Element not found: #total_likes");
  }

  if (photographerMedia && photographerMedia.length > 0) {
    // Loop through each media item
    for (let i = 0; i < photographerMedia.length; i++) {
      const media = photographerMedia[i];

      const mediaElement = document.createElement("div");
      mediaElement.className = "media_element";

      // Set media index as a data attribute
      mediaElement.dataset.mediaIndex = i;

      // Add media ID as a data attribute
      mediaElement.setAttribute("data-media-id", media.id);

      const mediaInfo = document.createElement("div");
      mediaInfo.className = "mediaInfo";

      const titleElement = document.createElement("h3");
      titleElement.textContent = media.title;
      imageTitles.push(media.title);

      // Add a "like" button/ icon to each media element
      const likeButton = document.createElement("button");
      likeButton.className = "like_button";
      likeButton.innerHTML = "&#x2661;"; // Use the heart symbol as the like button
      mediaElement.appendChild(likeButton);

      // Initialize the liked property of each media item to false
      media.liked = false;

      // Add an event listener to each like button to manage the liking
      likeButton.addEventListener("click", () => {
        // Check if the user has already liked the photo
        if (!media.liked) {
          media.likes++; // Increment the likes count
          media.liked = true; // Set the liked flag to true
          likeButton.textContent = `${media.likes} \u2665`; // Update the likes display

          // Disable the like button to prevent multiple likes
          likeButton.disabled = true;
          likeButton.style.opacity = "1";

          // Update the total number of likes in the photographerFactory
          photographerData.totalLikes++;
          updateTotalLikes(photographerData.totalLikes);
        }
      });

      // Get the file path for the media using the getMediaFilePath function
      const filePath = await getMediaFilePath(media);
      mediaSources.push({
        mediaIndex: i, // (index of the media element)
        path: filePath,
      });

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
      mediaInfo.appendChild(likeButton);

      mediaElement.appendChild(mediaInfo);

      photographerMediaContainer.appendChild(mediaElement);
      console.log(
        "photographerMediaContainer :>> ",
        photographerMediaContainer
      );
    }

    // Create the lightbox with the mediaSources
    const lightbox = lightboxFactory(mediaSources);

    // Add click event listener to the media elements to open the lightbox
    const mediaElements = document.querySelectorAll(
      "#photographer_media .media_element"
    );
    mediaElements.forEach((element) => {
      element.addEventListener("click", () => {
        const mediaId = element.dataset.mediaId; // (Get the mediaId from the clicked element)
        lightbox.openLightbox(mediaId, mediaElements);
      });
    });

    // Find the container element to append the lightbox modal
    const container = document.querySelector("#lightbox-wrapper");

    // Append the returned element to the container
    container.append(lightbox.createLightbox());
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
