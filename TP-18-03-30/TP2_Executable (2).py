from TP2_ACHARKI_LAGAILLARDIE import ArbrePrefixe, PatriciaTrie

from multiprocessing.dummy import Pool as ThreadPool
import os
import time

def creer_trie(mots):

    # print("Lecture du dictionnaire")
    # fichier = open(dico, 'r')
    # liste_mots = fichier.readlines()
    # fichier.close()
    # print("Création du Trie")
    trie = ArbrePrefixe()
    for mot in mots:
        trie.inserer(mot)
    # print("Trie terminé")
    return trie

def creer_Patr(mots):

    # print("Lecture du dictionnaire")
    # fichier = open(dico, 'r')
    # liste_mots = fichier.readlines()
    # fichier.close()
    # print("Création du Trie")
    trie = PatriciaTrie()
    for mot in mots:
        trie.inserer(mot)
    # print("Trie terminé")
    return trie

def afficheSupp(trie) :
    print(trie)
    del trie

 
mots = ['banning', 'banned', 'banananad', 'bad', 'cooking', 'cought', 'count','banana']
T=creer_trie(mots)
print(T)
print('bad : ' + str(T.recherche('bad')))
print('baded : ' + str(T.recherche('baded')))
print('coco : ' + str(T.recherche('coco')))
print('banana : ' + str(T.recherche('banana')))
print('ba : ' + str(T.recherche('ba')))

P = creer_Patr(mots)
print(P)


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
    
def insert(i) :
    global trie
     
    trie.inserer(i)

def BuilTable() :
    """
    Construit la table. Utilise du multithreading
    """

    print("Construction de la table en cours")
    
    global doc
    global trie
    
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
    
    a = time.time()
    
    trie = ArbrePrefixe()
    
    pool = ThreadPool(16)
    
    pool.map(insert,doc)
    pool.close()
    pool.join()

    print(time.time() - a)
    
    print("Mots inseres dans l'arbre")
    
    
def main() :
    
    global trie 
    
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
                for k in j[:-1] :
                    text = text + k.split(" ")
            
            f.close()
            
        elif choice == "1" :
            text = input("Please insert your text here : ")
            
            text = text.split(" ")
            
    inside =[]
    outside =[]
    for i in text :
        
        if i != '' :
        
            r = trie.recherche(i)
            
            if r :
                inside.append(i)
            else:
                outside.append(i)
            
    print('Mots dans l\'arbre : ' + str(len(inside)))
    print('Mots pas dans l\'arbre : ' + str(len(outside)))
        
    os.system("pause")

