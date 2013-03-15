#include "constant.h"
#include "filehandle.h"
#include <stdio.h> 

int main() {
	FILE *fpin,*fpout,*fperror;
	int c;
	// 判断字母的值
	int is_what;
	// 存放字符串    
	char ch[MAX_CHAR_LENGTH];
	ch[0]='\0';
	char result[MAX_RESULT_LENGTH];
	int i=0;
	int ch_index=0;
	int len;
	int is_end=0;
	// 用来计算行号
	int line_number=1;

	char fpin_name[MAX_FILENAME_LENGTH] = "", fpout_name[MAX_FILENAME_LENGTH] = "", fperror_name[MAX_FILENAME_LENGTH] = "";

	printf("请输入要进行词法分析的文件名:\n");
	scanf("%s",fpin_name);
	error_out_name(fpin_name, fpout_name, fperror_name);
	fpin=fopen(fpin_name,"r");
	fpout=fopen(fpout_name,"w");
	fperror=fopen(fperror_name,"w");

	if (fpin==NULL || fpout==NULL || fperror==NULL) {
		printf("打开文件失败\n请确认输入的文件名是否合法，文件是否真实存在！");
		return 1;
	} else {
        //进行字母数字的判断
		while((c=getc(fpin))!=EOF) {

			is_what=word_type(c);

			if(is_what==BLANK) continue;

			if (is_what==LETTER) {
				// 判断字符的长度 不能超过16 
				len=strlen(ch);
				if(len>=16){
					more_than_16(fpin, fperror);
				}
				ch_index=0;
				ch[ch_index++]=c;//加入字符串
				ch[ch_index]='\0'; //加入结束符
				while((c=getc(fpin))!=ONECHAR) {
					//判断字符的长度  不能超过16 
					len=strlen(ch);
					if(len>=16){
						more_than_16(fpin, fperror);
						break; 
					}

					//-1的时候  是行的末尾
					is_what=word_type(c);
					if(is_what==BLANK||is_what==OTHER){
						//如果是空格   那么一个字母的字符串结束
						//把result写到文件里面去
						to_result(ch,result,fpout,ONECHAR);
						break;//停止这一次的运行 
					}
					else  if(is_what==EOF){
						is_end=1;
						to_result(ch,result,fpout,EOF);
						break;//停止这一次的运行 
					} 
					//写到ch里面
					else{
						ch[ch_index]=c;

						ch[++ch_index]='\0';
					}
				}
			}
			//如果当前的是空格或者是回车  或者是换行  那么结束这次
			if(is_what==BLANK)continue;
			//如果当前的是其他的字符
			if(is_what==OTHER){
				ch[0]=c;
				ch[1]='\0';
				int sign=c;
				//不是文件的末尾
				other( ch, result, sign, fpout,fpin,fperror, OTHER);
				//查看是不是文件的末尾操作
				if((c=getc(fpin))!=EOF) {
					is_what=word_type(c);
					//判断读取的字符  是不是为'\n' ' '
					if(is_what!=BLANK){
						//文件指针回退
						int index=ftell(fpin);
						fseek(fpin,index-1,0);
						is_what=BLANK;//重新开始读取
					}

				} else {
					endfile(fpout);
					break;
				}
			}
			if(is_what==NUMBER){
				//如果读取到的是数字的话
				ch_index=0;
				ch[ch_index]=c;
				ch[++ch_index]='\0';
				while((c=getc(fpin))!=-1){
					is_what=word_type(c);
					if(is_what==LETTER)
					{
						number_error(fpin, fperror);
						break;
					}
					else   if(is_what==BLANK||is_what==OTHER){
						//做一些数据的处理  读取空格或者是其他的字符
						to_result(ch,result,fpout,ONECHAR);
						if(is_what!=BLANK){
							//文件指针回退
							int index=ftell(fpin);
							fseek(fpin,index-1,0);
						}				
						break;
					}
					else if(is_what==NUMBER){
						ch[ch_index]=c;
						ch[++ch_index]='\0';
					}
				}
				if(c==EOF){
					is_end=1;
					toNextLine(fpout);

					endfile(fpout);

					break;
				}
			}
			//初始化这两个数组
			ch[0]='\0';
			result[0]='\0';
		}
	}
	if(is_end==0){
		endfile(fpout);
	}

	fclose(fpin);
	fclose(fpout);
	fclose(fperror);
	return 0;
}

