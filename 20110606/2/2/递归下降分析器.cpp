// �ݹ��½�������.cpp : �������̨Ӧ�ó������ڵ㡣
//
#include "stdafx.h"
#include "parser.h"
#include <string.h>
int _tmain(int argc, _TCHAR* argv[])
{
FILE *fpin,*fpout;
//char fpin_name[80]="F:\\����ѧϰ\\�γ̰���ʵ��ʱ��\\����ԭ��ʵ��\\����ԭ��ʵ��\\����ԭ��ʵ��\\yao.dyd";
char fpout_name[80];
char fpin_name[80];
printf("������Ҫ���дʷ��������ļ���:\n");
scanf("%s",fpin_name);
strcpy(fpout_name,fpin_name);
int len=strlen(fpout_name);
for(int i=0;i<len;i++){
if(fpout_name[i]=='.')
{
	fpout_name[++i]='y';
	fpout_name[++i]='a';
	fpout_name[++i]='o';
	fpout_name[++i]='\0';
	break;
}
}
fpin=fopen(fpin_name,"r");
fpout=fopen(fpout_name,"w");
if(fpin==NULL||fpout==NULL)
{
printf("���ļ�ʧ��\n��");
return 1;
}
program(fpin,fpout);
return 0;
}

