#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdint.h>
#include <errno.h>
#include <unistd.h>
#include <inttypes.h>
#include <float.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <string.h>
#define handle_error(msg) \
	do { perror(msg); exit(EXIT_FAILURE); } while (0)




//tri dans l'ordre lexico-graphique de deux paires
/*
const void * comparedouble( const void* a1, const void* a2,  const void* b1, const void* b2)
{
    int int_a1 = * ( (int*) a1 );
    int int_a2 = * ( (int*) a2 );
    int int_b1 = * ( (int*) b1 );
    int int_b2 = * ( (int*) b2 );

    if ( int_a1 == int_b1 && int_a2 == int_b2) return 0;
    else if ( ( int_a1 < int_b1 ) || ( int_a1 == int_b1 && int_a2 < int_b2) )return -1;
    else return 1;
}
*/

int compareDouble( const uint32_t int_a1, const uint32_t int_a2,  const uint32_t int_b1, const uint32_t int_b2)
{
    if ( int_a1 == int_b1 && int_a2 == int_b2) return 0;
    else if ( ( int_a1 < int_b1 ) || ( int_a1 == int_b1 && int_a2 < int_b2) )return -1;
    else return 1;
}


//display a two-dim array
void Display(uint32_t A[][2],int N)
{
    for(int R=0;R<N;R++)
    {
        printf("%d", A[R][0]);
        printf(",");
        printf("%d", A[R][1]);
        printf(";");
    } 
    printf("\n");
} 

/*
int twoToOneTable(int table1[], int table2[], int taille)
{
    int table3[taille][2] ;
    int i ;

    for(i = 0; i<= taille; i++)
    {
        table3[i][0] = table1[i] ;
	table3[i][1] = table2[i] ;
    }

    return table3 ;    

}
*/



//Tri-fusion sur le tableau tableau en cours. utiliser tri_fusion(int tableau[],int longueur)
void fusion(uint32_t tableau[][2],int deb1,int fin1,int fin2)
{
    uint32_t *table1;
    uint32_t *table2;
    int deb2=fin1+1;
    int compt1=deb1;
    int compt2=deb2;
    int i;

    table1=malloc((fin1-deb1+1)*sizeof(uint32_t));
    table2=malloc((fin1-deb1+1)*sizeof(uint32_t));

    //on recopie les éléments du début du tableau
    for(i=deb1; i<=fin1; i++)
    {
        table1[i-deb1]=tableau[i][0];
        table2[i-deb1]=tableau[i][1];
    }

    for(i=deb1; i<=fin2; i++)
    {
        if (compt1==deb2) //c'est que tous les éléments du premier tableau ont été utilisés
        {
            break; //tous les éléments ont donc été classés
        }
        else if (compt2==(fin2+1)) //c'est que tous les éléments du second tableau ont été utilisés
        {
            tableau[i][0]=table1[compt1-deb1]; //on ajoute les éléments restants du premier tableau
            tableau[i][1]=table2[compt1-deb1];
            compt1++;
        }
        else if (compareDouble(table1[compt1-deb1],table2[compt1-deb1],tableau[compt2][0],tableau[compt2][1]) == -1 )
        {
            tableau[i][0]=table1[compt1-deb1]; //on ajoute un élément du premier tableau
            tableau[i][1]=table2[compt1-deb1];
            compt1++;
        }
        else
        {
            tableau[i][0]=tableau[compt2][0]; //on ajoute un élément du second tableau
            tableau[i][1]=tableau[compt2][1];
            compt2++;
        }
    }
    free(table1);
    free(table2);
}


void tri_fusion_bis(uint32_t tableau[][2],int deb,int fin)
{
    if (deb!=fin)
    {
        int milieu=(fin+deb)/2;
        tri_fusion_bis(tableau,deb,milieu);
        tri_fusion_bis(tableau,milieu+1,fin);
        fusion(tableau,deb,milieu,fin);
    }
}

void tri_fusion(uint32_t tableau[][2],int longueur)
{
    if (longueur>0)
    {
        tri_fusion_bis(tableau,0,longueur-1);
    }
}

//echange deux paires dans un meme tableau
void swapInt(uint32_t table[][2], int a, int b)
{
    int temp1 = table[a][0], temp2 = table[a][1] ;

    table[a][0] = table[b][0] ;
    table[a][1] = table[b][1] ;
    table[b][0] = temp1 ;
    table[b][1] = temp2 ;
}

//echange deux paires dans deux tableaux
void swapExt(uint32_t table1[][2], int a, uint32_t table2[][2], int b)
{
    int temp1 = table1[a][0], temp2 = table1[a][1] ;

    table1[a][0] = table2[b][0] ;
    table1[a][1] = table2[b][1] ;
    table2[b][0] = temp1 ;
    table2[b][1] = temp2 ;
}


//percolation recursive (on suppose que le tableau est trie sauf l'elt qu'on a rajoute avant)
int percolation(uint32_t tableau[][2], int longueur, int position )
{
    if((position >= (longueur - 1)) || (compareDouble(tableau[position][0], tableau[position][1], tableau[position + 1][0], tableau[position + 1][1] ) < 1) )
    {
        return 0 ;
    }
    else
    {
        swapInt(tableau, position, position + 1 ) ;
        return percolation(tableau, longueur, position + 1) ;
    }
}


//fusion de deux tableaux : on veut que max(tableau1) < min(tableau2)
void fusionTables(uint32_t tableau1[][2], int longueur1, uint32_t tableau2[][2], int longueur2 )
{
    int i = 0 ;

    while ( i < longueur1 )
    {
        if (compareDouble(tableau1[i][0], tableau1[i][1], tableau2[0][0], tableau2[0][1]) == 1)
        {
            swapExt(tableau1, i, tableau2, 0) ;
            percolation(tableau2, longueur2, 0) ;
            i-- ;
        }
	i++ ;
    }
}


//#define FILEPATH "file.dat"

//definition de la structure utilisee
struct item { uint32_t u[2]; };

void item_print (struct item * v) /* ASCII output */
{ printf("%"PRIu32" %"PRIu32, v->u[0], v->u[1]); } /* item_print */

//Assigne les valeurs du pointeur,situe entre debut et fin, au tableau
void assignValuetoTab(uint32_t tableau[][2], struct item* pointeur, int debut, int fin){
    int i ;

    for(i=0; i<debut; i++){
	*pointeur++ ;
    }
    
    for(i=0; i<=(fin-debut); i++){
	tableau[i][0] = pointeur->u[0] ;
	tableau[i][1] = pointeur->u[1] ;
	*pointeur++ ;
    }
    
    for(i=0; i<=(fin-debut); i++){
	*pointeur-- ;
    }

}


//Assigne les valeurs du tableau au pointeur situe entre debut et fin
void assignValuetoPoint(uint32_t tableau[][2], struct item* pointeur, int debut, int fin){
    int i ;
    
    for(i=0; i<debut; i++){
	*pointeur++ ;
    }

    for(i=0; i<=(fin-debut); i++){
	pointeur->u[0] = tableau[i][0] ;
	pointeur->u[1] = tableau[i][1] ;
	*pointeur++ ;
    }
    
    for(i=0; i<=(fin-debut); i++){
	*pointeur-- ;
    }
}



int main(int argc, char *argv[])
{

    int i,j;
    int fd;
    void *map = 0;  /* mmapped array of int's */

    fd = open(argv[1], O_RDWR);
    if (fd == -1) {
	perror("Error opening file for reading");
	exit(EXIT_FAILURE);
    }

    int tailleMem ;
    printf("Entrer la memoire allouee pour la projection en terme de nombre de lignes : ") ;
    scanf("%d", &tailleMem) ;


    map = mmap(0, tailleMem, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (map == MAP_FAILED) {
	close(fd);
	perror("Error mmapping the file");
	exit(EXIT_FAILURE);
    }

    int count = sb.st_size/(2*sizeof(uint32_t) + sizeof('\n') + sizeof(size_t) + sizeof(" ")) ;
    printf("Il y a %d lignes dans le fichier\n",count) ;

    printf("Utiliser des empans de taille au plus memoire dispo/4 et dont la taille divise le nombre de lignes : ") ;

    int tailleEmp ;
    scanf("%d", &tailleEmp) ;
    
    //Pointeur vers premier elt
    struct item *start = map ;
    uint32_t table1[tailleEmp][2], table2[tailleEmp][2] ;
    int lim= (count/tailleEmp);

    printf("Nombres d'empans : %d\n",lim) ;
    printf("Taille des empans : %d\n",tailleEmp) ;

    if(count%tailleEmp != 0){
	printf("Il y a une erreur avec la taille des empans... arret du programme") ;
	return 0 ;
    }

    //Traitement principal : on part du premier element, on cree des empans de taille correcte, puis on les trie un a un avant de les fusionner avec une percolation 
    //Tri des empans
    for(i = 0; i<lim; i++){
	//on remplit un tableau correctement, qu'on trie ensuite
        assignValuetoTab(table1, start, i * tailleEmp, (i+1) * tailleEmp) ;
    	tri_fusion(table1, tailleEmp) ;
        assignValuetoPoint(table1, start, i * tailleEmp, (i+1) * tailleEmp) ;
    }

    printf("Tri fini\n") ;

    //fusion des empans
    for(j = 0; j<lim-1; j++){
	for(i = 0; i < lim-1; i++){
            //on remplit les tableaux correctement, puie on les fusionne correctement
            assignValuetoTab(table1, start, i * tailleEmp, (i+1) * tailleEmp) ;
            assignValuetoTab(table2, start, (i+1) * tailleEmp, (i+2) * tailleEmp) ;
            fusionTables(table1, tailleEmp, table2, tailleEmp) ;
            assignValuetoPoint(table1, start, i * tailleEmp, (i+1) * tailleEmp) ;
            assignValuetoPoint(table2, start, (i+1) * tailleEmp, (i+2) * tailleEmp) ;
	}
    }

    printf("Fusion finie\n") ;

    if (munmap(map, tailleMem) == -1) {
	perror("Error un-mmapping the file");
    }
    close(fd);
    return 0;
}

/*
int test()
{
    int test[4][2] = {{3,3},{1,2},{2,3},{4,5}} ;
    tri_fusion(test,4) ;
    Display(test,4) ;
    int test2[4][2] = {{4,7},{2,1},{2,4},{4,3}} ;
    percolation(test2,4,0) ;
    Display(test,4) ;
    Display(test2,4) ;
    fusionTables(test,4,test2,4) ;
    printf("\n");
    Display(test,4) ;
    Display(test2,4) ;
    return 0 ;
}
*/
