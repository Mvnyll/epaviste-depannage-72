import { gallery } from "../data/gallery.js";

const galleryGrid = document.querySelector("#gallery-grid");
const dialog = document.querySelector("#lightbox");
const image = dialog.querySelector("img");
const caption = dialog.querySelector("figcaption");
const closeButton = dialog.querySelector("[data-close-lightbox]");
let activeIndex = 0;

function showImage(index) {
  activeIndex = (index + gallery.length) % gallery.length;
  image.src = gallery[activeIndex].src;
  image.alt = gallery[activeIndex].alt;
  caption.textContent = gallery[activeIndex].label;
}

gallery.forEach((item, index) => {
  const button = document.createElement("button");
  button.className = `gallery-item gallery-item--${item.size}`;
  button.type = "button";
  button.setAttribute("aria-label", `Afficher l’image : ${item.alt}`);
  const thumbnail = document.createElement("img");
  thumbnail.src = item.src;
  thumbnail.alt = item.alt;
  thumbnail.loading = index === 0 ? "eager" : "lazy";
  if (index === 0) thumbnail.fetchPriority = "low";
  const label = document.createElement("span");
  label.textContent = item.label;
  button.append(thumbnail, label);
  button.addEventListener("click", () => {
    showImage(index);
    dialog.showModal();
    closeButton.focus();
  });
  galleryGrid.append(button);
});

dialog.querySelector("[data-previous]").addEventListener("click", () => showImage(activeIndex - 1));
dialog.querySelector("[data-next]").addEventListener("click", () => showImage(activeIndex + 1));
closeButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showImage(activeIndex - 1);
  if (event.key === "ArrowRight") showImage(activeIndex + 1);
});
