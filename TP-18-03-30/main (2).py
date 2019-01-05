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

class Node:
    """Node for Python Trie Implementation"""
    def __init__(self):
        self.word = None
        self.nodes = {} # dict of nodes
        
    def __get_all__(self):
        """Get all of the words in the trie"""
        x = []
        
        for key, node in self.nodes.items() : 
            if(node.word is not None):
                x.append(node.word)
            
            x += node.__get_all__()
                    
        return x
    
    def __str__(self):
        return self.word
    
    def __insert__(self, word, string_pos = 0):
        """Add a word to the node in a Trie"""
        current_letter = word[string_pos]
    
    # Create the Node if it does not already exist
        if current_letter not in self.nodes:
            self.nodes[current_letter] = Node();
    
        if(string_pos + 1 == len(word)):
            self.nodes[current_letter].word = word
        else:
            self.nodes[current_letter].__insert__(word, string_pos + 1)
    
        return True
    
    def __get_all_with_prefix__(self, prefix, string_pos):
        """Return all nodes in a trie with a given prefix or that are equal to the prefix"""
        x = []
        
        for key, node in self.nodes.items() : 
            # If the current character of the prefix is one of the nodes or we have
            # already satisfied the prefix match, then get the matches
            if(string_pos >= len(prefix) or key == prefix[string_pos]):
                if(node.word is not None):
                    x.append(node.word)
                    
            if(node.nodes != {}):
                if(string_pos + 1 <= len(prefix)):
                    x += node.__get_all_with_prefix__(prefix, string_pos + 1)
                else:
                    x += node.__get_all_with_prefix__(prefix, string_pos)
    
        return x       


class Trie:
   """Trie Python Implementation"""
  
   def __init__(self):
        self.root = Node()
        
   def insert(self, word):
        self.root.__insert__(word)
        
   def get_all(self):
        return self.root.__get_all__()

   def get_all_with_prefix(self, prefix, string_pos = 0):
        return self.root.__get_all_with_prefix__(prefix, string_pos)


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
    
    f = open("word.txt")
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
    
    
def main() : 
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
        
    os.system("pause")