const imagesPath = `${import.meta.env.BASE_URL}assets/images/`;

export const gallery = [
  {
    src: `${imagesPath}parc-vehicules-01.jpeg`,
    alt: "Véhicules stationnés sur le parc de l’entreprise",
    label: "Notre parc",
    size: "wide",
  },
  {
    src: `${imagesPath}parc-vehicules-02.jpeg`,
    alt: "Voitures stationnées dans le parc",
    label: "Véhicules",
    size: "tall",
  },
  {
    src: `${imagesPath}parc-vehicules-03.jpeg`,
    alt: "Véhicules visibles sur le parc en extérieur",
    label: "Sur le parc",
    size: "standard",
  },
  {
    src: `${imagesPath}parc-vehicules-04.jpeg`,
    alt: "Parc de véhicules au coucher du soleil",
    label: "En fin de journée",
    size: "standard",
  },
  {
    src: `${imagesPath}vehicule-accidente.jpg`,
    alt: "Peugeot accidentée prise en charge après un choc à l’avant",
    label: "Prise en charge d’un véhicule accidenté",
    size: "standard",
  },
  {
    src: `${imagesPath}intervention-moteur.jpg`,
    alt: "Intervention sur le moteur d’un véhicule, capot ouvert",
    label: "Intervention sous le capot",
    size: "standard",
  },
];
