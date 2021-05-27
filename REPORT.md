# Documentation laboratoire Http Infra RES
La documentation suivante décrit de manière succinct les étapes entreprises pour la réalisation du laboratoire.

##### Auteurs : Luca Zacheo et Enzo Allemano
##### Environnement de dévelopement : Luca Zacheo et Enzo Allemano

---

## Step 1
Cette première étape consiste à configurer un serveur http statique à l'aide d'une image Docker pour nous permettre d'afficher
un simple site html.
Pour y parvenir, nous avons utilisé une image déjà configurée disponible sur [dockerhub](https://hub.docker.com/).
[L'image en question](https://github.com/docker-library/php/blob/47e681a74116da5a99e804bef5a7808df40d831f/7.4/buster/apache/Dockerfile) contient un serveur apache fonctionel avec la version 7.4 de php.

Nous avons ensuite écrit un [Dockerfile](../fb-step-1/docker-images/apache-php-image/Dockerfile) pour nous permettre de construire cette image Docker.
Nous y avons écrit les commandes suivante :

| Commande      					| But           |
| :------------- 					|:-------------	|
| `FROM php:7.4-apache`      		| Indique la version php et l'image apache utilisée | 
| `COPY content/ /var/www/html/`    | Copie les fichiers de configurations à l'intérieur du docker |

Pour cette étape nous n'avons pas jugé utile d'installer vim. Nous continuons d'éditer les divers fichiers sur notre host.

Pour vérifier le bon fonctionnement de notre serveur http nous avons copié [un site html](https://github.com/mlg-hub/bootstrap-theme) très simple créer avec [bootstrap](https://getbootstrap.com/) à l'intérieur de notre
dossier content. La mise en page du site a été laissée telle quelle.

Ensuite, nous avons pu construire notre image depuis le dossier courant à l'aide des commandes suivantes

| Commande      							| But           |
| :------------- 							|:-------------	|
| `docker build -t res/apache_php_el`		| Construction de l'image en spécifiant un tag </br> (el=enzoluca)| 
| `docker run -p 8080:80 res/apache_php_el` | Démarrage d'un container en spécifiant une redirection de port |

## Step 2
La seconde étape consiste à configurer un serveur 

## Step 2
La seconde étape consiste à configurer un serveur http qui soit capable de nous renvoyer une réponses au format json.
La réponse formatée en json sera construite avec les modules node.js et express.js.

### Step 2(a)
Nous avons utilisé une image nodejs déjà configurée, disponible sur dockerhub. Ceci ayant pour but d'exécuter un simple fichier javascript 
dans un container docker et de pouvoir voir le résultat directement sur notre terminal.

Nous avons ensuite écrit un [Dockerfile](../fb-step-2/docker-images/express-image/Dockerfile) pour nous permettre de construire cette image Docker.
Nous y avons écrit les commandes suivante :

| Commande      						| But           |
| :------------- 						|:-------------	|
| `FROM node:16`      					| Indique la version de nodejs utilisée | 
| `COPY src /opt/app`    				| Copie les fichiers de configurations à l'intérieur du docker |
| `CMD ["node", "/opt/app/index.js"]`   | Exécute la commande `node /opt/app/index.js` au démarrage du container |

Pour tester notre image, nous avons utilisé l'utilitaire `npm init` afin de créer une application de test. 
Nous y avons ensuite ajouter la dépendance "chance" que nous utilisons pour générer entre 1 étudiant au format json (prénom + nom).
Ceci à pour unique but de tester un petit script js. Ce script s'appel [`index.js`](../fb-step-2/docker-images/express-image/src/index.js) et se trouve dans le dossier src.

On peu à présent construire notre image et démarrer un container pour voir apparaître sur notre terminal un étudiants au foramt json.

Le container démarré juste au dessus s'exécute et se termine instantanément car il a treminé don exécution.

### Step 2(b)
Comme décrit plus haut, pour configurer le côté http nous utilisons le framework express.js.

Le fichier [`index.js`](../fb-step-2/docker-images/express-image/src/index.js) a donc été modifié de tel sorte à répondre aux requêtes http en renvoyant entre 0 et 10 étudiants formatés au format json.

Dans l'exemple fournis, la commande `docker-machine ssh` est utilisée pour tester le serveur directement depuis l'environnement Docker.
Etant sous Windows, c'est fonction n'est pas disponible par défaut. Nous avons donc directement testé notre image docker en démarrant un container
avec une redirection de port. De se fait, on peut directement voir que depuis notre navigateur on peut récupérer la liste d'étudiants.

| Commande      							| But           |
| :------------- 							|:-------------	|
| `docker build -t res/express_student_el .`		| Construction de l'image en spécifiant un tag </br> (el=enzoluca)| 
| `docker run -p 9090:80 res/express_student_el` | Démarrage d'un container en spécifiant une redirection de port |

Les tests effectuées fonctionnent également avec l'outil [Postman](https://www.postman.com/).

## Step 3
La troisième étape consiste à configurer un reverse proxy

#### Step 3(a)/(b)
Les étapes 3a et 3b nous servaient d'explications afin de comprendre l'implémentation mise en place dans l'étape suivante.

Nous avons fait les manipulations nécessaires au bon fonctionnement du reverse proxy mais cela était fait en "dur" dans le container directement.

Ceci à pour effet d'être éphémère, en effet au redémarrage de la machine ou simplement du container tout nos changement seront perdus. Nous remédions donc à cela dans l'étape 3c

#### Step 3(c)

Nous avons donc fait un reverse proxy afin de se connecter depuis notre machine à nos 2 containers des étapes 1 et 2 ( apache et express ).

Nous avons ensuite écrit un [Dockerfile](../fb-step-3/docker-images/apache-reverse-proxy/Dockerfile) pour nous permettre de construire cette image Docker.
Nous y avons écrit les commandes suivante :

| Commande      					| But           |
| :------------- 					|:-------------	|
| `FROM php:5.6-apache`      		| Indique la version php et l'image apache utilisée | 
| `COPY conf/ /etc/apache2`    		| Copie les fichiers de configurations à l'intérieur du docker |
| `RUN a2enmod proxy proxy_http`    | Activation du module proxy et proxy_http |
| `RUN a2ensite 000-* 001-*`    	| Activation du module de nos virtual host |

Nous avons également créé un sous-dossier "conf" afin d'y mettre nos configurations du serveur. 

Ce [dossier](../fb-step-3/docker-images/apache-reverse-proxy/conf) contient donc : 
`000-default.conf`
`001-reverse-proxy.conf`

| Fichier      						| But           |
| :------------- 					|:-------------	|
| `000-default.conf`      			| Sert à rendre plus strictes les connexion (vide) | 
| `001-reverse-proxy.conf`     		| Définit en dur les ips de nos containers avec la redirection de 										port correcte | 

Une fois le tout configuré, afin de pouvoir se connecter avec le nom `demo.res.ch`, nous avons du éditer notre ficher `etc/hosts` en local pour rediriger toute les demandes de connection à ce nom de domaine vers notre VM docker.












