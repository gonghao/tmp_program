void  error(FILE *fpin,FILE *fpout,char error_msg[]){
int index1=ftell(fpin);
readLine(fpin);
int index2=ftell(fpin);
/*回退到原先的位置*/
int index3=index1-(index2-index1);/*获取差值*/
fseek(fpin,index3,0);
char  *result=readLine(fpin);
fputs(result,fpout);
fputs(error_msg,fpout);
fputs("\n",fpout);
fseek(fpin,index1,0);
}
