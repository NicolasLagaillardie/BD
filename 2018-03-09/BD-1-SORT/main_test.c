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

    int i,k,l;
    int fd;
    void *map = 0;  /* mmapped array of int's */
    struct stat sb;
    off_t offset;

    fd = open(argv[1], O_RDWR);
    if (fd == -1) {
	perror("Error opening file for reading");
	exit(EXIT_FAILURE);
    }

    if (fstat(fd, &sb) == -1)           /* To obtain file size */
        handle_error("fstat");

    off_t tailleMem ;
    int nbPgs ;
    printf("Entrer le nombre de pages memoire allouees pour la projection : ") ;
    scanf("%d", &nbPgs) ;
    printf("Taille d'une page %ld \n",sysconf (_SC_PAGESIZE)) ;
    tailleMem = sysconf (_SC_PAGESIZE) * nbPgs ;
    printf("Taille allouee %ld \n", tailleMem) ;
    
	for(k=0;k<=(sb.st_size/tailleMem);k++){
		  
		offset = k * tailleMem ;
		
		printf("Taille offset %ld \n", offset) ;

		map = mmap(0, tailleMem, PROT_READ | PROT_WRITE, MAP_SHARED, fd, offset);
		if (map == MAP_FAILED) {
			close(fd);
			perror("Error mmapping the file");
			exit(EXIT_FAILURE);
		}
	
		//Pointeur vers premier elt
		struct item *start = map ;
	
		//obtenir le nombre de lignes stockees dans la projection
		int count = 0 ;
		while(start->u[0] != 0 && start->u[1] != 0){
		count++;
		*start++;
		}
	
		for(i=0;i<count;i++){
		*start--;
		}
	
	
		uint32_t table1[count/2][2], table2[count/2 + count%2][2] ;
	
		//Traitement principal : on part du premier element, on cree des empans de taille correcte, puis on les trie un a un avant de les fusionner avec une percolation 
		//Tri des empans
		//on remplit un tableau correctement, qu'on trie ensuite
		assignValuetoTab(table1, start, 0, count/2) ;
		assignValuetoTab(table2, start, count/2 + 1 , count/2 + 1 + count%2) ;
		tri_fusion(table1, count/2) ;
		tri_fusion(table2, count/2 + count%2) ;
		assignValuetoPoint(table1, start, 0, count/2) ;
		assignValuetoPoint(table2, start, count/2 + 1 , count/2 + 1 + count%2) ;
			
	}
	
	offset = 0 ;

	for(l=0; l<=(sb.st_size/tailleMem);l++){
		for(k=0;k<=(sb.st_size/tailleMem);k++){
		  
			offset = offset + tailleMem/2 ;

			map = mmap(0, tailleMem, PROT_READ | PROT_WRITE, MAP_SHARED, fd, offset);
			if (map == MAP_FAILED) {
				close(fd);
				perror("Error mmapping the file");
				exit(EXIT_FAILURE);
			}
	
			//Pointeur vers premier elt
			struct item *start = map ;
	
			//obtenir le nombre de lignes stockees dans la projection
			int count = 0 ;
			while(start->u[0] != 0 && start->u[1] != 0){
			count++;
			*start++;
			}
	
			for(i=0;i<count;i++){
			*start--;
			}
	
	
			uint32_t table1[count/2][2], table2[count/2 + count%2][2] ;
		
			//on remplit les tableaux correctement, puie on les fusionne correctement
			assignValuetoTab(table1, start, 0, count/2) ;
			assignValuetoTab(table2, start, count/2 + 1 , count/2 + 1 + count%2);
			fusionTables(table1, count/2, table2, count/2 + count%2) ;
			assignValuetoPoint(table1, start, 0, count/2) ;
			assignValuetoPoint(table2, start, count/2 + 1 , count/2 + 1 + count%2) ;

			if (munmap(map, tailleMem) == -1) {
			perror("Error un-mmapping the file");
			}
		}
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
