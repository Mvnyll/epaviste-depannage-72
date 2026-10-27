import { serviceAreas } from "../data/centers.js";

export function normalizeSearchTerm(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim()
    .replace(/\s+/g, " ");
}

export function searchServiceAreas(query, department = "all") {
  const normalizedQuery = normalizeSearchTerm(query);
  const departmentFilter = department !== "all" ? department : null;
  const isDepartmentShortcut = serviceAreas.some((area) => area.department === normalizedQuery);

  return serviceAreas.filter((area) => {
    if (departmentFilter && area.department !== departmentFilter) return false;
    if (isDepartmentShortcut) return area.department === normalizedQuery;
    if (!normalizedQuery) return true;

    const searchableText = normalizeSearchTerm(
      `${area.city} ${area.postalCode} ${area.department} ${area.departmentName}`,
    );
    return searchableText.includes(normalizedQuery);
  });
}
