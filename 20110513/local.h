#define _GNU_SOURCE
#include <sys/types.h>
#include <sys/msg.h>
#include <unistd.h>
#include <stdio.h>
const char SEED = 'M';
const long int SERVER = 1L;
typedef struct {
    long int msg_to;
    long int msg_fm;
    char buffer [BUFSIZ];
} MESSAGE;
