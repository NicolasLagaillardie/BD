#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#include <inttypes.h>

static char * version = "@(#) format binary uint32 resd from stdin in decimal";

void usage (char *prgname)
{
  fprintf(stderr, "%s -n <nb_of_uint32_by_line>\n",
	  prgname);
} /* usage */

int main (int argc, char * argv[])
{
  char * prgname; /* name of launched program */
  char * format = "%"PRIu32;
  int opt_n = 1; /* number of printed ints by line */

  {
  if ((prgname = strrchr(argv[0], '/')))
    prgname++;
  else
    prgname=argv[0];
  }

  { /* Option analysis */
  int ch;

  while ((ch = getopt(argc, argv, "n:")) != -1)
    {
    switch (ch)
      {
      case 'n': opt_n = atoi(optarg); break;

      case '?':
      default:
	usage(prgname);
	exit(EXIT_FAILURE);
      }
    }
  }

  {
  uint32_t x;

  int first_on_line = 1;
  int count = 0;
  while (fread(&x, sizeof(uint32_t), 1, stdin) == 1)
    {
    if (first_on_line)
      first_on_line=0;
    else
      putchar('\t');
    printf(format, x);
    count++;
    if (count == opt_n)
      {
      count=0;
      putchar('\n');
      first_on_line = 1;
      }
    }
  if (! first_on_line)
    putchar('\n');
  }
return EXIT_SUCCESS;
} /* main */
