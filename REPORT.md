# Documentation laboratoire Http Infra RES
La documentation suivante décrit de manière succinct les étapes entreprises pour la réalisation du laboratoire.

##### Auteurs : Luca Zacheo et Enzo Allemano
##### Environnement de dévelopement : Windows 10

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

### Step 3(a)/(b)
Les étapes 3a et 3b nous servaient d'explications afin de comprendre l'implémentation mise en place dans l'étape suivante.

Nous avons fait les manipulations nécessaires au bon fonctionnement du reverse proxy mais cela était fait en "dur" dans le container directement.

Ceci à pour effet d'être éphémère, en effet au redémarrage de la machine ou simplement du container tout nos changement seront perdus. Nous remédions donc à cela dans l'étape 3c

### Step 3(c)

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

## Step 4

Cette étape consiste à mettre à jour dynamiquement sur notre serveur apache les données retournées par notre serveur express.

Nous avons premièrement  modifié chacuns de nos Dockerfiles afin d'y ajouter les commandes `apt-get update` ainsi que `apt-get install vim` pour que nos containers aient vim et soient à jour.

Ensuite, afin d'implémenter visuellement la réponse de notre serveur express ( les noms aléatoires ) nous avons créé un nouveau fichier javascript [students.js](../fb-step-4/docker-images/apache-php-image/content/js/students.js) sur notre serveur apache, qui implémente une fonction créant un tableau avec les noms retournés afin de les afficher.

Afin que notre serveur interprète correctement la nouvelle fonction, nous avons également dû ajouter l'inclusion de students.js dans [index.html](../fb-step-4/docker-images/apache-php-image/content/index.html)
`<script src="js/students.js"></script>`

## Step 5
Cette étape consiste à mettre en place une connexion dynamique entre notre reverse proxy et notre serveur apache ainsi que express.

Nous avons dans un premier temps écrit un script [apache2-foreground](../fb-step-5/docker-images/apache-reverse-proxy/apache2-foreground) qui reprend les commandes qui sont executées de base par le serveur apache et nous y avons ajouté des *echos* avec des variables afin de voir si tout marchait correctement.


Pour que ce script s'éxecute correctement au lancement du serveur il faut le copier dessus, nous avons donc ajouté cette ligne dans notre [Dockerfile](../fb-step-5/docker-images/apache-reverse-proxy/Dockerfile) :

`COPY apache2-foreground /usr/local/bin/`

A cette étape nous avons rencontrés quelques soucis car visiblement le script de base `apache2-foreground` ne faisait plus exactement la même chose que celui du prof. au moment de l'enregistrement de la vidéo.

Nous avons donc dû ajouté ces lignes dans notre [apache2-foreground](../fb-step-5/docker-images/apache-reverse-proxy/apache2-foreground) :

*# Not the same version as the webcast<br>: "${APACHE_CONFDIR:=/etc/apache2}"<br>: "${APACHE_ENVVARS:=$APACHE_CONFDIR/envvars}"<br>if test -f "$APACHE_ENVVARS"; then<br>. "$APACHE_ENVVARS"<br>fi<br>#Apache gets grumpy about PID files pre-existing<br>: "${APACHE_RUN_DIR:=/var/run/apache2}"<br>: "${APACHE_PID_FILE:=$APACHE_RUN_DIR/apache2.pid}"<br>rm -f "$APACHE_PID_FILE"<br>*

Nous avons ensuite avons ajouté le fichier [config-template.php](../fb-step-5/docker-images/apache-reverse-proxy/templates) sur notre server reverse proxy.

Ce fichier, nous permet de définir des variables pour spécifier à quelles addresses vont se trouvés nos containers express et apache. Ces variables vont être des variables globales ce qui nous permet de ne pas avoir à écrire en dur l'ip de nos containers dans le fichier comme au paravant.

Il faudra toute fois spécifier les ips que nous souhaitons au moment du run de notre reverse proxy grâce au `-e` permettant de définir une variable d'environnement à notre container.

Pour que cela fonctionne au lancement de notre container nous avons donc dû éditer le [Dockerfile](../fb-step-5/docker-images/apache-reverse-proxy/Dockerfile) associé afin de copier le nouveau fichier php décrit ci-dessus dans notre serveur.

Pour ce faire cette ligne à été ajoutée (le fichier php étant contenu dans le dossier templates):
`COPY templates /var/apache2/templates`

Ensuite, afin que notre fichier [config-template.php](../fb-step-5/docker-images/apache-reverse-proxy/templates)
s'éxecute au lancement, nous avons éditer  [apache2-foreground](../fb-step-5/docker-images/apache-reverse-proxy/apache2-foreground)
en y ajoutant : 

`php /var/apache2/templates/config-template.php > /etc/apache2/sites-available/001-reverse-proxy.conf`

Cette ligne de commande sert donc à exécuter notre script PHP et à écrire le résultat de cette exécution dans notre fichier de configuration du serveur reverse proxy (001-reverse-proxy.conf).

## Additional step : Load balancing: multiple server nodes 
Pour cette étape, nous avons constaté que *nginx* permettait de gérer le Load balancing plutôt facilement.

Pour ce faire nous avons donc ajouté un [Dockerfile](../fb-load-balancing/docker-images/load-balancing/Dockerfile)
nous permettant d'importer une image *nginx*.

Nous avons ensuite écrit notre ficher de configuration [nginx.conf](../fb-load-balancing/docker-images/load-balancing/nginx.conf)
 souhaité pour notre nouveau serveur.
 Dans ce fichier nous spécifions donc les 2 ips que chacuns des nos serveurs (apache et express) pourront avoir afin de balance les conversation entre ceux-ci.
 
 Il ne nous restait donc plus qu'à copier ce fichier de configuration dans notre container, pour ce faire nous avons ajouté cette ligne dans notre [Dockerfile](../fb-load-balancing/docker-images/load-balancing/Dockerfile) :
 
 `COPY nginx.conf /etc/nginx/nginx.conf`

## Additional step : Load balancing: round-robin vs sticky sessions
Comme mentionné dans la documentation Nginx, afin d'implémenter des sticky sessions, il nous suffit d'ajouter les valeurs de hash nécessaire.
L'avantage d'utiliser Nginx est que le round-robin est géré automatiquement.
