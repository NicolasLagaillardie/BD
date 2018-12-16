from TP2_ACHARKI_LAGAILLARDIE import ArbrePrefixe

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

 
mots = ['banning', 'banned', 'banana', 'bad', 'baded', 'bananaed', 'cooking', 'cought', 'count']
T=creer_trie(mots)
print(T)

print('bad : ' + str(T.recherche('bad')))
print('baded : ' + str(T.recherche('baded')))
print('coco : ' + str(T.recherche('coco')))
print('banana : ' + str(T.recherche('banana')))
print('ba : ' + str(T.recherche('ba')))