#include <string.h>
void  type_num(char result[],char ch[])
{
	if(strcmp(ch,"begin")==0){
		result[16]=' ';
		result[17]='1';
		result[18]='\0';
	}
	else if(strcmp(ch,"if")==0){
		result[16]=' ';
		result[17]='4';
		result[18]='\0';
	}
	else if(strcmp(ch,"function")==0)
	{
		result[16]=' ';
		result[17]='7';
		result[18]='\0';
	}
	else if(strcmp(ch,"end")==0)
	{
		result[16]=' ';
		result[17]='2';
		result[18]='\0';
	}
	else if(strcmp(ch,"then")==0)
	{
		result[16]=' ';
		result[17]='5';
		result[18]='\0';
	}
	else if(strcmp(ch,"read")==0)
	{
		result[16]=' ';
		result[17]='8';
		result[18]='\0';
	}
	else if(strcmp(ch,"integer")==0)
	{
		result[16]=' ';
		result[17]='3';
		result[18]='\0';
	}
	else if(strcmp(ch,"else")==0)
	{
		result[16]=' ';
		result[17]='6';
		result[18]='\0';
	}
	else if(strcmp(ch,"write")==0)
	{
		result[16]=' ';
		result[17]='9';
		result[18]='\0';
	}
	else if(strcmp(ch,"=")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='2';
		result[19]='\0';
	}
	else if(strcmp(ch,"<>")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='3';
		result[19]='\0';
	}
	else if(strcmp(ch,"<=")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='4';
		result[19]='\0';
	}
	else if(strcmp(ch,"<")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='5';
		result[19]='\0';
	}
	else if(strcmp(ch,">=")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='6';
		result[19]='\0';
	}
	else if(strcmp(ch,">")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='7';
		result[19]='\0';
	}
	else if(strcmp(ch,"-")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='8';
		result[19]='\0';
	}
	else if(strcmp(ch,"*")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='9';
		result[19]='\0';
	}
	else if(strcmp(ch,":=")==0)
	{
		result[16]=' ';
		result[17]='1';
		result[18]='9';
		result[19]='\0';
	}
	else if(strcmp(ch,"(")==0)
	{
		result[16]=' ';
		result[17]='2';
		result[18]='1';
		result[19]='\0';
	}
	else if(strcmp(ch,")")==0)
	{
		result[16]=' ';
		result[17]='2';
		result[18]='2';
		result[19]='\0';
	}
	else if(strcmp(ch,";")==0)
	{
		result[16]=' ';
		result[17]='2';
		result[18]='3';
		result[19]='\0';
	}
	else{
		char c=ch[0];
		if('0'<=ch[0]&&ch[0]<='9'){
			result[16]=' ';
			result[17]='1';
			result[18]='1';
			result[19]='\0';
		}
		else
		{
			result[16]=' ';
			result[17]='1';
			result[18]='0';
			result[19]='\0';
		}
		

	}

}
