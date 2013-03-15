#include "type.h"
#include "errorLine.h"
#include "endline.h"
#include <stdio.h>
#include <string.h>

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
	toNextLine(fpout);
    if(is_end==-1){
        endfile(fpout);
    }
	//重新初始化
	result[0]='\0';
    ch[0]='\0';
}

void other(char ch[],char result[],int sign,FILE *fpout,FILE *fpin,FILE *fperror,int is_end){
	//读取的字符sign
	switch (sign) {
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

	case  '<':ch[1]=getc(fpin);
		ch[2]='\0';
		if(ch[1]!=-1) {
            if(strcmp(ch,"<=")==0||strcmp(ch,"<>")==0) {
				to_result(ch,result,fpout,is_end);
            } else {
				if(word_type(ch[1])!=2){
					//文件指针回退
					int index=ftell(fpin);
					fseek(fpin,index-1,0);
				}
				//还原ch[1]结束符
				ch[1]='\0';
				to_result(ch,result,fpout,is_end);
			}
		} else {
			ch[1]='\0';
			to_result(ch,result,fpout,-1);
		}
		break;
        
	case  '>':
		ch[1]=getc(fpin);
		ch[2]='\0';
		//用于存储值
		if(ch[1]!=-1) {
			//展开这2种情况
			if(	strcmp(ch,">=")==0) {
				to_result(ch,result,fpout,is_end);
            } else {	
				if(word_type(ch[1])!=2){
                    int index=ftell(fpin);
                    fseek(fpin,index-1,0);
                }
		
				ch[1]='\0';
				to_result(ch,result,fpout,is_end);
			}
		} else {
			ch[1]='\0';
			to_result(ch,result,fpout,-1);
		}
		break;

	case  ':':
		ch[1]=getc(fpin);
		ch[2]='\0';
		//用于存储值
		if(ch[1]!=-1) {
			//展开这2种情况
			if(	strcmp(ch,":=")==0) {
				to_result(ch,result,fpout,is_end);
            } else {
				if(word_type(ch[1])!=2){
					//文件指针回退
					int index=ftell(fpin);
					fseek(fpin,index-1,0);
				}
				//还原ch[1]结束符
				ch[1]='\0';
				to_result(ch,result,fpout,is_end);
			}
		} else {
			ch[1]='\0';
			to_result(ch,result,fpout,-1);
		}
		break;

	case  ';':
        to_result(ch,result,fpout,is_end);
		break;

	default:
        error_letter(fpin, fperror, ch);
		break;
	}

}

void error_out_name( char * fpin_name, char * fpout_name, char * fperror_name ) {
    char * pch = strchr(fpin_name, '.');

    if (NULL == pch) {
        pch = strchr(fpin_name, '\0');
    }

    strncat(fpout_name, fpin_name, pch - fpin_name);
    strcat(fpout_name, ".dyd");

    strncat(fperror_name, fpin_name, pch - fpin_name);
    strcat(fperror_name, ".err");

    return;
}

