import { company } from "./config.js";
import { services } from "./data/services.js";
import "./features/area-search.js";
import "./features/animations.js";
import "./features/gallery.js";

const serviceGrid = document.querySelector("#service-grid");
for (const service of services) {
  const card = document.createElement("article");
  card.className = "service-card reveal";
  const top = document.createElement("div");
  top.className = "service-card__top";
  const icon = document.createElement("span");
  icon.className = "service-card__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = service.icon;
  const number = document.createElement("span");
  number.className = "service-card__number";
  number.textContent = service.number;
  top.append(icon, number);
  const heading = document.createElement("h3");
  heading.textContent = service.title;
  const description = document.createElement("p");
  description.textContent = service.description;
  card.append(top, heading, description);
  serviceGrid.append(card);
  requestAnimationFrame(() => card.classList.add("is-visible"));
}

document.querySelectorAll("[data-company-name]").forEach((element) => {
  element.textContent = company.name;
});
document.querySelector("#about-copy").textContent = company.about;
document.querySelector("#current-year").textContent = new Date().getFullYear();

const menuButton = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#primary-nav");
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
  mobileMenu.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuButton.focus();
  }
});
