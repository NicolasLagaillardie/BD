#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Oct 15 08:34:08 2018

@author: lag
"""

import re

def hash_function(x): return hash(x) % 1000

def insert(table,input,value): table[hash_function(input)].append((input,value))

linksList = []

hashTable = [[]] * 1000

with open("enwiki-20110405-CategoryIdGraph.txt") as infile:
    for line in infile:
        
        elt = re.split(r'\t+', line.rstrip('\t'))
        subElt = re.split(r'\n+', elt[1].rstrip('\n'))
        
        linksList.append((int(elt[0]),int(subElt[0])))
        
        insert(hashTable,int(elt[0]),int(subElt[0]))
        
print(hashTable[0][:5])

eltsList = []

adjacentList = []
        
with open("enwiki-20110405-CategoryIdName.txt") as infile:
    for line in infile:
        
        elt = re.split(r'\t+', line.rstrip('\t'))
        subElt = re.split(r'\n+', elt[1].rstrip('\n'))
        
        eltsList.append(int(elt[0]))
        eltsList.append(subElt[0])
        
        adjacentList.append([])
        

print(eltsList[:10])

notLinked = []

for i in linksList :
    try:
        tempList = hashTable[hash_function(i[0])]
        adjacentList[tempList.index(i)].append(i[1])
    except:
        notLinked.append(i)
        
print(notLinked[:5])