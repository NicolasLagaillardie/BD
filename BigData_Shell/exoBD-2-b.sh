#!/usr/bin/env bash
# Fichier     : exoBD.sh
# Auteur      : Lag
#!/bin/bash
#
set -e

nbLignes=$(cat capteurs-20170404.csv | cut -d',' -f4 | cut -d' ' -f1 | cut -d'-' -f3 |  awk '{sum+=1} END { print sum }')

k=1

#parcours de tout le fichier, ligne par ligne, puis ajout de chacune des lignes au fichier correspondat a la date
while [ $k -lt `expr $nbLignes + 1` ]
do
	j=$(awk "NR==$k" capteurs-20170404.csv | cut -d',' -f4 | cut -d' ' -f1 )
	awk "NR==$k" capteurs-20170404.csv >> "$j.dat"

	k=`expr $k + 1`
done
