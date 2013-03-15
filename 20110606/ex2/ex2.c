#include "constant.h"
#include "parser.h"
#include <stdio.h>
#include <string.h>

int main() {
    FILE *fpin, *fpout;
    char fpout_name[MAX_FILENAME_LENGTH] = "", fpin_name[MAX_FILENAME_LENGTH] = "", buffer[MAX_FILENAME_LENGTH] = "";
    printf("请输入要进行语法分析的文件名:\n");
    scanf("%s", fpin_name);
    char * pch = strchr(fpin_name, '.');
    if (NULL == pch) {
        pch = strchr(fpin_name, '\0');
    }
    strncat(fpout_name, fpin_name, pch - fpin_name);
    strcat(fpout_name, ".out");
    
    fpin=fopen(fpin_name,"r");
    fpout=fopen(fpout_name,"w");
    if (fpin == NULL || fpout == NULL) {
        printf("文件打开失败\n!");
        return 1;
    }

    int error_count;
    if ((error_count = program(fpin, fpout)) >= 0) {
        fputs("Parse Successful, None Error Found!\n", fpout);
    } else {
        sprintf(buffer, "%d Error(s) Found!\n", -error_count);
        fputs(buffer, fpout);
    }

    return 0;
}

