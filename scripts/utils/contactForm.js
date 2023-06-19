// Function to display the modal
export function displayModal() {
  const modal = document.getElementById("contact_modal");
  // Set the display style to block to show the modal
  modal.style.display = "block";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
}

// Function to close the modal
export function closeModal() {
  const modal = document.getElementById("contact_modal");
  // Set the display style to none to hide the modal
  modal.style.display = "none";
  modal.removeAttribute("role");
  modal.removeAttribute("aria-modal");
}

export default closeModal; 