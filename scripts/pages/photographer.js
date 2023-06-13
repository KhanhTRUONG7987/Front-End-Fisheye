// Mettre le code JavaScript lié à la page photographer.html

// 1. récupérer l'id du photographe dans la page `photographer.html`
// à partir des paramètres d'URL de la page
import lightboxFactory from "../factories/lightbox.js";
import photographerFactory from "../factories/photographer.js";
import {
  getPhotographerById,
  getMediaByPhotographerId,
  getMediaFilePath,
  calculateTotalLikesByPhotographerId,
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
  // Call the updateTotalLikes function
  if (photographerData.media && photographerData.media.length > 0) {
    updateTotalLikes(photographerData);
  }
});

// Variables to store image sources, titles, and current image index for the lightbox
let mediaSources = [];
let imageTitles = [];
let currentImageIndex = 0;

let totalLikesElement;

// Function to display the photographer's page
async function displayPagePhotographer(photographerData) {
  const photographerModel = photographerFactory(photographerData);

  // Get the DOM element for the photographer's page header
  const photographerPageHeaderDOM =
    photographerModel.getPhotographerPageHeaderDOM(photographerData);

  // Create the "Contactez-moi" heading element
  const contactHeading = document.createElement("h2");
  contactHeading.textContent = "Contactez-moi";

  // Create the photographer's first name element
  const firstNameElement = document.createElement("span");
  firstNameElement.textContent = photographerData.name;

  // Create close button element
  // const closeButton = document.createElement("span");
  // closeButton.textContent = `X`;

  // Get the contact button element
  const formContact = document.querySelector("#form_contact");

  // Check if contactButton exists before appending the elements
  if (contactButton) {
    // Append the elements to the contactButton
    formContact.insertAdjacentElement("beforebegin", contactHeading);
    formContact.insertAdjacentElement("beforebegin", firstNameElement);
    // formContact.insertAdjacentElement(
    //   "beforebegin",
    //   closeButton
    // );
  } else {
    console.error("Element not found: button.contact_button");
  }

  // Create the totalLikesElement
  totalLikesElement = document.createElement("div");
  totalLikesElement.id = "total_likes";

  // Get the photographer media container element from the HTML document
  const photographerMediaContainer =
    document.getElementById("photographer_media");

  // Insert the photographer page header before the photographer_media element
  photographerMediaContainer.insertAdjacentElement(
    "beforebegin",
    photographerPageHeaderDOM
  );

  // Insert the totalLikesElement before the photographer_media element
  photographerMediaContainer.insertAdjacentElement(
    "beforebegin",
    totalLikesElement
  );

  // Get the media for the photographer by ID using the getMediaByPhotographerId function
  const photographerMedia = await getMediaByPhotographerId(photographerData.id);
  console.log("photographerMedia :>> ", photographerMedia);

  // Update the totalLikesElement with the calculated total likes
  async function updateTotalLikes(photographerData) {
    const totalLikes = await calculateTotalLikesByPhotographerId(
      photographerData.id
    );
    if (totalLikesElement) {
      const pricePerDay = photographerData.price + "€/jour";
      totalLikesElement.textContent = `${totalLikes} \u2665 ${pricePerDay}`;
      console.log("totalLikesElement :>> ", totalLikesElement);
    } else {
      console.error("Element not found: #total_likes");
    }
  }

  // Call the updateTotalLikes function with the initial number of likes
  if (photographerData.media && photographerData.media.length > 0) {
    updateTotalLikes(photographerData);
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
        if (!media.liked) {
          media.likes++;
          media.liked = true;
          likeButton.textContent = `${media.likes} \u2665`;
          likeButton.disabled = true;
          likeButton.style.opacity = "1";

          updateTotalLikes(photographerData);
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

      // Iterate over the media array and calculate the total likes for each photographer
      const totalLikes = {};

      const photographerId = media.photographerId;
      if (totalLikes[photographerId]) {
        totalLikes[photographerId] += media.likes;
      } else {
        totalLikes[photographerId] = media.likes;
      }
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

const contactButton = document.querySelector(".submit_button");
const modalOverlay = document.createElement("div");
modalOverlay.className = "modal_overlay";
const contactModal = document.querySelector("#contact_modal");
const body = document.querySelector("body");

// Check if contactButton exists before adding the event listener
if (contactButton) {
  contactButton.addEventListener("click", () => {
    contactModal.classList.add("modal-open");
    body.classList.add("modal-open");
  });
} else {
  console.error("Element not found: .contact_button");
}

modalOverlay.addEventListener("click", () => {
  contactModal.classList.remove("modal-open");
  body.classList.remove("modal-open");
});

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  // Prevent form submission
  event.preventDefault();

  // Get the input values
  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Log the user input
  console.log("User Input:");
  console.log("First Name:", firstName);
  console.log("Last Name:", lastName);
  console.log("Email:", email);
  console.log("Message:", message);

  // Reset the form fields
  form.reset();

  // Hide the modal and overlay
  contactModal.classList.remove("modal-open");
  body.classList.remove("modal-open");
});

export { displayPagePhotographer };
