void  endfile( char result[], FILE * fpout )
{
	for(int j=0;j<13;j++)
	{
		result[j]=' ';
	}
	result[13]='E';
	result[14]='O';
	result[15]='F';
	result[16]=' ';
	result[17]='2';
	result[18]='5';
	result[19]='\0';
	fputs(result,fpout);	
}
void toNextLine(  char  result[], FILE * fpout )
{
	for(int j=0;j<12;j++)
	{
		result[j]=' ';
	}
	result[12]='E';
	result[13]='O';
	result[14]='L';
	result[15]='N';
	result[16]=' ';
	result[17]='2';
	result[18]='4';
	result[19]='\0';
	fputs(result,fpout);
	//»»ÐÐ
	putc('\n',fpout);
}
