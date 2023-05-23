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

