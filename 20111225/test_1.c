#include <stdio.h>

void allocateInt(int * i) {
    i = (int *)malloc(sizeof(int));
    *i = 5;
    printf("%d", *i);
}

void main() {
    int * i;
    allocateInt(i);
    printf("*i = %d\n", *i);
    char str[] = "Hello";
    char *p = str;
    int n = 10;
    short j = 5;
    printf("%d %d %d %d\n", sizeof(str), sizeof(p), sizeof(n), sizeof(j));
}

