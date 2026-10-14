# Épaviste & Dépannage 72

Site vitrine statique en HTML, CSS et JavaScript natif (modules ES). Il ne contient ni backend, ni base de données, ni commande, réservation ou formulaire de contact. Le champ de la page d’accueil sert uniquement à filtrer localement les zones d’intervention.

## Démarrer

Prérequis : Node.js 18+ et npm.

```sh
npm install
npm run dev
```

Vite affiche l’adresse locale dans le terminal. Contrôles et version de production :

```sh
npm run check
npm run build
npm run preview
```

`npm run build` génère `dist/`, autonome et publiable sur un hébergement de fichiers statiques. Vite n’est requis que pour le développement et la compilation.

## Organisation

- `index.html` : sections et navigation de la page.
- `src/js/config.js` : nom, coordonnées facultatives, SEO et texte de présentation.
- `src/js/data/centers.js` : données géographiques centralisées; `serviceAreas` contient les 54 villes couvertes et `centers` ne contient que les implantations physiques confirmées.
- `src/js/data/services.js` et `gallery.js` : contenu des prestations et photos de l’entreprise.
- `src/js/services/area-search-service.js` : normalisation Unicode et filtrage réutilisable, indépendant du DOM.
- `src/js/services/distance-service.js` : distance à vol d’oiseau par formule de Haversine.
- `src/js/services/maps-service.js` : URLs Google Maps et itinéraires.
- `src/js/features/area-search.js` : contrôles de recherche, filtres et géolocalisation déclenchée par clic.
- `src/js/features/gallery.js`, `animations.js` et `main.js` : galerie, animations, navigation et rendu des contenus.
- `src/css/` : variables, mise en page, composants et adaptations responsive séparés.
- `scripts/check-data.mjs` : contrôle des 54 villes, de la recherche, des distances et de la syntaxe JavaScript.
- `deployment/` : notes pour Cloudflare Pages et configuration facultative Firebase Hosting.

## Modifier les informations

### Entreprise et SEO

Modifiez `src/js/config.js`. Les coordonnées (téléphone, e-mail, adresse, domaine) sont vides tant qu’elles ne sont pas confirmées. N’ajoutez les liens `tel:` et les coordonnées visibles qu’avec les informations officielles. Les champs `seo.title` et `seo.description` sont prêts à être ajustés; mettez aussi à jour les métadonnées de `index.html`.

### Zones et centres

Dans `src/js/data/centers.js`, ajoutez ou modifiez un objet `area(id, ville, codePostal, département, nomDépartement)` dans `serviceAreas`. Le code postal doit rester une chaîne à cinq caractères. L’URL de recherche Maps est générée et encodée avec `URLSearchParams`; aucun lien n’est à saisir manuellement.

Les villes de `serviceAreas` sont des zones couvertes, pas des agences. Laissez `centers` vide jusqu’à confirmation d’une adresse physique. Pour calculer les distances, ajoutez à une zone uniquement `latitude` et `longitude` vérifiées. Sans coordonnées de ville, le site ne fabrique aucune distance; la recherche textuelle reste disponible. La géolocalisation du navigateur n’est demandée qu’après clic et peut nécessiter HTTPS en production.

La recherche ignore la casse, les accents et les espaces superflus. Elle porte sur la ville, le code postal et le département. Saisir exactement `72`, `53`, `41` ou `61` active le filtre correspondant. Les photos officielles utilisées sur le site se trouvent dans `public/assets/images`. Aucun géocodeur, API payante ou backend n’est utilisé.

### Contenus, photos et couleurs

Les prestations se modifient dans `src/js/data/services.js`. Les photos de la galerie et les visuels du site sont stockés dans `public/assets/images`; les textes alternatifs sont définis dans `src/js/data/gallery.js`. Les couleurs et la typographie sont centralisées dans `src/css/tokens.css`. Le logo original n’était pas présent dans le dossier de projet; remplacez le bloc de marque dans `index.html` lorsqu’il est disponible.

## Déploiement GitHub Pages

Le dépôt `Mvnyll/epaviste-depannage-72` est configuré pour publier automatiquement le site sur GitHub Pages après chaque push sur `main`.

1. Dans GitHub, ouvrez **Settings → Pages** et définissez **Build and deployment → Source** sur **GitHub Actions**.
2. Envoyez le contenu de ce projet dans la branche `main` (sans `node_modules/` ni `dist/`).
3. Dans l’onglet **Actions**, attendez la fin du workflow **Deploy to GitHub Pages**.
4. Le site sera disponible à l’adresse `https://mvnyll.github.io/epaviste-depannage-72/`.

Le workflow exécute `npm ci`, `npm run check` et `npm run build` avant de publier `dist/`. Vite et les liens internes utilisent le chemin du dépôt GitHub Pages en production.

## Déploiement Cloudflare Pages

1. Créez un dépôt GitHub et poussez le projet, sans `node_modules/` ni `dist/`.
2. Dans Cloudflare Pages, créez un projet connecté au dépôt et choisissez la branche de production.
3. Commande de build : `npm run build`; dossier de sortie : `dist`.
4. Chaque push déclenche un déploiement; les branches/PR peuvent produire des prévisualisations.
5. Dans les paramètres du projet, ajoutez le domaine personnalisé puis suivez les indications DNS Cloudflare. Vérifiez l’émission HTTPS.
6. Le fichier `404.html` est copié à la racine de `dist` par Vite.

Aucun Worker ni Pages Function n’est requis. Après confirmation du domaine, créez le sitemap avec l’URL canonique réelle et référencez-le dans `robots.txt`; aucun domaine n’a été inventé dans ce projet.

## Déploiement Firebase Hosting (facultatif)

Firebase est utilisé uniquement pour l’hébergement statique. Créez le projet dans la console Firebase. À partir de la racine du projet, après `npm install` et `npm run build` :

```sh
npm install --global firebase-tools
firebase login
firebase use --add
firebase deploy --only hosting
```

À la sélection, choisissez le projet créé. Le `firebase.json` à la racine publie `dist`; `deployment/firebase/firebase.json` en est la copie de référence. Ne configurez pas de réécriture vers une application serveur, ne remplacez pas les fichiers construits et n’activez aucun autre produit Firebase. Firebase Hosting sert la page `404.html`.

Pour un domaine personnalisé, ajoutez-le dans Firebase Hosting, suivez la vérification de propriété et les enregistrements DNS indiqués, puis attendez la configuration HTTPS automatique. Aucun service Firestore, Functions, Auth ou Storage n’est requis.

## Git

```sh
git init
git add .
git commit -m "Initialise le site vitrine"
```

Avant publication, remplacez les images par des ressources autorisées et ajoutez les coordonnées, adresses, photos, mentions légales et informations de confidentialité validées par l’entreprise.

## Sécurité

Les recherches ne sont jamais interprétées comme du HTML : le rendu utilise `textContent` et des nœuds DOM créés explicitement. Les scripts sont locaux, les liens externes ouverts en nouvel onglet utilisent `rel="noopener noreferrer"`, et `npm run check` échoue si des sinks courants d’injection (`innerHTML`, `eval`, etc.), des gestionnaires d’événements inline ou des styles inline sont ajoutés.

Une CSP stricte est appliquée aux pages et configurée dans `public/_headers` (Cloudflare Pages) et `firebase.json` (Firebase Hosting). Les en-têtes interdisent les objets/plugins, les iframes, le chargement de scripts tiers et les connexions externes; seules les images Unsplash existantes sont autorisées en plus des ressources locales. Les APIs caméra et microphone sont désactivées; la géolocalisation reste permise après consentement explicite.

Aucune protection ne peut garantir qu’un hébergeur, un compte de déploiement ou un ordinateur compromis ne puisse altérer les fichiers publiés. Protégez les accès Git et hébergeur avec MFA, limitez les personnes autorisées à publier, et gardez les dépendances à jour. Le site n’exécute aucun contenu fourni par les visiteurs et n’a aucun backend.
