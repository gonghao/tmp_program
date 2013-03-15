#include <string.h>
#include "type.h"
#include "errorLine.h"
#include "endline.h"
//�ж��ǲ�����ĸ 
int word_type(char character){
	if((('a'<=character)&&(character<='z'))||(('A'<=character)&&(character<='Z')))
	{
		return 1;
	}
	//�жϿո� �����ǻس�  �����ǻ��� 
	else if(character==' '||character=='\n'||character=='\r')
	{
		return 2;
	}
	else if(('0'<=character)&&(character<='9')) {
		//�ж����� 
		return 3;
	}
	else if(character==-1){
		return -1;
	}
	else{
		return 0;
	}
}
//�ѽ��д���ļ�����ȥ
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
	//д��ո�
	result[16]='\0';
	//��ѯ����XX
	type_num(result,ch);
	//д���ļ�����ȥ
	fputs(result,fpout);
	//����
	putc('\n',fpout);
	//��дһ��
	toNextLine(result,fpout);
if(is_end==-1){
	endfile(result,fpout);
}
	//���³�ʼ��
	result[0]='\0';
   ch[0]='\0';
}


void other(char ch[],char result[],int sign,FILE *fpout,FILE *fpin,FILE *fperror,int is_end){
	//��ȡ���ַ�sign
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
		//��3�����  = >  other
	case  '<':ch[1]=getc(fpin);
		ch[2]='\0';
		//���ڴ洢ֵ
		if(ch[1]!=-1)
		{
			//չ����3�����

			
				if(strcmp(ch,"<=")==0||strcmp(ch,"<>")==0)
				to_result(ch,result,fpout,is_end);
			else
			{
				if(word_type(ch[1])!=2){
					//�ļ�ָ�����
					int index=ftell(fpin);
					fseek(fpin,index-1,0);
				}
				//��ԭch[1]������
				ch[1]='\0';
				to_result(ch,result,fpout,is_end);
			}
		}
		else{
			ch[1]='\0';
			to_result(ch,result,fpout,-1);
		}
		break;
		//��2�����
	case  '>':
		ch[1]=getc(fpin);
		ch[2]='\0';
		//���ڴ洢ֵ
		if(ch[1]!=-1)
		{
			//չ����2�����
			if(	strcmp(ch,">=")==0)
				to_result(ch,result,fpout,is_end);
			else
			{	
				
				if(word_type(ch[1])!=2){
				//�ļ�ָ�����
				int index=ftell(fpin);
				fseek(fpin,index-1,0);
			}
		
				//��ԭch[1]������
				ch[1]='\0';
				to_result(ch,result,fpout,is_end);
			}
		}
		else{
			ch[1]='\0';
			to_result(ch,result,fpout,-1);
		}
		break;
		//Ҳ����2�����
	case  ':':
		ch[1]=getc(fpin);
		ch[2]='\0';
		//���ڴ洢ֵ
		if(ch[1]!=-1)
		{
			//չ����2�����
			if(	strcmp(ch,":=")==0	)
				to_result(ch,result,fpout,is_end);
			else
			{
				if(word_type(ch[1])!=2){
					//�ļ�ָ�����
					int index=ftell(fpin);
					fseek(fpin,index-1,0);
				}
				//��ԭch[1]������
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
		//������
		//����Ĵ���
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

