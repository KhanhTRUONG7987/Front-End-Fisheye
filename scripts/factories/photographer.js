export default photographerFactory;

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
    const p1 = document.createElement("p1");
    p1.innerHTML = `${city}, ${country}`;
    const p2 = document.createElement("p2");
    p2.innerHTML = `${tagline}`;
    const p3 = document.createElement("p3");
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
  return { name, picture, getUserCardDOM };
}

// const p = document.createElement("p");
// p.innerHTML = `<span>${city}, ${country}</span><br/>
//     <span>${tagline}</span><br/>
//     <span>${price}€/jour</span>`;

// const imageUrl = document.getElementsByTagName("img").style.backgroundImage;
// img.setAttribute("src", picture);
