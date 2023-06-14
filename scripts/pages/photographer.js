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

/* ################################################################ */
/* ################################################################ */

// Function to get the photographer ID from the query parameter in the URL
export function getPhotographerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get("id");
  return photographerId || null; // Return null if photographerId is not found
}

/* ################################################################ */
/* ################################################################ */

// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Get the photographer ID from the query parameter
  const photographerId = getPhotographerIdFromUrl();
  // Get the photographer data by ID using the getPhotographerById function
  const photographerData = await getPhotographerById(photographerId);
  console.log("photographerFromGetById :>> ", photographerData);

  // Initialize totalLikes
  let totalLikes = 0;

  // Calculate the total likes for the photographer's media
  totalLikes = await calculateTotalLikesByPhotographerId(photographerData.id);

  // Display the photographer's page using the photographerData
  displayPagePhotographer(photographerData, totalLikes);

  // Add event listener to the close button of the modal
  document.querySelector(".close-modal").addEventListener("click", closeModal);
});

/* ################################################################ */
/* ################################################################ */

// Variables to store image sources, titles, and current image index for the lightbox
let mediaSources = [];
let imageTitles = [];
let currentImageIndex = 0;

let totalLikesElement;

// Update the totalLikesElement with the calculated total likes
async function updateTotalLikes(photographerData) {
  const likes = await calculateTotalLikesByPhotographerId(photographerData.id);
  if (totalLikesElement) {
    const pricePerDay = photographerData.price + "€/jour";
    totalLikesElement.textContent = `${likes} \u2665 ${pricePerDay}`;
    console.log("totalLikesElement :>> ", totalLikesElement);
  } else {
    console.error("Element not found: #total_likes");
  }
}




/* ################################################################ */





// Function to display the photographer's page
async function displayPagePhotographer(photographerData, totalLikes) {
  const photographerModel = photographerFactory(photographerData);

  // Get the DOM element for the photographer's page header
  const photographerPageHeaderDOM =
    photographerModel.getPhotographerPageHeaderDOM(photographerData);

    /* ################################################################ */
    /* ################################################################ */
  
  // Create the "column-left" container for h2 & span
  const columnLeftContainer = document.createElement('div');
  columnLeftContainer.className = 'column-left';

  // Create the "Contactez-moi" heading element
  const contactHeading = document.createElement("h2");
  contactHeading.textContent = "Contactez-moi";

  // Create the photographer's first name element
  const firstNameElement = document.createElement("span");
  firstNameElement.textContent = photographerData.name;

  columnLeftContainer.appendChild(contactHeading);
  columnLeftContainer.appendChild(firstNameElement);

  // Create close button element
  // const closeButton = document.createElement("span");
  // closeButton.textContent = `X`;

  // Get the contact button element
  const formContact = document.querySelector(".modal header");

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

  /* ################################################################ */
  /* ################################################################ */

  // Create the totalLikesElement
  totalLikesElement = document.createElement("div");
  totalLikesElement.id = "total_likes";
  const pricePerDay = photographerData.price + "€/jour";
  totalLikesElement.textContent = `${totalLikes} \u2665 ${pricePerDay}`;
  
  // Assign the totalLikesElement to the photographerModel
  photographerModel.totalLikesElement = totalLikesElement;

  // Get the photographer media container element from the HTML document
  const photographerMediaContainer = document.getElementById("photographer_media");

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
  console.log('totalLikesElement :>> ', totalLikesElement);

  /* ################################################################ */
  /* ################################################################ */

  // Get the media for the photographer by ID using the getMediaByPhotographerId function
  const photographerMedia = await getMediaByPhotographerId(photographerData.id);
  console.log("photographerMedia :>> ", photographerMedia);

  // Call the updateTotalLikes function with the initial number of likes
  if (photographerData.media && photographerData.media.length > 0) {
    updateTotalLikes(photographerData);
  }

  /* ################################################################ */
  /* ################################################################ */
  
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

      /* ################################################################ */
      /* ################################################################ */
      /* ################################################################ */

      const mediaInfo = document.createElement("div");
      mediaInfo.className = "mediaInfo";

      const titleElement = document.createElement("h3");
      titleElement.textContent = media.title;
      imageTitles.push(media.title);

      const likesCountElement = document.createElement("span"); 
      likesCountElement.className = "likes_count";
      likesCountElement.textContent = `${media.likes}`; // Initial likes count

      const likeButton = document.createElement("button");
      likeButton.className = "like_button";
      likeButton.innerHTML = "\u2661"; // Use the heart symbol as the like button

      // Initialize the liked property of each media item to false
      media.liked = false;

      // Add an event listener to each like button to manage the liking
      likeButton.addEventListener("click", () => {
        if (!media.liked) {
          media.likes++;
          media.liked = true;
          likesCountElement.textContent = `${media.likes}`;
          likeButton.textContent = `\u2665`;
          likeButton.disabled = true;
          likeButton.style.opacity = "1";
          likeButton.classList.add("like_button_active"); // Add the class "like_button_active"

          totalLikes++; // Increment totalLikes when a media is liked
          updateTotalLikes(photographerData);
        }
      });

      function updateTotalLikes(photographerData) {
        totalLikesElement.textContent = `${totalLikes} \u2665 ${photographerData.price}€/jour`;
      }

      /* ################################################################ */
      /* ################################################################ */
      /* ################################################################ */

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
      mediaInfo.appendChild(likesCountElement); 

      // Skip updating the likes count in the .mediaInfo span when the like button is active
      if (!likeButton.classList.contains("like_button_active")) {
        mediaInfo.appendChild(likesCountElement);
      }

      mediaInfo.appendChild(likeButton);

      mediaElement.appendChild(mediaInfo);

      photographerMediaContainer.appendChild(mediaElement);
      console.log(
        "photographerMediaContainer :>> ",
        photographerMediaContainer
      );
    }

    /* ################################################################ */
    /* ################################################################ */
    /* ################################################################ */

    // Create the lightbox with the mediaSources
    const lightbox = lightboxFactory(mediaSources);

    // Add click event listener to the media elements to open the lightbox
    const mediaElements = document.querySelectorAll("#photographer_media .media_element");
    mediaElements.forEach((element) => {
      const imageElement = element.querySelector("img");
      const videoElement = element.querySelector("video");
      
      if (imageElement) {
        imageElement.addEventListener("click", () => {
          const mediaId = element.dataset.mediaId;
          lightbox.openLightbox(mediaId, mediaElements);
        });
      } else if (videoElement) {
        videoElement.addEventListener("click", () => {
          const mediaId = element.dataset.mediaId;
          lightbox.openLightbox(mediaId, mediaElements);
        });
      }
    });

    // Find the container element to append the lightbox modal
    const container = document.querySelector("#lightbox-wrapper");

    // Append the returned element to the container
    container.append(lightbox.createLightbox());
  }
  console.log("media:", photographerMedia);
}

/* ################################################################ */

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

/* ################################################################ */

const form = document.querySelector("form");

// Add event listener to the close button of the modal
const closeButton = document.querySelector(".close-modal");
closeButton.addEventListener("click", closeModal);
document.addEventListener("keydown", handleEscapeKey);

function submitForm(event) {
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
}

/* ################################################################ */

// Add event listener to the submit button of the form
const submitButton = document.querySelector(".submit_button");
submitButton.addEventListener("click", submitForm);
document.addEventListener("keydown", handleEnterKey);

// Function to handle the Escape key event
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

// Function to handle the Enter key event
function handleEnterKey(event) {
  if (event.key === "Enter") {
    submitForm(event);
  }
}

/* ################################################################ */

export { displayPagePhotographer };