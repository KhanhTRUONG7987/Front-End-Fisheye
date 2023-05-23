//Mettre le code JavaScript lié à la page photographer.html

// 1. récupérer l'id du photographe dans la page `photographer.html`
// à partir des parametrès d'Url de la page
import photographerFactory from "../factories/photographer.js";
import { getPhotographerById, getAllPhotographers } from "./api.js";
export { displayPagePhotographer };

export function getPhotographerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get("id");
  return photographerId;
}

document.addEventListener("DOMContentLoaded", async function () {
  const photographerId = getPhotographerIdFromUrl();
  const photographer = await getPhotographerById(photographerId);
  console.log("photographerFromGetById :>> ", photographer);
  displayPagePhotographer(photographer);
});

async function displayPagePhotographer(photographer) {
  const photographerPageHeader = document.querySelector(".photograph-header");
  const photographerModel = photographerFactory(photographer);
  console.log("photographerFromfactory :>> ", photographer);
  const userCardDOM = photographerModel.getUserCardDOM();
  photographerPageHeader.appendChild(userCardDOM);
}

// css the elements DOM
const photographerElement = document.createElement("article");
photographerElement.classList.add("img");
photographerPageHeader.appendChild(photographerElement);

// add media
const photographerMedia = media.filter((item) => item.photographerId == id);
const mediaContainer = document.createElement("media-container");
photographerMedia.forEach((item) => {
  const mediaElement = document.createElement("div");

  const imageElement = document.createElement("imgProduct");
  imageElement.src = `assets/photographers/\${photographer}${item.image}`;
  mediaElement.appendChild(imageElement);
  mediaContainer.appendChild(mediaElement);
});
