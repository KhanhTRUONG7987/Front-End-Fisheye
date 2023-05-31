//Mettre le code JavaScript lié à la page photographer.html

// 1. récupérer l'id du photographe dans la page `photographer.html`
// à partir des parametrès d'Url de la page
import photographerFactory from "../factories/photographer.js";
import {
  getPhotographerById,
  getMediaByPhotographerId,
  getAllMedia,
  getMediaFilePath,
} from "./api.js";
import closeModal from "../utils/contactForm.js";

// get the photographer ID from the query parameter
export function getPhotographerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get("id");
  return photographerId;
}

document.addEventListener("DOMContentLoaded", async function () {
  const photographerId = getPhotographerIdFromUrl();
  const photographerData = await getPhotographerById(photographerId);
  console.log("photographerFromGetById :>> ", photographerData);
  displayPagePhotographer(photographerData);
  document.querySelector(".close-modal").addEventListener("click", closeModal);
});

async function displayPagePhotographer(photographerData) {
  const photographerPageHeader = document.querySelector(".photograph-header");
  const photographerModel = photographerFactory(photographerData);
  console.log("photographerFromfactory :>> ", photographerModel);
  const photographerPageHeaderDOM =
    photographerModel.getPhotographerPageHeaderDOM();
  photographerPageHeader.appendChild(photographerPageHeaderDOM);

  // const photographerMedia = photographerModel.getPhotographerMedia();
  const photographerMediaContainer = document.getElementById(
    "photographer-media"
  );
  console.log("photographerMediaContainer:", photographerMediaContainer);
  const photographerMedia = await getMediaByPhotographerId(
    photographerData.id
  );
  console.log("photographerMedia :>> ", photographerMedia);

  if (photographerMedia && photographerMedia.length > 0) {
    for (const media of photographerMedia) {
      const mediaElement = document.createElement("div");
      mediaElement.className = "lightbox-modal";

      if (media.image) {
        const imageElement = document.createElement("img");
        imageElement.src = await getMediaFilePath(media);
        // imageElement.src = `assets/photographers/${(photographerData.name).replace(' ', '-')}/${media.image}`;
        console.log("imageElement:", imageElement);
        mediaElement.appendChild(imageElement);
      } else if (media.video) {
        const videoElement = document.createElement("video");
        videoElement.src = await getMediaFilePath(media);
        // videoElement.src = `assets/photographers/${(photographerData.name).replace(' ', '-')}/${media.video}`;
        videoElement.alt = media.title;
        videoElement.controls = true;
        console.log("videoElement:", videoElement);
        mediaElement.appendChild(videoElement);
      }

      photographerMediaContainer.appendChild(mediaElement);
      console.log(
        "photographerMediaContainer :>> ",
        photographerMediaContainer
      );
    }
  }
  console.log("media:", photographerMedia);
}

function createCarousel(images) {

}

export { displayPagePhotographer };
