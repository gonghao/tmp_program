void error(FILE *fpin,FILE *fpout,char error_msg[]){
    int index1=ftell(fpin);
	char result[MAX_CHAR_LENGTH];

    readLine(fpin, result);

    int index2=ftell(fpin);

    int index3=index1 * 2 - index2;
    fseek(fpin,index3,0);
    readLine(fpin, result);
    fputs(result,fpout);
    fputs(error_msg,fpout);
    fputs("\n",fpout);
    fseek(fpin,index1,0);
}
