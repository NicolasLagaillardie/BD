#!/usr/bin/env bash
# Fichier     : indexeur.sh.dist
# Auteur      : Xavier Serpaggi <serpaggi@emse.fr>
#!/bin/bash
# 		téléchargé via l'URL passée en paramètre.
#
set -e

# Le répertoire de travail, ainsi que le nom du fichier temporaire
DIR="/tmp"
TMP="$DIR/fic-$(date +%Y%m%d)"

function die()
{
echo ${1:"Error"}
echo ${2:"1"}
}

function usage() {

while getopts 'h' option; do
	case $option in
	
		h)
			echo "
			NAME\n
			\tindexeur\n
			\n
			SYNOPSIS\n
			\tindexeur file [--help\n]
			\n
			COPYRIGHT\n
			\tindexeur is Copyright (c) 2018-2018 by EMSE, Xavier Serpaggi\n
			\n
			Description\n
			\tIndexeur est un indexeur de fichiers, qui permet d'un dictionnaire du fichier entre en parametre\n
			\n
			OPTIONS\n
			\t-h\tDisplay the help\n
			\t-d\tActive l'option debugage\n
			\t-f\traite l'entree utilisateur comme un fichier local au lieu d'une url\n
			\n
			ARGUMENTS\n
			\tfile\tl'url du fichier a telecharger\n"
			exit 1 ;;
	esac
done
}


# S'il n'y a pas d'argument, on affiche le message d'erreur
if [ -z "$1" ]
then
	usage $0
fi

dl=1 ;
LMOT=0 ;
occu=0 ;
totalOccu=0 ;
NMOT=0 ;
longMoy=0 ;
column=0 ;

while getopts 'dhf:l:otn:mc' option
do
	case $option in
		d)
			echo "mode debug active\n"
			set -x
			;;
		h)
			echo "Affichage de l'aide\n"
			usage --help
			;;
		f)
			echo "traitement d'un fichier local\n"
			dl=0
			;;
		l)
			echo "affichez que les mots dont la longueur est supérieure ou égale à une valeur donnée par la variable LMOT\n"
			LMOT=$3
			;;
		o)
			echo "Affichage des occurences\n"
			occu=1
			;;
		t)
			echo "Affichage du nombre d'occurences\n"
			totalOccu=1
			;;
		n)
			echo "liste des NMOTS mots les plus courants dans le fichier, triés par ordre décroissant d’occurrences\n"
			NMOT=$4
			;;
		m)
			echo "Longueur moyenne des mots\n"
			longMoy=1
			;;
		c)
			echo "Affichage en tableau\n"
			column=1
			;;
			
	esac
done

if [ $dl -eq 1 ]
then
	echo "telechargement du fichier" 
	# Tentons d'extraire une sous chaine qui représenterait un protocole
	proto=$(echo "$1" | cut -d':' -f1)

	# Si on ne tente pas de faire du HTTP ou du FTP, on arrête
	if [[ "$proto" != "http" && "$proto" != "ftp" ]]
	then
		usage $0
	fi

	# Téléchargement du fichier  ...
	curl --silent "$1" > $TMP
	if [ $? -ne 0 ]
	then
		die "Impossible de télécharger le fichier" 2
	fi
else
	echo "Fichier local"
	TMP=$(echo "$2" | cat)
fi

# Conversion en ASCII
conv=$(file -bi $TMP| tr "=" "\n"|tail -n +2)
if [ "$conv" == "iso-8859-1" ]
then
	echo "Fichier deja sous le bon format"
else
	iconv -c -f UTF-8 -t ISO-8859-1 $TMP > $TMP.conv 2>&1
	mv $TMP.conv $TMP 2>&1
fi

content=$(grep -n "CONTENTS" $TMP | cut -d':' -f1)
if [ -z "$content" ]
then
	echo "La table des matieres n'existe pas n'existe pas"
fi

# On extrait le numéro de ligne correspondant au début du fichier
DEBUT=$(grep -n "START .*GUTENBERG  *EBOOK" $TMP | cut -d':' -f1)
let DEBUT++ # On rajoute 1 pour sauter la ligne "DEBUT DU FICHIER"

# On extrait le numéro de ligne correspondant à la fin du fichier
# On évite les caractères accentués, ça pose *toujours* problème !
FIN=$(grep -n "END .*GUTENBERG  *EBOOK" $TMP | cut -d':' -f1)
if [ -z "$FIN" ]
then
	echo "Un des termes END .*GUTENBERG  *EBOOK n'existe pas : la fin du fichier n'est pas presente"
fi
let FIN-- # On retire 1 pour ne pas inclure la ligne "TABLE DES ..."

# On génère l'index en un seul enchaînement de commandes
head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
tr -d "\r" |								#on supprimme tous les characteres \r
grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
grep -v '^$' |								#on selectionne toutes les lignes non vides
sort |										#on trie
uniq								#on ne garde qu'une seule instance de chaque mot

printf "\n"

if [[ $l > 0 ]]
then

	#Affiche uniquement les mots de longueur superieure a LMOT

	# On génère l'index en un seul enchaînement de commandes
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	sort |										#on trie
	uniq |										#on ne garde qu'une seule instance de chaque mot
	grep -o -w "\w\{$LMOT,\}" $TMP				#on ne garde que les mots de plus de LMOT de longueur 

	printf "\n"
fi

if [ $occu -eq 1 ]
then

	#Affiche les occurences de chaque mot

	# On génère l'index en un seul enchaînement de commandes
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	sort |										#on trie
	uniq -c	|									#on ne garde qu'une seule instance de chaque mot
	awk '{$2=$2};1'|							#on supprime tous les grands espaces
	tr " " ","									#on remplace tous les espaces simples par des virgules (comma)

	printf "\n"
fi

if [ $totalOccu -eq 1 ]
then

	#Affiche le total des occurences

	# On génère l'index en un seul enchaînement de commandes
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	sort |										#on trie
	uniq -c	|									#on ne garde qu'une seule instance de chaque mot
	awk '{$2=$2};1'|							#on supprime tous les grands espaces
	tr -d " "|
	tr -d '[:alpha:]' |
	awk '{ SUM += $1} END { print SUM }' |
	tr -d "\n"
	echo ", nombre total d'occurences"

	printf "\n"
fi

if [[ $NMOT > 0 ]]
then

	#Affiche les occurences triees par ordre decroissant

	# On génère l'index en un seul enchaînement de commandes
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	sort |										#on trie
	uniq -c	|									#on ne garde qu'une seule instance de chaque mot
	awk '{$2=$2};1'|							#on supprime tous les grands espaces
	sort -k 1 -n -r |							#trie selon la premiere colonne complete
	head -n +$NMOT

	printf "\n"
fi


if [ $longMoy -eq 1 ]
then

	#Affiche la moyenne de la longeur de tous les mots (toutes les occurences sont comptees)

	# On génère l'index en un seul enchaînement de commandes
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	awk '{sum+=length} END { print sum/NR}' |	#on fait la somme de la taille de tous les mots,puis on divise par le nombre de mots
	tr -d "\n"									#on supprime le retour a la ligne pour le formatage
	echo " longueur moyenne"

	printf "\n"
fi

if [ $column -eq 1 ]
then

	#Affiche la longeur maximale de tous les mots

	tailleMMot=$(
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	awk '{ if ( length > L ) { L=length} }END{ print L}')

	tailleMOccu=$(
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	sort |
	uniq -c	|									#on ne garde qu'une seule instance de chaque mot
	awk '{$2=$2};1' |							#on supprime tous les grands espaces
	tr -d '[:alpha:]' |
	tr -d " " |
	awk '{ if ( length > L ) { L=length} }END{ print L}')

	nbLignes=$(
	# On génère l'index en un seul enchaînement de commandes
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	sort |
	uniq |
	awk '{sum+=1} END { print sum }' )		#on fait la somme de la taille de tous les mots,puis on divise par le nombre de mots

	printf "\n"

	#Affiche les occurences de chaque mot

	printf "*"
	for i in 1 2 .. $tailleMMot; do printf "-"; printf "-"; printf "-"; printf "-"; done;
	printf "+"
	for i in 1 2 .. $tailleMOccu; do printf "-"; printf "-"; printf "-"; printf "-"; done;
	printf "*\n"
	printf "| mot"
	for i in 1 2 .. $tailleMMot; do printf " "; done;
	printf "        | "
	printf "nb"
	for i in 1 2 .. $tailleMOccu; do printf " "; done;
	printf "         |\n"
	printf "|"
	for i in 1 2 .. $tailleMMot; do printf "-"; printf "-"; printf "-"; printf "-"; done;
	printf "+"
	for i in 1 2 .. $tailleMOccu; do printf "-"; printf "-"; printf "-"; printf "-"; done;
	printf "|\n"


	# On génère l'index en un seul enchaînement de commandes
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	sort |										#on trie
	uniq -c	|									#on ne garde qu'une seule instance de chaque mot
	awk '{$2=$2};1'|							#on supprime tous les grands espaces
	tr " " "," |								#on remplace tous les espaces simples par des virgules (comma)
	tr -d "," |
	tr " " "\n" |
	tr -d '[:alpha:]' > occurences

	# On génère l'index en un seul enchaînement de commandes
	head -n $FIN $TMP |							#on ne prend que les lignes avant la ligne $fin
	tail -n +$DEBUT |							#on ne prend, dans les lignes precedentes, que les lignes apres $debut
	tr -d "\r" |								#on supprimme tous les characteres \r
	grep -v '^[ \t]*[XIVI]\+[ \t]*$' |			#dans le texte restant, on affiche/selectionne tous les mots entiers ($) composes de \t puis les characteres IVX dans n'importe quel ordre et nombre puis \t
	tr '[:upper:]' '[:lower:]' |				#on transforme toutes les majuscules en minuscules
	tr -s '[:cntrl:][:punct:][:digit:] ' '\n' |	#on remplace tous characteres de controle, les ponctuations et les chiffres par des sauts a la ligne
	grep -v '^.$' |								#on selectionne tous les characteres sans point a la fin et toutes les lignes qu'avec des points
	grep -v '^$' |								#on selectionne toutes les lignes non vides
	sort |										#on trie
	uniq -c	|									#on ne garde qu'une seule instance de chaque mot
	awk '{$2=$2};1'|							#on supprime tous les grands espaces
	tr " " "," |								#on remplace tous les espaces simples par des virgules (comma)
	tr -d "," |
	tr " " "\n" |
	tr -d '[:digit:]' > mots

	i=1

	while [ $i -lt `expr $nbLignes + 1` ] 
	do
	printf "| " ;
	a=$(awk "NR==$i" mots) ;
	printf "$a" ;
	b=${#a} ;
	while [ $b -lt `expr $tailleMMot - 2` ]; do printf " "; b=`expr $b + 1`; done;
	printf "  | " ;
	a=$(awk "NR==$i" occurences) ;
	printf "$a" ;
	b=${#a} ;
	while [ $b -lt `expr $tailleMOccu + 6` ]; do printf " "; b=`expr $b + 1`; done;
	printf "      |\n" ;
	i=`expr $i + 1`
	done

	printf "*"
	for i in 1 2 .. $tailleMMot; do printf "-"; printf "-"; printf "-"; printf "-"; done;
	printf "+"
	for i in 1 2 .. $tailleMOccu; do printf "-"; printf "-"; printf "-"; printf "-"; done;
	printf "*\n"
fi


# Ne pas oublier de supprimer le fichier temporaire !
rm -f $TMP
