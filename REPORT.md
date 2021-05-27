# Documentation laboratoire Http Infra RES
La documentation suivante décrit de manière succinct les étapes entreprises pour la réalisation du laboratoire.

##### Auteurs : Luca Zacheo et Enzo Allemano
##### Environnement de dévelopement : Luca Zacheo et Enzo Allemano

---

## Step 1
Cette première étape consiste à configurer un serveur HTTP statique à l'aide d'une image Docker.
Pour y parvenir, nous avons utilisé une image déjà configurée disponible sur [dockerhub](https://hub.docker.com/).
[L'image en question](https://github.com/docker-library/php/blob/47e681a74116da5a99e804bef5a7808df40d831f/7.4/buster/apache/Dockerfile) contient un serveur apache fonctionel avec la version 7.4 de php.

Nous avons ensuite écrit un [Dockerfile](../fb-step-1/docker-images/apache-php-image/Dockerfile) pour nous permettre de construire cette image Docker.
Nous y avons écrit les commandes suivante :

| Commande      					| But           |
| ------------- 					|-------------	|
| `FROM php:7.4-apache`      		| Indique la version php et l'image apache utilisée | 
| `COPY content/ /var/www/html/`    | Copie les fichiers de configurations à l'intérieur du docker |

Pour cette étape nous n'avons pas jugé util d'installer vim. Nous continuons d'éditer les divers fichiers sur notre host.

Pour vérifier le bon fonctionnement de notre serveur http nous avons copié [un site html](https://github.com/mlg-hub/bootstrap-theme) très simple créer avec [bootstrap](https://getbootstrap.com/) à l'intérieur de notre
dossier content. La mise en page du site a été laissée telle quelle.

Ensuite, nous avons pu construire notre image depuis le dossier courant à l'aide des commandes suivantes

| Commande      							| But           |
| ------------- 							|-------------	|
| `docker build -t res/apache_php_el`		| Construction de l'image en spécifiant un tag </br> (el=enzoluca)| 
| `docker run -p 8080:80 res/apache_php_el` | Démarrage d'un container en spécifiant une redirection de port |
