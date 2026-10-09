# Les Pratiques de l'Islam et du Zikr — application Android (APK)

Lecteur hors ligne des 200 pages du PDF : sommaire cliquable par chapitre, swipe, zoom (pincement / double-tap),
saut à une page, miniatures, marque-pages, mode nuit, reprise à la dernière page lue.

## Obtenir l'APK (sans rien installer, ~5 minutes)

1. Créez un dépôt GitHub (privé ou public) et envoyez-y tout le contenu de ce dossier
   (y compris le dossier caché `.github`).
   - Sur le site GitHub : « Add file » > « Upload files », glissez tout le contenu.
2. Ouvrez l'onglet **Actions** : le workflow « Build APK » se lance seul
   (sinon : « Build APK » > « Run workflow »).
3. Quand il est vert, ouvrez l'exécution et téléchargez l'artefact
   **pratiques-islam-zikr-apk** : il contient `app-debug.apk`.
4. Copiez l'APK sur le téléphone et installez-le
   (autorisez « Sources inconnues » si Android le demande).

## Compiler soi-même (Android Studio)
```
npm install
npx cap add android
npx cap sync android
npx cap open android      # puis Build > Build APK(s)
```

## Pour Google Play
Le build « debug » convient pour installer sur vos téléphones. Pour publier sur le
Play Store il faut un build « release » signé (AAB) ; dites-le-moi et je prépare la config.
Vérifiez aussi que vous avez les droits de diffusion de cet ouvrage.

## Contenu
- `www/` : l'application (HTML/CSS/JS) + `pages/` (200 pages WebP) + `thumbs/`
- `capacitor.config.json` : nom et identifiant (`com.mourtalla.zikr`) à modifier si besoin
