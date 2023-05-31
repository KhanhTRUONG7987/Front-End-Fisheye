import { displayModal, closeModal } from "../utils/contactForm.js";

function photographerFactory(data) {
  const { name, portrait, city, country, tagline, price, id } = data;
  // console.log('data :>> ', data);
  const picture = `assets/photographers/PhotographersID/${portrait}`;

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
    p1.innerHTML = `${city}, ${country}`;
    const p2 = document.createElement("p");
    p2.innerHTML = `${tagline}`;
    const p3 = document.createElement("p");
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

  function getPhotographerPageHeaderDOM() {
    const photographerPageHeader = document.createElement("div");
    photographerPageHeader.className = "photograph-header";

    const photographerInfo = document.createElement("article");
    photographerInfo.className = "photographer_info";
    const h2 = document.createElement("h2");
    h2.textContent = name;
    const p1 = document.createElement("p");
    p1.innerHTML = `${city}, ${country}`;
    const p2 = document.createElement("p");
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

    photographerPageHeader.appendChild(photographerInfo);
    photographerPageHeader.appendChild(contactButton);
    photographerPageHeader.appendChild(img);

    return photographerPageHeader;
  }

  return {
    name,
    picture,
    getUserCardDOM,
    getPhotographerPageHeaderDOM,
  };

  // const p = document.createElement("p");
  // p.innerHTML = `<span>${city}, ${country}</span><br/>
  //     <span>${tagline}</span><br/>
  //     <span>${price}€/jour</span>`;

  // const imageUrl = document.getElementsByTagName("img").style.backgroundImage;
  // img.setAttribute("src", picture);
}

export default photographerFactory;
