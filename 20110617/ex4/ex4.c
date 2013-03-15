#include <stdio.h>

#define MAX_LENGTH 1000
#define SEP_LENGTH 100
#define FILE_A_CHAR '5'
#define FILE_B_CHAR 'a'

int main() {
    FILE * fileA, * fileB, * fileC;
    int i;
    char buffer[MAX_LENGTH * 2];

    fileA = fopen("File_A", "w+");
    fileB = fopen("File_B", "w+");
    fileC = fopen("File_C", "w+");

    // build File A
    for (i = 0; i< MAX_LENGTH; i++) {
        if (EOF == fputc(FILE_A_CHAR, fileA)) {
            printf("Failed: Wirte to File_A!\n");
            return 1;
        }
    } 

    // build File B
    for (i = 0; i< MAX_LENGTH; i++) {
        if (EOF == fputc(FILE_B_CHAR, fileB)) {
            printf("Failed: Wirte to File_B!\n");
            return 1;
        }
    } 

    // build File C
    rewind(fileA);
    rewind(fileB);
    for (i = 0; i< MAX_LENGTH / SEP_LENGTH; i++) {
        if (!fgets(buffer, SEP_LENGTH + 1, fileA)) {
            printf("Failed: Read from File_A!\n");
            return 1;
        }
        if (EOF == fputs(buffer, fileC)) {
            printf("Failed: Wirte to File_C!\n");
            return 1;
        }
        if (!fgets(buffer, SEP_LENGTH + 1, fileB)) {
            printf("Failed: Read from File_B!\n");
            return 1;
        }
        if (EOF == fputs(buffer, fileC)) {
            printf("Failed: Wirte to File_C!\n");
            return 1;
        }
    } 

    rewind(fileC);
    if (!fgets(buffer, MAX_LENGTH * 2 + 1, fileC)) {
        printf("Failed: Read from File_C!\n");
        return 1;
    }
    printf("Finally, File C is:\n============START===========\n");
    printf("%s", buffer);
    printf("\n=============END============\n");

    fclose(fileA);
    fclose(fileB);
    fclose(fileC);

    return 0;
}
