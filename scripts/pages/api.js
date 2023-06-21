// Faire des fonctions génériques (api.js?) qui contiennent
// des fonctions de type getAllPhotographers, getPhotographerById

// Path to the photographers data file
const photographersApi = "../../data/photographers.json";

// Variable to store the fetched photographers data
let allPhotographers = [];

// (0) Function to fetch all photographers' data
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

// (1) Function to get a photographer by their ID
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

// (2) Funtion to construct the file path for the media file
async function getMediaFilePath(media) {
  try {
    await getAllPhotographers(); // Wait for photographers data to be fetched
    const photographerName = await getPhotographerNameById(
      media.photographerId
    );
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
  } catch (error) {
    console.error(error);
    return null;
  }
}

// (3) Function to calculate the total likes for a photographer's media
async function calculateTotalLikesByPhotographerId(photographerId) {
  const media = await getMediaByPhotographerId(photographerId);
  let totalLikes = 0;

  media.forEach((item) => {
    totalLikes += item.likes;
  });

  return totalLikes;
}

// (4) Function to get the filtered media using photographer id
async function getFilteredElements(photographerId, type) {
  const media = await getMediaByPhotographerId(photographerId);

  switch (type) {
    case "popularity":
      return media.sort((a, b) => b.likes - a.likes);
    case "date":
      return media.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "title":
      return media.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return media.sort((a, b) => b.likes - a.likes);
  }
}

// ################################################################################################
// ################################################################################################

// Function to get media (photos or videos) associated with a photographer by their ID
async function getMediaByPhotographerId(id) {
  try {
    const media = await getAllMedia();
    const photographerMedia = media.filter(
      (m) => m.photographerId === parseInt(id)
    );
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

// Function to get the photographer's name by ID
async function getPhotographerNameById(photographerId) {
  await getAllPhotographers(); // Wait for photographers data to be fetched
  const photographerFound = allPhotographers.find(
    (p) => p.id === parseInt(photographerId)
  );
  return photographerFound ? photographerFound.name : null;
}

// Function to get the totalLikes for each photographer
function calculateTotalLikes(data) {
  let totalLikes = 0;

  data.media.forEach((media) => {
    totalLikes += media.likes;
  });

  return totalLikes;
}

// Function to get media by index
async function getMediaByIndex(index) {
  try {
    const allMedia = await getAllMedia();
    const media = allMedia.find((m) => m.index === index);
    return media;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ################################################################################################
// ################################################################################################

export {
  getAllPhotographers,
  getAllMedia,
  getPhotographerById,
  getMediaByPhotographerId,
  getPhotographerNameById,
  getMediaFilePath,
  allPhotographers,
  calculateTotalLikes,
  calculateTotalLikesByPhotographerId,
  getFilteredElements,
  getMediaByIndex,
};

// p === foundPhotographer
