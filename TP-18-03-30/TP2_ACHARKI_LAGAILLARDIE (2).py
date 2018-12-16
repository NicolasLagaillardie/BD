class ArbrePrefixe:    
    def __init__(self, char=""):
        # Initialisation de la racine et des fils
        self.char = char
        self.fils = []
        # Si la chaine de caractère est situé la fin du mot
        self.fin_mot = False
    
    def inserer(self, mot):
        noeud = self
        for char in mot:
            existe_fils = False
            # Recherche du mot parmi les fils du noeud present
            for fils in noeud.fils:
                # Si le chaine de caractère se trouve dans un fils
                char2 = char+'*'
                if fils.char == char:
                    # On pointe sur le noeud qui contient la chaine de caractère 
                    noeud = fils
                    existe_fils = True
                    break
                if fils.char == char2 :
                    # On pointe sur le noeud qui contient la chaine de caractère 
                    noeud = fils
                    existe_fils = True
                    break
            # Sinon, on ajoute un nouveau fils
            if not existe_fils:
                nouveau_noeud = ArbrePrefixe(char)
                noeud.fils.append(nouveau_noeud)
                # On pointe sur le nouveau fils
                noeud = nouveau_noeud
        # Si tout est bon, on marque comme la fin du mot
        noeud.char = noeud.char+'*'
        noeud.fin_mot = True
        
    def __str__(self):
        rows = [ "{0}".format(self.char) ]
        for c in self.fils:
            s = str(c)
            lines = [ "    " + l for l in s.split("\n") ]
            rows.extend(lines)
        return "\n".join(rows)

    def recherche(self, mot):
        noeud = self
        for char in mot :
            existe_fils = False
            # Recherche du mot parmi les fils du noeud present
            for fils in noeud.fils:
                # Si le chaine de caractère se trouve dans un fils
                char2 = char+'*'
                if fils.char == char:
                    # On pointe sur le noeud qui contient la chaine de caractère 
                    noeud = fils
                    existe_fils = True
                    break
                if fils.char == char2 :
                    # On pointe sur le noeud qui contient la chaine de caractère 
                    noeud = fils
                    existe_fils = True
                    break
            # Si le mot nexiste pas dans l'arbre
            if not existe_fils :
                fils.char = fils.char[:-1]
                return False
        return '*' in fils.char
                
                


class PatriciaTrie:    
    def __init__(self, char=""):
        # Initialisation de la racine et des fils
        self.char = char
        self.fils = []
        # Si la chaine de caractère est situé la fin du mot
        self.fin_mot = False
    
    def inserer(self, mot):
        noeud = self
        offset = 0
        for i in range(len(mot)):
            existe_fils = False
            # Recherche du mot parmi les fils du noeud present
            for fils in noeud.fils:
                # Si le chaine de caractère se trouve dans un fils
                if fils.char[i-offset] == mot[i]:
                    # On pointe sur le noeud qui contient la chaine de caractère
                    while fils.char[i-offset] == mot[i] :
                        i+=1
                    noeud = fils
                    existe_fils = True
                    break
            # Sinon, on ajoute un nouveau fils
            if not existe_fils:
                nouveau_noeud = ArbrePrefixe(mot[i:])
                noeud.fils.append(nouveau_noeud)
                # On pointe sur le nouveau fils
                noeud = nouveau_noeud
        # Si tout est bon, on marque comme la fin du mot
        noeud.char = noeud.char+'*'
        noeud.fin_mot = True
        
    def __str__(self):
        rows = [ "{0}".format(self.char) ]
        for c in self.fils:
            s = str(c)
            lines = [ "    " + l for l in s.split("\n") ]
            rows.extend(lines)
        return "\n".join(rows)

    def recherche(self, mot):
        noeud = self
        for char in mot :
            existe_fils = False
            # Recherche du mot parmi les fils du noeud present
            for fils in noeud.fils:
                # Si le chaine de caractère se trouve dans un fils
                char2 = char+'*'
                if fils.char == char:
                    # On pointe sur le noeud qui contient la chaine de caractère 
                    noeud = fils
                    existe_fils = True
                    break
                if fils.char == char2 :
                    # On pointe sur le noeud qui contient la chaine de caractère 
                    noeud = fils
                    existe_fils = True
                    break
            # Si le mot nexiste pas dans l'arbre
            if not existe_fils :
                fils.char = fils.char[:-1]
                return False
        return '*' in fils.char
        
