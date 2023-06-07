// Faire des fonctions génériques (api.js?) qui contiennent
// des fonctions de type getAllPhotographers, getPhotographerById

// Path to the photographers data file
const photographersApi = "../../data/photographers.json";

// Variable to store the fetched photographers data
let allPhotographers = [];

// Function to fetch all photographers' data
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

// Function to get a photographer by their ID
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

// ################################################################################################

// Function to get media (photos or videos) associated with a photographer by their ID
async function getMediaByPhotographerId(id) {
  try {
    const media = await getAllMedia();
    const photographerMedia = media.filter((m) => m.photographerId === parseInt(id));
    return photographerMedia;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Function to fetch all media data
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

// ################################################################################################

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
  const firstName = photographerName.split(" ")[0];
  const fileName = media.image || media.video;
  const filePath = `assets/photographers/${firstName.replace(
    "-",
    " "
  )}/${fileName}`;
  console.log("File path:", filePath);
  return filePath;
}
// ################################################################################################

export {
  getAllPhotographers,
  getAllMedia,
  getPhotographerById,
  getMediaByPhotographerId,
  getPhotographerNameById,
  getMediaFilePath,
  allPhotographers,
};

// p === foundPhotographer
