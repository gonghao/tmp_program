#include <string.h>
#include "type.h"
#include "errorLine.h"
#include "endline.h"
//判断是不是字母 
int word_type(char character){
	if((('a'<=character)&&(character<='z'))||(('A'<=character)&&(character<='Z')))
	{
		return 1;
	}
	//判断空格 或者是回车  或者是换行 
	else if(character==' '||character=='\n'||character=='\r')
	{
		return 2;
	}
	else if(('0'<=character)&&(character<='9')) {
		//判断数字 
		return 3;
	}
	else if(character==-1){
		return -1;
	}
	else{
		return 0;
	}
}
//把结果写到文件里面去
void to_result(char ch[],char result[],FILE *fpout,int is_end){

	int len=strlen(ch);
	int j;
	int ch_index=0;
	for(j=0;j<16;j++){
		if(j>=(16-len))
			result[j]=ch[ch_index++];
		else
			result[j]=' ';
	} 
	//写入空格
	result[16]='\0';
	//查询它的XX
	type_num(result,ch);
	//写到文件里面去
	fputs(result,fpout);
	//换行
	putc('\n',fpout);
	//再写一行
	toNextLine(result,fpout);
if(is_end==-1){
	endfile(result,fpout);
}
	//重新初始化
	result[0]='\0';
   ch[0]='\0';
}


void other(char ch[],char result[],int sign,FILE *fpout,FILE *fpin,FILE *fperror,int is_end){
	//读取的字符sign
	switch (sign)
	{
	case  '=':to_result(ch,result,fpout,is_end);
		break;
	case  '-':to_result(ch,result,fpout,is_end);
		break;

	case  '*':to_result(ch,result,fpout,is_end);
		break;

	case  '(':to_result(ch,result,fpout,is_end);
		break;

	case  ')':to_result(ch,result,fpout,is_end);
		break;
		//有3种情况  = >  other
	case  '<':ch[1]=getc(fpin);
		ch[2]='\0';
		//用于存储值
		if(ch[1]!=-1)
		{
			//展开这3种情况

			
				if(strcmp(ch,"<=")==0||strcmp(ch,"<>")==0)
				to_result(ch,result,fpout,is_end);
			else
			{
				if(word_type(ch[1])!=2){
					//文件指针回退
					int index=ftell(fpin);
					fseek(fpin,index-1,0);
				}
				//还原ch[1]结束符
				ch[1]='\0';
				to_result(ch,result,fpout,is_end);
			}
		}
		else{
			ch[1]='\0';
			to_result(ch,result,fpout,-1);
		}
		break;
		//有2种情况
	case  '>':
		ch[1]=getc(fpin);
		ch[2]='\0';
		//用于存储值
		if(ch[1]!=-1)
		{
			//展开这2种情况
			if(	strcmp(ch,">=")==0)
				to_result(ch,result,fpout,is_end);
			else
			{	
				
				if(word_type(ch[1])!=2){
				//文件指针回退
				int index=ftell(fpin);
				fseek(fpin,index-1,0);
			}
		
				//还原ch[1]结束符
				ch[1]='\0';
				to_result(ch,result,fpout,is_end);
			}
		}
		else{
			ch[1]='\0';
			to_result(ch,result,fpout,-1);
		}
		break;
		//也是有2种情况
	case  ':':
		ch[1]=getc(fpin);
		ch[2]='\0';
		//用于存储值
		if(ch[1]!=-1)
		{
			//展开这2种情况
			if(	strcmp(ch,":=")==0	)
				to_result(ch,result,fpout,is_end);
			else
			{
				if(word_type(ch[1])!=2){
					//文件指针回退
					int index=ftell(fpin);
					fseek(fpin,index-1,0);
				}
				//还原ch[1]结束符
				ch[1]='\0';
				to_result(ch,result,fpout,is_end);
			}
		}
		else{
			ch[1]='\0';
			to_result(ch,result,fpout,-1);
		}
		break;
	case  ';':to_result(ch,result,fpout,is_end);
		break;
	default:
		//错误处理
		//错误的处理
	error_letter(fpin, fperror, ch);
		break;
	}

}
void error_out_name( char *fpin_name, char * fpout_name, char * fperror_name )
{
	for(int nn=0;nn<80;nn++){
		if(fpin_name[nn]!='.')
		{
			fpout_name[nn]=fpin_name[nn];
			fperror_name[nn]=fpin_name[nn];
		}
		else{
		
			fpout_name[nn]='.';
			fpout_name[nn+1]='d';
			fpout_name[nn+2]='y';
			fpout_name[nn+3]='d';
			fpout_name[nn+4]='\0';

			fperror_name[nn]='.';
			fperror_name[nn+1]='e';
			fperror_name[nn+2]='r';
			fperror_name[nn+3]='r';
			fperror_name[nn+4]='\0';
			break;
		}
	}
}

