void  error(FILE *fpin,FILE *fpout,char error_msg[]){
int index1=ftell(fpin);
readLine(fpin);
int index2=ftell(fpin);
/*���˵�ԭ�ȵ�λ��*/
int index3=index1-(index2-index1);/*��ȡ��ֵ*/
fseek(fpin,index3,0);
char  *result=readLine(fpin);
fputs(result,fpout);
fputs(error_msg,fpout);
fputs("\n",fpout);
fseek(fpin,index1,0);
}
