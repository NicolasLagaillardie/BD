#!/usr/bin/env bash
# Fichier     : indexeur.sh.dist
# Auteur      : Xavier Serpaggi <serpaggi@emse.fr>
#!/bin/bash
# 		téléchargé via l'URL passée en paramètre.
#
set -e

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

TYPE="q" ;
ref_capteur="q" ;

while getopts 'dht:r:' option
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
		t)
			TYPE=$2
			;;
		r)
			ref_capteur=$4
			;;
			
	esac
done

if [ "$TYPE" == "q" ] || [ "$ref_capteur" == "q" ]
then
	usage $0
fi

if [ "$TYPE" == "TEMP" ] || [ "$TYPE" == "HUM" ] || [ "$TYPE" == "LUM" ]
then

	nbLignes=$(cat capteurs-20170404.csv | cut -d',' -f4 | cut -d' ' -f1 | cut -d'-' -f3 |  awk '{sum+=1} END { print sum }')

	k=1

	#parcours de tout le fichier, ligne par ligne, puis ajout de chacune des lignes au fichier correspondat a la date
	while [ $k -lt `expr $nbLignes + 1` ]
	do
		j=$(awk "NR==$k" capteurs-20170404.csv | cut -d',' -f2 | cut -d' ' -f2 )

		if [ "$j" == "$ref_capteur" ]
		then
		
			l=$(awk "NR==$k" capteurs-20170404.csv | cut -d',' -f5)
			c=$(awk "NR==$k" capteurs-20170404.csv | cut -d',' -f6)
			if [ "$TYPE" == "$l" ]; then
				 echo "$c" >> "$ref_capteur.dat"
			elif [ "$TYPE" == "HUM" -a "$l" == "HUMIDITY" ]; then
				 echo "$c" >> "$ref_capteur.dat"
			elif [ "$TYPE" == "LUM" -a "$l" == "LUMINOSITY" ]; then
				 echo "$c" >> "$ref_capteur.dat"
			fi

		fi

		k=`expr $k + 1`

	done

else
	usage $0
fi
	
