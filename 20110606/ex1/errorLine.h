#include "constant.h"
#include <stdio.h> 

//获取当前的错误行号
int getLine(FILE *fpin) {
	int index=ftell(fpin);
    int ch;
	int line=1;
	fseek(fpin,0,0);
	while ((ch=getc(fpin))!=EOF) {
		if (ftell(fpin)==index) break;
		if (ch=='\n') {
            line++;
		}
	}

	return line;
}

void to_next_line(FILE *fpin) {
    char c;
    while ((c=getc(fpin))!=EOF) {
        if(c=='\n') break;
    }
}

void deal_error(FILE * fpin, FILE * fperror ) {
	int line_number=getLine(fpin);
	char buffer[MAX_FILENAME_LENGTH];
	sprintf(buffer,"***LINE:%d  ", line_number);
	fputs(buffer, fperror);
}

void more_than_16(FILE * fpin, FILE * fperror ) {
    deal_error(fpin, fperror);

	fputs("字符串的个数超过16个\n", fperror);
	to_next_line(fpin);	
}

void number_error(FILE * fpin, FILE * fperror ) {
    deal_error(fpin, fperror);
	fputs("常数里面不能包含字母\n",fperror);
	to_next_line(fpin);	
}

void error_letter( FILE * fpin, FILE * fperror, char * ch ) {
	deal_error(fpin, fperror);
	fputs("不合法的单词符号：",fperror);
	fputs(ch,fperror);
	fputs("\n",fperror);
	to_next_line(fpin);	
}

