int   getLine(FILE *fpin){
//��ȡ��ǰ�Ĵ����к�
	int   index=ftell(fpin);
     int  chang_line;
	 int   line =1;
	 if(chang_line=getc(fpin)==-1)
		 line++;
	fseek(fpin,0,0);
	while((chang_line=getc(fpin))!=-1){
		if(ftell(fpin)==index)break;
		if(chang_line==10)
		{
         line++;
		}
	}
	return line;
}
void to_next_line(FILE *fpin){
  char c;
  while((c=getc(fpin))!=-1){
	  if(c=='\n'||c=='\r')
		  break;
  }

}

int deal_error( int line_number, FILE * fpin, FILE * fperror )
{
	line_number=getLine(fpin);
	char buffer[80];
	sprintf_s(buffer,"***LINE:%d  ",line_number);
	fputs(buffer,fperror);	
	return 1;
}
int more_than_16( int line_number, FILE * fpin, FILE * fperror )
{
	//������
	//������
line_number = deal_error(line_number, fpin, fperror);

	fputs("�ַ����ĸ�������16��\n",fperror);
	to_next_line(fpin);	
	return line_number;
}

int number_error( int line_number, FILE * fpin, FILE * fperror )
{
   line_number=deal_error(line_number, fpin, fperror);
	fputs("�������治�ܰ�����ĸ\n",fperror);
	to_next_line(fpin);	
	return line_number;
}
int  error_letter( FILE * fpin, FILE * fperror, char * ch )
{
	int line_number=0;
	deal_error(line_number, fpin, fperror);
	fputs("���Ϸ��ĵ��ʷ��ţ�",fperror);
	fputs(ch,fperror);
	fputs("\n",fperror);
	to_next_line(fpin);	
	return 1;
}

