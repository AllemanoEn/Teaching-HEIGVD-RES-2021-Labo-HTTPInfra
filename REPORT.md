# Documentation laboratoire Http Infra RES
La documentation suivante décrit de manière succinct les étapes entreprises pour la réalisation du laboratoire.

#### Auteurs : Luca Zacheo et Enzo Allemano

---

## Step 1
Cette première étape consiste à configurer un serveur HTTP statique à l'aide d'une image Docker.
Pour y parvenir, nous avons utilisé une image déjà configurée disponible sur [dockerhub](https://hub.docker.com/).
[L'image en question](https://github.com/docker-library/php/blob/47e681a74116da5a99e804bef5a7808df40d831f/7.4/buster/apache/Dockerfile) contient un serveur apache fonctionel avec la version 7.4 de php.

Nous avons ensuite écrit un [Dockerfile](../blob/fb-step-1/docker-images/apache-php-image/Dockerfile)
