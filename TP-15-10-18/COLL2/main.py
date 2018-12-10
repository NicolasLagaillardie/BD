#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Oct 15 08:34:08 2018

@author: lag
"""

"""Import for spliting"""
import re
import time

index = 0
    
def main(filePath1, filePath2) :
    """ "en.wikipedia.org/enwiki-20110405-CategoryIdGraph.txt" / "en.wikipedia.org/enwiki-20110405-CategoryIdName.txt" """
    
    """linksList contains the edges"""
    """maxi contains the highest ID encountered"""
    linksList = []
    maxi = 0
    
    """this methods allows us to open big file by opening it little by little if it cannot be fully load in the RAM"""
    with open(filePath1) as infile:
        for line in infile:
                        
            elt = re.split(r'\t+', line.rstrip('\t'))   
            subElt = re.split(r'\n+', elt[1].rstrip('\n'))
            
            linksList.append((int(elt[0]),int(subElt[0])))
            
            maxi = max(maxi,int(elt[0]),int(subElt[0]))
            
    """URLList contains the names of the nodes"""
    """indexElt contains the line number"""
    """indexList contains the number of the line of each ID in the file"""
    """vertices contains the ID of the vertices"""    
    URLList = []
    
    indexList = [-1] * (1 + maxi)
    
    vertices = []
    
    indexElt = 0
    with open(filePath2) as infile:
        for line in infile:
            
            elt = re.split(r'\t+', line.rstrip('\t'))
            subElt = re.split(r'\n+', elt[1].rstrip('\n'))
            
            URLList.append(subElt[0])
            
            indexList[int(elt[0])] = indexElt
            
            vertices.append(int(elt[0]))
            
            indexElt += 1
    
    """adjacentList is the adjacent list"""
    adjacentList = [[] for i in range(indexElt) ]
    
    for i in linksList :
        adjacentList[indexList[i[0]]].append(i[1])
        
        
    print("--- files loaded : %s seconds ---" % (time.time() - start_time))

    """Algo Tarjan"""
    
    verticeIndex = [-1 for i in range(indexElt) ]
    verticeLowLink = [-1 for i in range(indexElt) ]
    verticeOnStack = [False for i in range(indexElt) ]
    
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
                verticeLowLink[tempIndex] = min(verticeLowLink[tempIndex], verticeLowLink[tempNeighbour])
            elif (verticeOnStack[tempNeighbour]) :
                """Successor w is in stack S and hence in the current SCC
                If w is not on stack, then (v, w) is a cross-edge in the DFS tree and must be ignored
                Note: The next line may look odd - but is correct.
                It says w.index not w.lowlink; that is deliberate and from the original paper"""
                verticeLowLink[tempIndex] = min(verticeLowLink[tempIndex], verticeIndex[tempNeighbour])
        
        if (verticeLowLink[tempIndex] == verticeIndex[tempIndex]) :
            w = S.pop()
            verticeOnStack[indexList[w]] = False
            output.append(w)
            while (vertice != w) :
                w = S.pop()
                verticeOnStack[indexList[w]] = False
                output.append(w)
            if(len(output) > 1) :
                outputList.append(output)
                URLOutputList.append([])
                for elt in output:
                    URLOutputList[-1].append(URLList[indexList[elt]])
                
    outputList = []
                
    URLOutputList = []
    
    for vertice in vertices :
        if (verticeIndex[indexList[vertice]] == -1) :
            strongconnect(vertice)
    
    return [outputList, URLOutputList]

""" Check if there are elements with same ID in two different Wikipedia sets"""
def testSame(filePath1, filePath2) :
    
    linesFile1 = []
    linesFile2 = []
    
    with open(filePath1) as infile:
        for line in infile:
            
            elt = re.split(r'\t+', line.rstrip('\t'))
            
            linesFile1.append(int(elt[0]))
            
    with open(filePath2) as infile:
        for line in infile:
            
            elt = re.split(r'\t+', line.rstrip('\t'))
            
            linesFile2.append(int(elt[0]))
            
    for i in linesFile1:
        if (i in linesFile2):
            return True
        
    return False

#print(testSame("en.wikipedia.org/enwiki-20110405-CategoryIdName.txt", "es.wikipedia.org/eswiki-20110420-CategoryIdName.txt"))

start_time = time.time()
result = main("en.wikipedia.org/enwiki-20110405-CategoryIdGraph.txt", "en.wikipedia.org/enwiki-20110405-CategoryIdName.txt")
#result = main("test/graph_test.txt", "test/name_test.txt")
#print(result[1])
print("--- number of circuits : %s --- " % len(result[1]))
print("--- total execution time : %s seconds ---" % (time.time() - start_time))