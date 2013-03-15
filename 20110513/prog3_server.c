/* program 6.3 */
#include "local.h"
#include <stdlib.h>
#include <string.h>
int  main(int argc, char *argv[]) {
  int  mid, n, i;
  int    cnt = 0, count_msg=0;
  unsigned  char ture = 1;
  long  int  before_TypeMsg[100];
  MESSAGE msg;
  void  process_msg(char *, int);
  if (argc != 2) {
      printf("Usage: %s msq_id &\n", argv[0]);
      return 1;
  }
  mid = atoi(argv[1]);
  while (1) {
   memset( msg.buffer, 0x0, BUFSIZ );
   if ((n=msgrcv(mid, &msg, BUFSIZ, SERVER, 0)) == -1 ) {
    perror("Server: msgrcv");
    return 2;
   }
   for (i=0 ; i<cnt ; i++) {
      if (before_TypeMsg [i] == msg.msg_fm) {
         ture = 0;
         break;
     }
        ture = 1;
}
    if ( ture ) {
        before_TypeMsg[cnt] = msg.msg_fm;
        cnt = cnt +1;
        count_msg = count_msg +1;
}
if (n == 0) {
    count_msg = count_msg - 1;
}
if (count_msg == 0 ) break;
    process_msg(msg.buffer, strlen(msg.buffer));
    msg.msg_to = msg.msg_fm;
    msg.msg_fm = SERVER;
    n += sizeof(msg.msg_fm);
    if (msgsnd(mid, &msg, n, 0) == -1 ) {
     perror("Server: msgsnd");
     return 3;
    }
   }
   msgctl(mid, IPC_RMID, (struct msqid_ds *) 0 );
   exit(0);
}

/* Convert lower case alphabetics to upper case */
void process_msg(char *b, int len){
  int i;
  for (i = 0; i < len; ++i)
    if (isalpha(*(b + i)))
      *(b + i) = toupper(*(b + i));
}

