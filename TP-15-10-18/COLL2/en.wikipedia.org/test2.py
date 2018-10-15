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
maxi = 0

hashTable = [[]] * 1000

with open("enwiki-20110405-CategoryIdGraph.txt") as infile:
    for line in infile:
        
        elt = re.split(r'\t+', line.rstrip('\t'))
        subElt = re.split(r'\n+', elt[1].rstrip('\n'))
        
        linksList.append((int(elt[0]),int(subElt[0])))
        
        maxi = max(maxi,int(elt[0]),int(subElt[0]))
        
print(linksList[:5])

eltsList = []

adjacentList = []

indexList = [-1] * (1 + maxi)

index = 0
        
with open("enwiki-20110405-CategoryIdName.txt") as infile:
    for line in infile:
        
        elt = re.split(r'\t+', line.rstrip('\t'))
        subElt = re.split(r'\n+', elt[1].rstrip('\n'))
        
        eltsList.append(int(elt[0]))
        eltsList.append(subElt[0])
        
        adjacentList.append([])  
        
        indexList[int(elt[0])] = index
        
        index += 1

print(eltsList[:10])

for i in linksList :
    adjacentList[i[0]].append(i[1])
    
print(adjacentList[:2])