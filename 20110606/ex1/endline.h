#include "constant.h"
#include <stdio.h> 
#include <string.h> 

void endfile(FILE * fpout) {
    char result[MAX_RESULT_LENGTH] = "";
    memset(result, ' ', 13);
    strcat(result, "EOF 25");
	fputs(result, fpout);
	fputs("\n", fpout);
}

void toNextLine(FILE * fpout) {
    char result[MAX_RESULT_LENGTH + 1] = "";
    memset(result, ' ', 12);
    strcat(result, "EOLN 24\n");
	fputs(result,fpout);
}
