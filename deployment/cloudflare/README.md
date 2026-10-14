# Cloudflare Pages

Le projet se déploie comme un site statique, sans Worker ni Pages Function.

1. Poussez le dépôt GitHub (le dossier `dist/` est généré et ignoré par Git).
2. Dans Cloudflare, ouvrez **Workers & Pages → Create → Pages → Connect to Git** et sélectionnez le dépôt.
3. Choisissez la branche de production. Laissez la commande de build `npm run build` et le répertoire de sortie `dist`.
4. Enregistrez. Les nouveaux commits déclenchent les builds; les branches non productives peuvent fournir des URLs de prévisualisation.
5. Ajoutez le domaine dans **Custom domains**. Appliquez les enregistrements DNS proposés par Cloudflare et attendez la validation du certificat HTTPS.

Vite copie `404.html` dans `dist/`; Pages l’utilise pour les routes inconnues. Aucun domaine n’étant confirmé, ajoutez l’URL réelle au sitemap et à `robots.txt` au moment de la mise en ligne.

Le fichier `public/_headers` applique la CSP, les protections anti-cadrage et anti-sniffing, Referrer-Policy, Permissions-Policy et HSTS. Vérifiez ces en-têtes dans les réponses HTTP après le déploiement.
