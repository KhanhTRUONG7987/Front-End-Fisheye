import photographerFactory from "../factories/photographer.js";
import { getAllPhotographers } from "./api.js";
export default displayData;

// 1- Ajouter fetch dans la fonction getPhotographers pour récupérer vos datas, et faire un console.log de ces datas
// => import de `api.js``

// 2- Retourner les datas
// 3- Modifier `scripts/factories/Photographer.js` pour récupérer les données nécessaires (id, tagline, city, etc.)

// Functions:

// Function to display the photographers' data
async function displayData(allPhotographers) {
  // Get the photographers section element from the HTML document
  const photographersSection = document.querySelector(".photographer_section");

  // Loop through each photographer in the provided data
  allPhotographers.forEach((photographer) => {
    // Create a photographer model using the photographerFactory function
    const photographerModel = photographerFactory(photographer);
    // Get the DOM element for the photographer's user card
    const userCardDOM = photographerModel.getUserCardDOM();

    // Set accessible roles to the elements
    userCardDOM.setAttribute("role", "listitem");
    
    // Append the user card DOM element to the photographers section
    photographersSection.appendChild(userCardDOM);
  });
}

// Function to initialize the page
async function init() {
  // Récupère les datas des photographes
  const allPhotographers = await getAllPhotographers();
  // Display the fetched photographers' data using the displayData function
  displayData(allPhotographers);
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
