import photographerFactory from "../factories/photographer.js";

// 1- Ajouter fetch dans la fonction getPhotographers pour récupérer vos datas, et faire un console.log de ces datas
// 2- Retourner les datas
// 3- Modifier `scripts/factories/Photographer.js` pour récupérer les données nécessaires (id, tagline, city, etc.)

// Functions:

const photographersApi = "../../data/photographers.json";

async function getPhotographers() {
  const response = await fetch(photographersApi);
  const data = await response.json();
  const photographers = data.photographers;
  return photographers;
}
async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");
  photographers.forEach((photographer) => {
    const photographerModel = photographerFactory(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes

  const photographers = await getPhotographers();
  displayData(photographers);
}

init();



// const photographerCard = photographers.map(function (photographer) {
//   return `
//       <article>
//           <a href="${photographer.portrait}"><img src="assets/photographers/PhotographersID/${photographer.portrait}" alt=""></a>
//           <h2>${photographer.name}</h2>
//           <p>${photographer.city}, ${photographer.country}
//           ${photographer.tagline}
//           ${photographer.price}€/jour</p>
//       </article>
//   `;
// });
// photographersSection.innerHTML = photographerCard.join('');