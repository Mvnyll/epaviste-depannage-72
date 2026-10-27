# Firebase Hosting (facultatif)

Cette configuration ne cible que Firebase Hosting statique. Elle ne demande ni base de données, ni fonctions, ni authentification.

À la racine du projet, créez ou sélectionnez d’abord un projet Firebase dans la console. Puis :

```sh
npm install
npm run build
npm install --global firebase-tools
firebase login
firebase use --add
firebase deploy --only hosting
```

À la sélection du projet, choisissez celui créé dans la console. Le `firebase.json` à la racine publie `dist`; `deployment/firebase/firebase.json` en est la copie de référence. Ne configurez pas de réécriture vers une application et ne remplacez pas la sortie de build.

Firebase sert le `404.html` de `dist`. Pour un domaine personnalisé, ajoutez-le depuis la console Hosting, effectuez la vérification et configurez les DNS indiqués. HTTPS est provisionné automatiquement après validation.

La configuration applique une CSP stricte et les en-têtes anti-cadrage, anti-sniffing, Referrer-Policy, Permissions-Policy et HSTS. Vérifiez leur présence dans les réponses HTTP après le déploiement.
