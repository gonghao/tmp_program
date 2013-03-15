// 递归下降分析器.cpp : 定义控制台应用程序的入口点。
//
#include "stdafx.h"
#include "parser.h"
#include <string.h>
int _tmain(int argc, _TCHAR* argv[])
{
FILE *fpin,*fpout;
//char fpin_name[80]="F:\\桌面学习\\课程安排实验时间\\编译原理实验\\编译原理实验\\编译原理实验\\yao.dyd";
char fpout_name[80];
char fpin_name[80];
printf("请输入要进行词法分析的文件名:\n");
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
printf("打开文件失败\n！");
return 1;
}
program(fpin,fpout);
return 0;
}

