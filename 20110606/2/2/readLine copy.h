#include <string.h>
char*  readLine(FILE *fpin){
	char c;
	char result[16];
	int i=0;
	int j=0;
	while((c=getc(fpin))!='\n'){
		if(j==16)break;
		j++;
		if(c!=' '&&c!='\r'){
			result[i]=c;
			i++;
		}

	}
	result[i]='\0';
	while((c=getc(fpin))!='\n'){}/*往下面读取一行*/
	while((c=getc(fpin))!='\n'){}/*往下面读取一行*/
   return result;
}
int   is_what(FILE *fpin){
	char c;
	char result[16];
	int i=0;
	int j=0;
	while((c=getc(fpin))!='\n'){
		if(j==16)break;
		j++;
	}
	/*中间的空格已经被去掉了*/
	while((c=getc(fpin))!='\n'){
	result[i++]=c;
	}
	result[i]='\0';
	while((c=getc(fpin))!='\n'){}/*往下面读取一行*/
	if(strcmp(result,"10")==0)return 10;
	else if(strcmp(result,"11")==0)return 11;
	else return 0;
}