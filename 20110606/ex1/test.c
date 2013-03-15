#include <string.h>
#include <stdio.h>

int main() {
    char str[] = "helloworl.cpp";
    char out_str[80], err_str[80], test[80] = "";
    char result[20];
    int j;
    char * pch = strchr(str, '.');
    if (NULL == pch) {
        pch = strchr(str, '\0');
    }
    strncpy(test, str, 20);
    printf("%s\n", test);
    printf("%c\n", test[18]);
    printf("%d\n", pch - str);
    strcpy(out_str, "");
    strncat(out_str, str, pch - str);
    strcat(out_str, ".dyd");
    strcpy(err_str, "");
    strncat(err_str, str, pch - str);
    strcat(err_str, ".err");
    printf("Output: %s Error: %s\n", out_str, err_str);
    printf("%d\n", '\n');
    strcpy(result, "");
	for (j = 0; j < 13; j++) {
		result[j]=' ';
	}
    strcat(result, "EOF 25");
    printf("%s\n", result);
    return 0;
}
