# -*- coding: utf-8 -*-

#!/usr/bin/env python

"""
Spyder Editor

This is a temporary script file.
"""

from copy import deepcopy
from multiprocessing.dummy import Pool as ThreadPool
import os
import time


"""
from random import randint

G701 = [52, 27, 359, 1, 21, 57, 2, 43, 11, 32, 12, 34, 48, 7, 9, 31, 11, 31, 9, 3,38, 20, 23, 46, 20, 33, 1, 35, 359, 22, 17, 701, 22, 10, 1, 49, 33, 8, 56, 6, 58, 6, 46, 17, 52, 16, 11, 54, 52, 10, 26, 10, 30, 359, 17, 39, 55, 12, 46, 29, 0]
S1701 = [52, 16, 58, 42, 17, 4, 57, 42, 2, 33, 35, 13, 26, 33, 54, 43, 35, 46, 56, 55, 33, 16, 23, 27, 51, 60, 7, 10, 25, 28, 45, 60, 41, 3, 35, 21, 32, 37, 15, 701, 47, 55, 42, 27, 19, 46, 13, 19, 13, 35, 53, 18, 37, 52, 39, 7, 55, 37, 701, 12]
S2701 = [40, 4, 52, 47, 19, 18, 49, 10, 36, 46, 52, 49, 19, 14, 18, 29, 56, 46, 1, 12, 22, 35, 58, 56, 46, 33, 12, 41, 0, 31, 40, 5, 12, 55, 50, 1, 39, 29, 32, 50, 51, 45, 38, 56, 16, 10, 701, 14, 13, 53, 359, 43, 56, 32, 30, 16, 31, 9, 9, 7]

G359 = [24, 53, 47, 17, 26, 11, 41, 3, 25, 44, 24, 20, 23, 54, 31, 28, 8, 39, 11, 13, 38, 16, 9, 27, 1, 24, 41, 26, 47, 17, 43, 10, 39, 49, 35, 8, 54, 56, 27, 3, 6, 26, 44, 27, 359, 21, 24, 50, 34, 27, 4, 19, 40, 12, 8, 41, 56, 6, 7]
S1359 = [41, 46, 44, 3, 46, 51, 39, 23, 3, 29, 8, 33, 21, 22, 3, 52, 45, 22, 40, 45, 20, 18, 3, 43, 53, 20, 40, 56, 13, 43, 30, 1, 33, 56, 57, 24, 43, 50, 35, 25, 11, 20, 22, 41, 44, 35, 18, 52, 43, 39, 359, 0, 50, 25, 44, 28, 8, 41, 40]
S2359 = [15, 3, 41, 7, 50, 21, 8, 9, 11, 8, 45, 28, 15, 359, 27, 32, 23, 0, 3, 35, 44, 51, 56, 46, 13, 15, 23, 14, 36, 4, 40, 24, 48, 3, 0, 52, 58, 29, 40, 9, 58, 47, 44, 13, 54, 9, 18, 15, 39, 57, 23, 0, 32, 38, 8, 51, 12, 29, 32]

save = [[412, 297, 20, 74, 496, 449, 67, 678, 644, 398, 534, 3, 426, 469, 633, 648, 22, 87, 378, 98, 142, 387, 476, 394, 270, 329, 604, 24, 397, 570, 620, 214, 446, 680, 598, 146, 246, 457, 618, 471, 519, 0, 197, 210, 569, 95, 38, 110, 377, 191, 522, 69, 339, 661, 228, 566, 470, 447, 680, 340, 438, 509, 470, 541, 104, 631, 438, 174, 0, 504, 649, 301, 564, 1, 78, 230, 99, 83, 92, 657, 507, 263, 218, 561, 605, 224, 165, 131, 159, 20, 96, 660, 484, 166, 386, 34, 236, 576, 456, 47, 658, 426, 447, 384, 417, 33, 649, 682, 415, 246, 505, 444, 365, 528, 72, 184, 560, 111, 332, 401, 210, 219, 598, 301, 659, 590, 107, 332, 601, 255, 400, 18, 208, 86, 365, 92, 543, 311, 312, 558, 463, 601, 111, 569, 368, 518, 642, 430, 326, 509, 374, 13, 340, 314, 297, 78, 270, 519, 226, 688, 421, 328, 223, 409, 66, 400, 355, 434, 2, 586, 626, 172, 668, 213, 292, 396, 100, 48, 25, 14, 403, 100, 492, 291, 274, 696, 46, 278, 235, 108, 476, 230, 359, 198, 197, 571, 346, 414, 428, 457, 564, 444, 226, 21, 135, 490, 88, 428, 501, 188, 392, 655, 647, 564, 568, 18, 81, 612, 407, 140, 364, 280, 206, 16, 249, 586, 259, 265, 234, 123, 33, 445, 164, 365, 396, 611, 440, 333, 229, 341, 7, 693, 97, 108, 277, 554, 354, 140, 440, 54, 230, 502, 583, 477, 634, 39, 590, 537, 306, 32, 442, 156, 71, 491, 3, 102, 378, 549, 88, 496, 325, 38, 602, 202, 342, 588, 670, 321, 549, 249, 345, 198, 39, 243, 168, 61, 405, 90, 201, 399, 483, 504, 157, 134, 386, 357, 337, 72, 442, 572, 651, 306, 51, 339, 608, 63, 392, 379, 355, 585, 690, 96, 273, 687, 416, 389, 217, 451, 26, 345, 187, 570, 76, 336, 227, 245, 234, 183, 497, 562, 565, 263, 231, 353, 562, 90, 385, 326, 187, 292, 267, 436, 108, 102, 393, 335, 328, 325, 93, 247, 394, 580, 405, 528, 92, 696, 294, 423, 505, 16, 555, 23, 582, 52, 247, 116, 367, 203, 128, 490, 257, 78, 588, 642, 300, 475, 672, 665, 491, 45, 314, 152, 243, 176, 326, 188, 431, 4, 244, 46, 369, 168, 354, 195, 86, 457, 359, 460, 554, 365, 142, 156, 333, 292, 512, 415, 17, 691, 520, 260, 618, 654, 132, 139, 257, 486, 307, 110, 243, 345, 691, 357, 501, 434, 469, 546, 22, 7, 219, 399, 404, 371, 109, 122, 339, 90, 91, 404, 85, 192, 513, 240, 418, 443, 473, 551, 332, 262, 531, 19, 233, 320, 414, 440, 417, 209, 399, 218, 86, 181, 59, 299, 4, 387, 598, 153, 311, 573, 355, 307, 305, 426, 606, 634, 387, 589, 315, 0, 568, 285, 408, 13, 552, 625, 162, 589, 537, 577, 211, 330, 535, 89, 450, 130, 138, 218, 403, 532, 308, 274, 455, 676, 589, 137, 497, 472, 38, 438, 258, 278, 341, 301, 611, 529, 180, 91, 305, 619, 186, 193, 121, 504, 240, 395, 37, 297, 685, 253, 542, 129, 290, 547, 378, 112, 347, 161, 448, 506, 290, 638, 105, 304, 205, 185, 180, 30, 115, 183, 510, 553, 406, 65, 588, 15, 327, 200, 176, 358, 555, 433, 530, 90, 506, 674, 428, 177, 618, 313, 193, 422, 61, 183, 416, 232, 290, 488, 680, 473, 437, 530, 678, 171, 105, 605, 353, 83, 371, 460, 611, 107, 7, 557, 297, 431, 343, 39, 629, 416, 369, 477, 297, 153, 553, 646, 583, 259, 643, 477, 698, 665, 255, 18, 274, 40, 154, 285, 268, 42, 509, 324, 547, 689, 12, 694, 564, 152, 191, 82, 117, 359, 577, 153, 569, 19, 191, 414, 414, 41, 395, 664, 114, 344, 37, 608, 601, 502, 592, 133, 284, 359, 538, 512, 275, 27, 612, 319, 411, 361, 139, 387, 513, 449, 224, 692, 398, 329, 612, 692, 620, 700, 278, 461, 43, 550, 220, 163, 36, 480, 666, 373, 298, 336, 545, 532, 651, 275, 519, 298, 335, 152, 85, 129, 690, 507, 38, 302, 23, 0, 265, 644, 337], [41, 690, 656, 515, 162, 117, 223, 36, 551, 56, 55, 646, 4, 294, 500, 188, 642, 227, 108, 593, 527, 410, 142, 321, 654, 551, 14, 469, 274, 391, 202, 356, 570, 544, 585, 218, 673, 86, 608, 190, 502, 39, 593, 397, 390, 341, 527, 147, 511, 178, 387, 61, 506, 287, 484, 392, 575, 698, 584, 509], [536, 382, 405, 245, 140, 342, 91, 268, 637, 92, 303, 298, 556, 604, 175, 669, 18, 48, 212, 698, 29, 195, 197, 637, 482, 84, 544, 375, 509, 29, 451, 180, 256, 10, 348, 380, 681, 114, 423, 298, 575, 430, 550, 568, 247, 304, 549, 425, 276, 51, 592, 333, 131, 532, 493, 382, 592, 657, 534, 415], [252, 280, 308, 69, 238, 183, 228, 223, 146, 301, 137, 91, 193, 129, 70, 169, 324, 174, 238, 107, 106, 56, 153, 264, 350, 222, 211, 346, 64, 334, 216, 166, 63, 262, 265, 263, 105, 91, 142, 184, 170, 165, 235, 85, 353, 32, 161, 179, 221, 359, 136, 4, 205, 55, 174, 38, 287, 269, 74, 240, 43, 73, 248, 341, 211, 57, 195, 58, 134, 231, 353, 347, 218, 152, 313, 144, 92, 148, 72, 219, 314, 210, 343, 150, 81, 359, 297, 48, 294, 49, 129, 180, 228, 136, 351, 202, 105, 3, 108, 240, 54, 223, 145, 121, 2, 72, 122, 329, 137, 221, 110, 126, 339, 142, 257, 95, 107, 221, 247, 268, 167, 194, 273, 45, 143, 100, 308, 12, 290, 146, 290, 53, 329, 243, 345, 251, 75, 254, 244, 38, 348, 287, 300, 221, 47, 55, 356, 105, 45, 272, 75, 329, 18, 147, 82, 40, 58, 354, 265, 329, 206, 328, 171, 114, 300, 269, 141, 207, 182, 175, 334, 164, 180, 336, 66, 205, 244, 130, 195, 54, 111, 320, 65, 85, 100, 336, 336, 205, 115, 191, 182, 85, 244, 246, 119, 183, 348, 283, 43, 48, 71, 125, 134, 312, 5, 134, 46, 38, 62, 27, 104, 150, 225, 179, 347, 330, 295, 25, 31, 34, 301, 100, 263, 253, 199, 196, 358, 226, 206, 44, 121, 215, 347, 142, 86, 228, 295, 133, 294, 13, 54, 191, 134, 93, 192, 192, 205, 318, 158, 293, 281, 277, 337, 275, 155, 132, 219, 49, 0, 171, 35, 278, 101, 105, 236, 183, 293, 44, 290, 186, 44, 61, 221, 357, 250, 69, 224, 306, 306, 72, 19, 93, 39, 37, 304, 133, 36, 144, 247, 74, 208, 266, 181, 37, 261, 199, 45, 261, 86, 7, 173, 155, 58, 293, 155, 263, 296, 153, 5, 314, 213, 44, 282, 351, 287, 327, 24, 124, 4, 280, 351, 55, 120, 150, 161, 144, 173, 273, 303, 157, 185, 140, 128, 46, 295, 215, 232, 331, 72, 312, 147, 179, 38, 322, 16, 52, 19, 46, 57, 20, 152, 58, 152, 185, 73, 219, 274, 252, 208], [80, 328, 100, 6, 300, 69, 171, 338, 347, 265, 282, 310, 141, 49, 0, 358, 325, 319, 71, 184, 336, 208, 120, 182, 242, 177, 120, 342, 180, 93, 57, 345, 312, 130, 87, 258, 284, 19, 194, 266, 132, 142, 90, 14, 9, 193, 98, 306, 288, 94, 181, 208, 153, 142, 115, 46, 233, 30], [98, 249, 126, 126, 342, 165, 156, 359, 160, 54, 1, 129, 206, 320, 311, 322, 154, 342, 141, 164, 177, 100, 67, 174, 149, 220, 185, 99, 245, 121, 355, 267, 268, 149, 9, 308, 275, 177, 334, 248, 177, 193, 236, 233, 178, 353, 219, 211, 166, 269, 192, 184, 352, 277, 345, 203, 239, 295]]

def hash_f(key, T, G, alphabet):
    return sum(T[i % len(T)] * ord(c) for i, c in enumerate(str(key))) % len(G)

def perfect_hash(key,G,S1,S2, alphabet):
    return (G[hash_f(key, S1, G, alphabet)] + G[hash_f(key, S2, G, alphabet)]) % len(G)

def  :
    
    #Perfect hash function
    
    toHash = 0
    for j in i :
        if j in alphabet :
            toHash += alphabet.index(j)
        else :
            return -1
        
    if mod == 701 :
        return perfect_hash(toHash,G701,S1701,S2701,alphabet)
    else:
        return perfect_hash(toHash,G359,S1359,S2359,alphabet)
        
"""
def modHash(mod,i) :
    """
    Fonction de hashage lineaire
    """
    
    toHash = 0
    for j in i :
        if j in alphabet :
            toHash += alphabet.index(j)
        else :
            """
            Permet d'accelerer la recherche en supprimant d'office les mots dont au moins une lettre n'est pas dans l'alphabet
            """
            return -1
    
    return toHash%mod

def constrDoc(i) :
    """
    Permet de construire la liste des mots du fichier : ajoute le mot i a la liste doc
    """
    
    global doc
    
    doc.append(i[:-1])
    
def constrAlphabet(i) :
    """
    ajoute chaque lettre de i a alphabet
    """
    
    global alphabet
    
    for j in range(0,len(i)) :
        if i[j] not in i[:j] :
            alphabet.append(i[j])
                
def constrTable(i):
    """
    Insere correctement l'element i dans la table
    """
 
    global alphabet
    global table701
    
    #359 -> taille table hachage 1
    #701 -> taille table hachage 2
    
    resultat1 = modHash(701,i)
    resultat2 = modHash(359,i)
    table701[resultat2][resultat1].append(i)

def auxUniq(table1,table2):
    """
    fonction auxiliaire de Uniq
    """
    
    temp = set()
    
    for i in table1 :
        temp.add(i)
    
    for i in table2 :
        temp.add(i)
    
    return list(temp)

def uniq(table):
    """
    renvoie un tableau extrait de l'input qui ne contient que des valeurs uniques. Utilise de la recursivite et le principe de diviser pour regner
    """
    if len(table) <= 1 :
        return table
    else :
        return auxUniq(uniq(table[:len(table)//2]),uniq(table[len(table)//2:]))


def testCollision(table) :
    """
    renvoie le nombre maximal de collisions
    """
    maxi = 0
    
    for i in table :
        for j in i :
            if maxi < len(j) :
                maxi = len(j)
            
    return maxi
  
    
"""
def reducCollision():
    
    #Tentative pour trouver les listes qui minimisent les collisions dans la perfect hash function
    
    
    global table701
    global G701
    global S1701
    global S2701
        
    global G359
    global S1359
    global S2359
    
    global value
    global maxi
    
    i = 0
    
    G701 =  [randint(0,701) for i in range(0,701)]
    S1701 = [randint(0,701) for i in range(0,700)]
    S2701 = [randint(0,701) for i in range(0,700)]
    
    G359 = [randint(0,359) for i in range(0,359)]
    S1359 = [randint(0,359) for i in range(0,358)]
    S2359 = [randint(0,359) for i in range(0,358)]
    
    ancien = deepcopy(G701 + S1701 + S2701 + G359 + S1359 + S2359)
    
    value = deepcopy([G701,S1701,S2701,G359,S1359,S2359])
    
    valueToChange = [k for k in range(len(ancien))]
    a = randint(0,len(valueToChange)-1)
    
    r = testCollision(table701)
    
    save = 0
    
    while valueToChange != [] :
    
        maxi = 20000
        
        error = 1000
        k = 0
        
        print("a = "+str(a))
        
        while k < 10 :
        
            print("Essai numero "+str(i))
            
            if valueToChange[a] < 700+701+700 :
                ancien[valueToChange[a]] = randint(0,701)
            else:
                ancien[valueToChange[a]] = randint(0,359)
            
            G701 =  ancien[:701]
            S1701 = ancien[701:700+701]
            S2701 = ancien[700+701:700+700+701]
            
            G359 = ancien[700+701+700:700+700+701+359]
            S1359 = ancien[700+701+700+359:358+700+700+701+359]
            S2359 = ancien[700+701+700+359+358:]
            
            BuilTable()
            r = testCollision(table701)
            
            if r < maxi :
                maxi = deepcopy(r)
                value = deepcopy([G701,S1701,S2701,G359,S1359,S2359])
                save = deepcopy(save)
                k = 0
                print("maxi : "+str(maxi))
            elif abs(r - maxi) <= error :
                k += 1
                error = abs(r - maxi)
                print("error : "+str(error))
            else :
                k = 0
            
            i = i + 1          
            
        ancien[valueToChange[a]] = deepcopy(save)
            
        valueToChange.pop(a)
        a = randint(0,len(valueToChange)-1)
        
"""
        

def BuilTable() :
    """
    Construit la table. Utilise du multithreading
    """

    print("Construction de la table en cours")
    
    global alphabet
    global table701
    global temp
    global alphabet
    global doc
    
    temp = [[]] * 701
    table701 = [deepcopy(temp) for i in range(0,359)]
    
    f = open("word2.txt")
    temp = f.readlines()
    f.close()
    
    pool = ThreadPool(16)
    
    a = time.time()
    
    doc = []
    pool.map(constrDoc,temp)
    pool.close()
    pool.join()
    
    print(time.time() - a)
    print("Mots recuperes du fichier")
    
    pool = ThreadPool(16)
    
    alphabet = []
    pool.map(constrAlphabet,doc)
    pool.close()
    pool.join()
    
    a = time.time()
    
    alphabet = uniq(alphabet)
    
    print(time.time() - a)
    
    print("Alphabet construit")
    
    a = time.time()
    
    pool1 = ThreadPool(16)
    
    pool1.map_async(constrTable,doc)
    pool1.close()
    pool1.join()
    
    print( time.time() - a)
    
    print("Table construite")
    
    
BuilTable()
 
choice = "2"

"""
Si l'utilisateur decide de rentrer du texte ou d'analyser un fichier
"""
while choice not in ["0","1"] :
    
    choice = input("Do you want to analyse a file or input a text ? (0/1) : ")

    if choice == "0" :        
        name = input("Please insert the path and name of your file here : ")
        f = open(name)
    
        text = []
        
        temp = f.readlines()
        
        for i in temp :
            j = i.split("\n")
            for k in j :
                text = text + k.split(" ")
        
        f.close()
        
    elif choice == "1" :
        text = input("Please insert your text here : ")
        
        text = text.split(" ")
    
"""
Variables qui vont stocker le mot dans le dictionnaire et ceux qui n'y sont pas
"""
insideW =[]
outsideW =[]

for i in text :
    
    if i != '' :
    
        lvl1 = modHash(359,i)
        lvl2 = modHash(701,i)
        
        if lvl1 == -1 or lvl2 == -1 :
            outsideW.append(i)
        
        else :
            r=0
            
            for j in table701[lvl1][lvl2] :
                if j == i  :
                    insideW.append(i)
                    r=1
                    break
            if r == 0 :
                outsideW.append(i)
        
print("Number of your words in our dictionnary : " + str(len(insideW)))
#print(insideW)
print("Number of your words not in our dictionnary : " + str(len(outsideW)))
#print(outsideW)
os.system("pause")