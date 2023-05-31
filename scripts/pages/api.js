// Faire des fonctions génériques (api.js?) qui contiennent
// des fonctions de type getAllPhotographers, getPhotographerById
const photographersApi = "../../data/photographers.json";
let allPhotographers = [];

async function getAllPhotographers() {
  try {
    const response = await fetch(photographersApi);
    const data = await response.json();
    allPhotographers = data.photographers;
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

async function getMediaByPhotographerId(id) {
  try {
    const media = await getAllMedia();
    const photographerMedia = media.filter((m) => m.photographerId === id);
    return photographerMedia;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getAllMedia() {
  try {
    const response = await fetch(photographersApi);
    const data = await response.json();
    const allMedia = data.media;
    return allMedia;
  } catch (error) {
    console.error("Failed to load data of media: ", error);
    return [];
  }
}

// get the photographer's name by ID
function getPhotographerNameById(photographerId) {
  const photographerFound = allPhotographers.find(
    (p) => p.id === parseInt(photographerId)
  );
  return photographerFound ? photographerFound.name : null;
}

// construct the file path for the media file
async function getMediaFilePath(media) {
  const photographerName = await getPhotographerNameById(media.photographerId);
  if (!photographerName) {
    return null;
  }
  const firstName = photographerName.split(' ')[0];
  const fileName = media.image || media.video;
  console.log(
    "File path:",
    `assets/photographers/${firstName.replace("-", " ")}/${fileName}`
  );
  return `assets/photographers/${firstName.replace(
    "-",
    " "
  )}/${fileName}`;
}

export {
  getAllPhotographers,
  getAllMedia,
  getPhotographerById,
  getMediaByPhotographerId,
  getPhotographerNameById,
  getMediaFilePath,
};

// p === foundPhotographer
