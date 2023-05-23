// Faire des fonctions génériques (api.js?) qui contiennent
// des fonctions de type getAllPhotographers, getPhotographerById

export { getAllPhotographers, getPhotographerById };

const photographersApi = "../../data/photographers.json";

async function getAllPhotographers() {
  try {
    const response = await fetch(photographersApi);
    const data = await response.json();
    const allPhotographers = data.photographers;
    return allPhotographers;
  } catch (error) {
    console.error("Failed to load data of photographers: ", error);
    return [];
  }
}

async function getPhotographerById(id) {
  try {
    const allPhotographers = await getAllPhotographers();
    const photographer = allPhotographers.find((p) => p.id === parseInt(id));
    if (!photographer) {
      throw new Error(`Photographer not found for id: ${id}`);
    }
    console.log("photographerFromApiJs :>> ", photographer);
    return photographer;
  } catch (error) {
    console.error(error);
    return null; // ...
  }
}

// p === foundPhotographer
