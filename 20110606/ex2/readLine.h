#include <stdio.h>
#include <string.h>

void readLine(FILE * fpin, char * result) {
	char c;
	int i=0, j=0;
	while((c=getc(fpin))!='\n') {
		if (j++==MAX_CHAR_LENGTH) break;
		if (c!=' ' && c!='\r') {
			result[i++]=c;
		}
	}

	result[i]='\0';

	while((c=getc(fpin))!='\n'){}/*往下面读取一行*/
	while((c=getc(fpin))!='\n'){}/*往下面读取一行*/
}

int is_what(FILE *fpin) {
	char c, result[MAX_CHAR_LENGTH] = "";
	int i=0, j=0, ret = 0;
	while((c=getc(fpin)) !='\n') {
		if(j++==MAX_CHAR_LENGTH) break;
	}
	while((c=getc(fpin))!='\n'){
        result[i++]=c;
	}
	result[i]='\0';
	while((c=getc(fpin))!='\n'){}/*往下面读取一行*/
	if(!strcmp(result,"10")) {
        ret = 10;
    } else if (!strcmp(result,"11")) {
        ret = 11;
    }
	return ret;
}
