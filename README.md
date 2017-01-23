# Celestium Framework
Framework de base sans librairies

l'origine de ce framework est d'offrir aux developpeurs front-end les meilleurs outils pour commencer un projet de toute taille.
Plusieurs concepts sont présents:

**1. Component First**

On commence par développer la composante de manière isolée, elle doit autant que faire ce peut être indépendante.
C'est la raison pour laquelle chaque composant se trouve dans un dossier avec son JS (typescript), son HTML et son SCSS.

**2. Styleguide First**

Cette composante devrait d'abord être conçue dans la Styleguide pour s'assurer qu'elle n'impacte pas les autres composantes.

**3. Mobile First**

On commence par développer ce composant par le mobile.

## Sommaire
1. Installation
2. Gulp Task

## Installation
1. Cloner ce repo
  1.  Installer GitBash
  2.  Créer un dossier dans votre repertoire "projects"
  3.  Dans ce répertoire, clic droit et "Git Bash Here"
  4.  **$ git clone https://github.com/tomagladiator/celestium-framework/**
  5.  fermer le command line GitBash
  6.  Ouvrir le dossier créé "celestium-framework"
  7.  Supprimer le dossier caché .git
  8.  Dans ce répertoire, clic droit et "Git Bash Here"
  9.  **$ npm install**
  10.  ... attendre
2. Initialiser le projet (a ne faire qu'une seule fois)
  1. **$ gulp doThisJustOnce**

    *(Gulp va deplacer la librairie sanitize.css dans '5-else/scss/libs/')*

3. Lancer le serveur
  1. **$ gulp**

    *(Gulp va créer un serveur local:8080)*

    *(Gulp va compiler le SCSS en CSS)*

    *(Gulp va compiler le HTML avec ses includes)*

    *(Gulp va générer le JS du Head)*

    *(Gulp va générer le JS du Foot)*

    *(Gulp va otimiser les images)*

    *(Gulp va injecter le CSS above the fold dans le HTML)*

    *(Gulp va Watch si des changements s'appliquent aux fichiers, si oui, on relance)*

## Gulp Task

1. **$ gulp favicon**

  *(Gulp va convertir le logo carré en tous les formats de favicon)*

1. **$gulp component --options name-of-component**

  *(Gulp va générer le SCSS, KIT et TS du component suivant un model)*

  *(Gulp va remplacer les termes "lorem" du model par "name-of-component")*

1. **$ gulp structure --options name-of-structure**

  *(Gulp va générer le SCSS, KIT de la structure suivant un model)*

  *(Gulp va remplacer les termes "lorem" du model par "name-of-structure")*

1. **$ gulp layout --options name-of-layout**

  *(Gulp va générer le SCSS du layout suivant un model)*

  *(Gulp va remplacer les termes "lorem" du model par "name-of-layout")*

1. **$ gulp page --options name-of-page**

  *(Gulp va générer le SCSS, KIT de la page suivant un model)*

  *(Gulp va remplacer les termes "lorem" du model par "name-of-page")*
