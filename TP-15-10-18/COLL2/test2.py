#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Oct 15 08:34:08 2018

@author: lag
"""

import re

linksList = []
maxi = 0

with open("en.wikipedia.org/enwiki-20110405-CategoryIdGraph.txt") as infile:
    for line in infile:
        
        elt = re.split(r'\t+', line.rstrip('\t'))
        subElt = re.split(r'\n+', elt[1].rstrip('\n'))
        
        linksList.append((int(elt[0]),int(subElt[0])))
        
        maxi = max(maxi,int(elt[0]),int(subElt[0]))

URLList = []

indexList = [-1] * (1 + maxi)

vertices = []

indexElt = 0
        
with open("en.wikipedia.org/enwiki-20110405-CategoryIdName.txt") as infile:
    for line in infile:
        
        elt = re.split(r'\t+', line.rstrip('\t'))
        subElt = re.split(r'\n+', elt[1].rstrip('\n'))
        
        URLList.append(subElt[0])
        
        indexList[int(elt[0])] = indexElt
        
        vertices.append(int(elt[0]))
        
        indexElt += 1

print(URLList[:10])

adjacentList = [[] for i in range(indexElt + 1) ]

for i in linksList :
    adjacentList[indexList[i[0]]].append(i[1])
    
print(adjacentList[0])

"""Algo Tarjan"""

verticeIndex = [-1 for i in range(indexElt + 1) ]
verticeLowLink = [-1 for i in range(indexElt + 1) ]
verticeOnStack = [False for i in range(indexElt + 1) ]

index = 0
S = []


def strongconnect(vertice) :
    """wait for int"""
    """Set the depth index for v to the smallest unused index"""
    
    output = []

    global index

    tempIndex = indexList[vertice]
    
    verticeIndex[tempIndex] = index
    verticeLowLink[tempIndex] = index
    
    index += 1
    
    S.append(vertice)
    
    verticeOnStack[tempIndex] = True
    
    """Consider successors of v"""
    for i in adjacentList[tempIndex] :
        tempNeighbour = indexList[i]
        if (verticeIndex[tempNeighbour] == -1):
            strongconnect(i)
        elif (verticeOnStack[tempNeighbour]) :
            """Successor w is in stack S and hence in the current SCC
            If w is not on stack, then (v, w) is a cross-edge in the DFS tree and must be ignored
            Note: The next line may look odd - but is correct.
            It says w.index not w.lowlink; that is deliberate and from the original paper"""
            verticeLowLink[tempIndex] = min(verticeLowLink[tempIndex], verticeIndex[tempNeighbour])
    
    if (verticeLowLink[tempIndex] == verticeIndex[tempIndex]) :
        w = S.pop()
        verticeLowLink[indexList[w]]
        output.append(w)
        while (vertice != w) :
            w = S.pop()
            verticeLowLink[indexList[w]]
            output.append(w)
        return output
            
outputList = []
            
URLOutputList = []

for vertice in vertices :
    if (verticeIndex[indexList[vertice]] == -1) :
        temp = strongconnect(vertice)
        if(temp):
            outputList.append(temp)
            URLOutputList.append([])
            for elt in temp:
                URLOutputList[-1].append(URLList[indexList[elt]])