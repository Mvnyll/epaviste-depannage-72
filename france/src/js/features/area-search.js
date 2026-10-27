import { serviceAreas } from "../data/centers.js";
import { searchServiceAreas } from "../services/area-search-service.js";
import { sortAreasByDistance } from "../services/distance-service.js";
import { getAreaMapsLinks } from "../services/maps-service.js";

const resultList = document.querySelector("#area-results");
const countLabel = document.querySelector("#result-count");
const message = document.querySelector("#search-message");
const searchInput = document.querySelector("#area-query");
const searchButton = document.querySelector("#search-button");
const clearButton = document.querySelector("#clear-search");
const locationButton = document.querySelector("#location-button");
const resultsToggle = document.querySelector("#toggle-results");
const departmentButtons = [...document.querySelectorAll("[data-department]")];

let selectedDepartment = "all";
let currentPosition = null;

function createMapLink(label, url, variant = "") {
  const link = document.createElement("a");
  link.className = `map-link ${variant}`.trim();
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function renderResults() {
  const matches = searchServiceAreas(searchInput.value, selectedDepartment);
  const sortedMatches = currentPosition
    ? sortAreasByDistance(matches, currentPosition)
    : matches.map((area) => ({ area, distanceKm: null }));

  resultList.replaceChildren();
  countLabel.textContent = `${matches.length} ${matches.length > 1 ? "zones" : "zone"}`;
  clearButton.hidden = searchInput.value.trim() === "" && selectedDepartment === "all";

  if (matches.length === 0) {
    message.hidden = false;
    message.textContent = "Aucune zone ne correspond. Modifiez votre recherche ou effacez-la pour revoir toutes les villes.";
    return;
  }

  message.hidden = true;
  let previousDepartment = null;
  for (const { area, distanceKm } of sortedMatches) {
    if (!currentPosition && area.department !== previousDepartment) {
      const group = document.createElement("h4");
      group.className = "area-group-label";
      group.textContent = `${area.departmentName} · ${area.department}`;
      resultList.append(group);
      previousDepartment = area.department;
    }

    const card = document.createElement("article");
    card.className = "area-card";

    const heading = document.createElement("div");
    heading.className = "area-card__heading";
    const title = document.createElement("h3");
    title.textContent = area.city;
    const department = document.createElement("span");
    department.className = "department-tag";
    department.textContent = `${area.department} · ${area.departmentName}`;
    heading.append(title, department);

    const details = document.createElement("div");
    details.className = "area-card__details";
    const postalCode = document.createElement("span");
    postalCode.className = "postal-code";
    postalCode.textContent = area.postalCode;
    details.append(postalCode);
    if (distanceKm !== null) {
      const distance = document.createElement("span");
      distance.textContent = `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(distanceKm)} km à vol d’oiseau`;
      details.append(distance);
    }

    const links = document.createElement("div");
    links.className = "area-card__links";
    const mapLinks = getAreaMapsLinks(area);
    links.append(
      createMapLink("Voir sur Google Maps", mapLinks.view),
      createMapLink("Itinéraire", mapLinks.directions, "map-link--quiet"),
    );
    card.append(heading, details, links);
    resultList.append(card);
  }
}

function runSearch() {
  currentPosition = null;
  message.hidden = true;
  renderResults();
}

resultsToggle.addEventListener("click", () => {
  const isExpanded = resultsToggle.getAttribute("aria-expanded") === "true";
  resultsToggle.setAttribute("aria-expanded", String(!isExpanded));
  resultsToggle.textContent = isExpanded ? "Afficher les villes" : "Masquer les villes";
  resultList.hidden = isExpanded;
});

searchButton.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") runSearch();
});
clearButton.addEventListener("click", () => {
  searchInput.value = "";
  selectedDepartment = "all";
  departmentButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.department === "all")));
  currentPosition = null;
  renderResults();
  searchInput.focus();
});

departmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedDepartment = button.dataset.department;
    departmentButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    currentPosition = null;
    renderResults();
  });
});

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    message.hidden = false;
    message.textContent = "La géolocalisation n’est pas disponible dans ce navigateur. Vous pouvez toujours rechercher une ville ou un code postal.";
    return;
  }

  locationButton.disabled = true;
  locationButton.textContent = "Localisation…";
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      currentPosition = { latitude: coords.latitude, longitude: coords.longitude };
      renderResults();
      const hasCoordinates = serviceAreas.some((area) => Number.isFinite(area.latitude) && Number.isFinite(area.longitude));
      const hasMatches = searchServiceAreas(searchInput.value, selectedDepartment).length > 0;
      message.hidden = hasCoordinates || !hasMatches;
      if (!hasCoordinates && hasMatches) {
        message.textContent = "Votre position a été obtenue, mais les coordonnées GPS vérifiées des villes ne sont pas encore renseignées. La recherche par ville reste disponible.";
      }
      locationButton.disabled = false;
      locationButton.textContent = "Utiliser ma position";
    },
    (error) => {
      const messages = {
        1: "L’accès à votre position a été refusé. La recherche manuelle reste disponible.",
        2: "Votre position n’a pas pu être déterminée. Réessayez ou recherchez une ville.",
        3: "La localisation a pris trop de temps. Vous pouvez rechercher une ville manuellement.",
      };
      message.hidden = false;
      message.textContent = messages[error.code] || "La géolocalisation a échoué. La recherche manuelle reste disponible.";
      locationButton.disabled = false;
      locationButton.textContent = "Utiliser ma position";
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
  );
});

document.querySelectorAll("[data-footer-department]").forEach((link) => {
  link.addEventListener("click", () => {
    selectedDepartment = link.dataset.footerDepartment;
    departmentButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.department === selectedDepartment)));
    renderResults();
  });
});

renderResults();
