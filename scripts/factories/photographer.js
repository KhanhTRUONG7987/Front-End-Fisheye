export default photographerFactory;

function photographerFactory(data) {
  const { name, portrait, city, country, tagline, price } = data;

  const picture = `assets/photographers/PhotographersID/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");

    const img = document.createElement("img");
    img.setAttribute("src", picture);

    const h2 = document.createElement("h2");
    h2.textContent = name;

    const p = document.createElement("p");
    p.innerHTML = `</span>${city}, ${country}</span><br /> 
        <span>${tagline}</span><br />
        <span>${price}€/jour</span>`;

    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(p);

    return article;
  }
  return { name, picture, getUserCardDOM };
}
