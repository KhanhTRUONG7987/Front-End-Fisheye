import { displayModal, closeModal } from "../utils/contactForm.js";

// Factory function for creating a photographer object
function photographerFactory(data) {
  // Destructure properties from the provided data object
  const { name, portrait, city, country, tagline, price, id, likes } = data;
  // console.log('data :>> ', data);

  // Define the path to the photo of photographer
  const picture = `assets/photographers/PhotographersID/${portrait}`;

  // Function to get the DOM element for the photographer's user card
  function getUserCardDOM() {
    // créer une zone focusable contenant le h2 et l'image:
    // => fonction getUserCardDOM creates an element <a>: contains article (image, h2 & the p(s))

    const link = document.createElement("a");
    link.href = `photographer.html?id=${id}`;
    // ulisiser l'id dans le lien

    const article = document.createElement("article");

    const img = document.createElement("img");
    img.src = picture;
    img.alt = " " + name;

    const h2 = document.createElement("h2");
    h2.textContent = name;
    const p1 = document.createElement("p");
    p1.className = "p1";
    p1.innerHTML = `${city}, ${country}`;
    const p2 = document.createElement("p");
    p2.className = "p2";
    p2.innerHTML = `${tagline}`;
    const p3 = document.createElement("p");
    p3.className = "p3";
    p3.innerHTML = `${price}€/jour`;

    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(p1);
    article.appendChild(p2);
    article.appendChild(p3);

    link.appendChild(article);

    return link;
    // return article;
  }

  // Function to get the DOM element for the photographer's page header
  function getPhotographerPageHeaderDOM() {
    const photographerPageHeaderContainer = document.createElement("div");
    photographerPageHeaderContainer.className = "photograph_header";

    const photographerInfo = document.createElement("article");
    photographerInfo.className = "photographer_info";
    const h2 = document.createElement("h2");
    h2.textContent = name;
    const p1 = document.createElement("p");
    p1.className = "p1";
    p1.innerHTML = `${city}, ${country}`;
    const p2 = document.createElement("p");
    p2.className = "p2";
    p2.innerHTML = `${tagline}`;

    photographerInfo.appendChild(h2);
    photographerInfo.appendChild(p1);
    photographerInfo.appendChild(p2);

    const contactButton = document.createElement("button");
    contactButton.className = "contact_button";
    contactButton.textContent = "Contactez-moi";
    contactButton.addEventListener("click", displayModal);

    const img = document.createElement("img");
    img.src = picture;
    img.alt = " " + name;

    const totalLikesElement = document.createElement("div");
    totalLikesElement.id = "total_likes";
    totalLikesElement.textContent = `${likes} \u2665`;

    photographerPageHeaderContainer.appendChild(photographerInfo);
    photographerPageHeaderContainer.appendChild(contactButton);
    photographerPageHeaderContainer.appendChild(img);
    photographerPageHeaderContainer.appendChild(totalLikesElement);

    return photographerPageHeaderContainer;
  }

  // Return an object with the photographer's properties and functions
  return {
    name,
    picture,
    getUserCardDOM,
    getPhotographerPageHeaderDOM,
    totalLikes: likes,
  };

  // const p = document.createElement("p");
  // p.innerHTML = `<span>${city}, ${country}</span><br/>
  //     <span>${tagline}</span><br/>
  //     <span>${price}€/jour</span>`;

  // const imageUrl = document.getElementsByTagName("img").style.backgroundImage;
  // img.setAttribute("src", picture);
}

// Create a function updateTotalLikes to update the total number of likes in the HTML
export function updateTotalLikes(totalLikes) {
  const totalLikesElement = document.querySelector("#total_likes");
  if (totalLikesElement) {
    totalLikesElement.textContent = `${totalLikes} \u2665`;
    console.log("totalLikesElement :>> ", totalLikesElement);
  } else {
    console.error("Element not found: #total_likes");
  }
}

export default photographerFactory;
