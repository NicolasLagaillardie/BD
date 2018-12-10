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

//echange deux paires dans un meme tableau, 2 colonnes
void swapInt(uint32_t table[][2], int a, int b)
{
    uint32_t temp1 = table[a][0], temp2 = table[a][1] ;

    table[a][0] = table[b][0] ;
    table[a][1] = table[b][1] ;
    table[b][0] = temp1 ;
    table[b][1] = temp2 ;
}

//echange deux paires dans un meme tableau, 3 colonnes
void swapInt3(uint32_t table[][3], int a, int b)
{
    uint32_t temp1 = table[a][0], temp2 = table[a][1], temp3 = table[a][2] ;

    table[a][0] = table[b][0] ;
    table[a][1] = table[b][1] ;
    table[a][2] = table[b][2] ;
    table[b][0] = temp1 ;
    table[b][1] = temp2 ;
    table[b][2] = temp3 ;
}

//echange deux paires dans deux tableaux
void swapExt(uint32_t table1[][2], int a, uint32_t table2[][2], int b)
{
    uint32_t temp1 = table1[a][0], temp2 = table1[a][1] ;

    table1[a][0] = table2[b][0] ;
    table1[a][1] = table2[b][1] ;
    table2[b][0] = temp1 ;
    table2[b][1] = temp2 ;
}

//echange 2 paires
void swap(uint32_t a1, uint32_t a2, uint32_t b1, uint32_t b2)
{
    uint32_t temp1 = a1, temp2 = a2;
    a1 = b1;
    a2 = b2;
    b1 = temp1;
    b2 = temp2;
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

void item_write (struct item * v) /* binary output */
{ fwrite(v, sizeof(struct item), 1, stdout); } /* item_write */

//Assigne les valeurs du pointeur,situe entre debut et fin, au tableau
void assignValuetoTab(uint32_t tableau[][2], struct item* pointeur, int debut, int fin){
    int i ;

    for(i=0; i<debut; i++){
	pointeur++ ;
    }
    
    for(i=0; i<=(fin-debut); i++){
	tableau[i][0] = pointeur->u[0] ;
	tableau[i][1] = pointeur->u[1] ;
	pointeur++ ;
    }
    
    for(i=0; i<=(fin-debut); i++){
	pointeur-- ;
    }

}

//percolation-up dans tas-min
void percoUp(uint32_t tableau[][3], int indElt){
	
	while ((indElt > 0) && ((compareDouble(tableau[(indElt-1)/2][0], tableau[(indElt-1)/2][1], tableau[indElt][0], tableau[indElt][1]) == 1))){
		
		swapInt3(tableau, indElt, (indElt-1)/2) ;
		indElt = (indElt-1)/2 ; 

	}
}

//percolation-down dans tas-min
void percoDown(uint32_t tableau[][3], int indElt, int taille){
	
	while ((indElt < taille ) && ((compareDouble(tableau[2*indElt+1][0], tableau[2*indElt+1][1], tableau[indElt][0], tableau[indElt][1]) == -1) || (compareDouble(tableau[2*indElt+2][0], tableau[2*indElt+2][1], tableau[indElt][0], tableau[indElt][1]) == -1))){
		
		if (2*indElt+1 > taille){
			swapInt3(tableau, indElt, indElt+1) ;
			indElt = indElt+1 ;
		} else if (compareDouble(tableau[2*indElt+1][0], tableau[2*indElt+1][1], tableau[indElt][0], tableau[indElt][1]) == -1){
			swapInt3(tableau, indElt, 2*indElt+1) ;
			indElt = 2*indElt+1 ;
		} else {
			swapInt3(tableau, indElt, 2*indElt+2) ;
			indElt = 2*indElt+2 ;
		}

	}
}

void usage (char * s) /* s is the program name */
{
fprintf(stderr, "%s [-s size] [-B]\n", s);
fprintf(stderr, "\t_size_ est la taille des empans\n");
fprintf(stderr, "\t_size_ is given as a number, eventually followed by a multiplier (k,M,G)\n");
fprintf(stderr, "\tif -B is given switch from binary to ASCII\n");
}

//Assigne les valeurs du tableau au pointeur situe entre debut et fin
void assignValuetoPoint(uint32_t tableau[][2], struct item* pointeur, int debut, int fin){
    int i ;
    
    for(i=0; i<debut; i++){
		pointeur++ ;
    }

    for(i=0; i<=(fin-debut); i++){
		pointeur->u[0] = tableau[i][0] ;
		pointeur->u[1] = tableau[i][1] ;
		pointeur++ ;
    }
    
    for(i=0; i<=(fin-debut); i++){
	pointeur-- ;
    }
}

size_t read_human_size (char * s){
	char *endp;
	int sh;
	uintmax_t x;
	errno = 0; x = strtoumax(s, &endp, 10);
	if (errno || endp == s) goto error;
	switch(*endp) {
		case 'k': sh=10; break;
		case 'M': sh=20; break;
		case 'G': sh=30; break;
		case 0: sh=0; break;
		default: goto error;
	}
	if (sh && endp[1]) goto error;
	if (x > SIZE_MAX>>sh) goto error;
	return x <<= sh;
	error:
		errno=EDOM;
		return 0;
}


int main(int argc, char *argv[])
{

    int i,j;
    int fd;
    void *map = 0;  /* mmapped array of int's */
    struct stat sb;

	int tailleEmp = 0 ;

	char * prgname; /* name of launched program */
	size_t opt_s = 10; /* opt_s is the number of items to generate */
	int opt_B = 0; /* 0 for ASCII output, 1 for binary output */

    fd = open(argv[1], O_RDWR);
		if (fd == -1) {
		perror("Error opening file for reading");
		exit(EXIT_FAILURE);
    }

    off_t tailleMem ;
	char * BChar ;

	{
	int ch;

	while ((ch = getopt(argc, argv, "Bs:")) != -1)
		{
		switch (ch)
			{
			case 'B':
				BChar = strcat("cat ",argv[1]) ;
				BChar = strcat(BChar," | perl -lpe '$_=unpack\"B*\"'") ;
				system(BChar) ;
				opt_B = 1 ;
				break;
			case 's':
			    tailleEmp = read_human_size(optarg);
			if (tailleEmp == 0)
				{ usage(prgname); exit(EXIT_FAILURE); }
			break;
			case '?':
			default:
		    { usage(prgname); exit(EXIT_FAILURE); }
			}
		}
	}

#if 0
{
	if (argc-optind < 1 || argc-optind> 2)
	{ usage(prgname); exit(EXIT_FAILURE); }
}
#endif

	if (fstat(fd, &sb) == -1)           /* To obtain file size */
        handle_error("fstat");

	int tailleLigne = 2*sizeof(uint32_t) + sizeof('\n') + sizeof(size_t) + sizeof(" ") ;

    tailleMem = ((tailleEmp * tailleLigne) / sysconf (_SC_PAGESIZE) + 1) * sysconf (_SC_PAGESIZE);

    map = mmap(0, tailleMem, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
	    if (map == MAP_FAILED) {
		close(fd);
		perror("Error mmapping the file");
		exit(EXIT_FAILURE);
    }

	int nbEmpans = sb.st_size/(tailleEmp * tailleLigne) + 1 ;

    //Pointeur vers premier elt
    struct item *start = map ;
    uint32_t table1[tailleEmp][2], table2[tailleEmp][2] ;

    //Traitement principal : on part du premier element, on cree des empans de taille correcte, puis on les trie un a un avant de les fusionner avec une percolation 
    //Tri des empans
    for(i = 0; i<nbEmpans; i++){
	//on remplit un tableau correctement, qu'on trie ensuite
		if (i != nbEmpans - 1){
		    assignValuetoTab(table1, start, i * tailleEmp, (i+1) * tailleEmp) ;
			tri_fusion(table1, tailleEmp) ;
		    assignValuetoPoint(table1, start, i * tailleEmp, (i+1) * tailleEmp) ;
		} else {
		    assignValuetoTab(table1, start, i * tailleEmp, i * tailleEmp + (sb.st_size/tailleLigne)%nbEmpans) ;
			tri_fusion(table1, (sb.st_size/tailleLigne)%nbEmpans) ;
		    assignValuetoPoint(table1, start, i * tailleEmp, i * tailleEmp + (sb.st_size/tailleLigne)%nbEmpans) ;
		}		
    }

	//initialisation tas
	uint32_t tas[nbEmpans][3] ;
	struct item *temp = start ;
	for(i=0;i<nbEmpans;i++){
		tas[i][0] = temp -> u[0] ;
		tas[i][1] = temp -> u[1] ;
		tas[i][2] = i ;

		percoUp(tas, i) ;

		temp = start + i * tailleEmp ;

	}

	//Phase d'affichage
	int coupleTraite = 0, indiceTas = 0 ;
	int indiceTraite[nbEmpans];

	for (i=0; i<nbEmpans; i++){
		indiceTraite[i] = 0 ;
	}

	{

		int indiceMin = tas[0][2];

		while (coupleTraite < sb.st_size/tailleLigne ){

			struct item u ;

			if (opt_B) ; else printf("%d ", coupleTraite);
			u.u[0] = tas[indiceTas][0] ;
			u.u[1] = tas[indiceTas][1] ;
			if (opt_B) item_write(&u); else item_print(&u);
			if (opt_B) ; else putchar('\n');

			if ((indiceTraite[indiceMin] + 1 > tailleEmp) || (indiceMin == nbEmpans - 1 && indiceTraite[indiceMin] + 1 > (sb.st_size/tailleLigne)%nbEmpans)){
				indiceTas += 1 ;
				percoDown(tas, indiceTas, nbEmpans) ;
				indiceMin = tas[indiceTas][2] ;
			}

			temp = start + indiceMin * tailleEmp + indiceTraite[indiceMin] + 1;
			tas[indiceTas][0] = temp -> u[0] ;
			tas[indiceTas][1] = temp -> u[1] ;
			percoDown(tas, indiceTas, nbEmpans) ;
			indiceMin = tas[indiceTas][2] ;
			coupleTraite = coupleTraite + 1 ;
			indiceTraite[indiceMin] = indiceTraite[indiceMin] + 1 ;
		}

	}

    if (munmap(map, tailleMem) == -1) {
	perror("Error un-mmapping the file");
    }
    close(fd);
    return 0;
}
