export function getAreaMapsLinks(area) {
  const destination = `${area.city} ${area.postalCode}`;
  const directions = new URL("https://www.google.com/maps/dir/");
  directions.searchParams.set("api", "1");
  directions.searchParams.set("destination", destination);

  return {
    view: area.mapsUrl,
    directions: directions.toString(),
  };
}
