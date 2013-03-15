/* program 4.8 */
/* Pausing with sigsuspend */
#define _GNU_SOURCE
#include <signal.h>
#include <unistd.h>
#include <stdio.h>
int main() {
  void signal_catcher(int);
  struct sigaction new_action;
  sigset_t no_sigs, blocked_sigs, all_sigs;
 
  sigfillset (&all_sigs);       // turn all bits on
  sigemptyset(&no_sigs);    // turn all bits off
  sigemptyset(&blocked_sigs);
                                       
  // Associate with catcher
  new_action.sa_handler = signal_catcher;
  new_action.sa_mask  = all_sigs;
  new_action.sa_flags  = 0;
  if (sigaction(SIGUSR1, &new_action, NULL) == -1) {
    perror("SIGUSR1");
    return 1;
  }

  sigaddset( &blocked_sigs, SIGUSR1 );
  sigprocmask(SIG_SETMASK, &blocked_sigs, NULL);

  while (1) {
    printf("Waiting for SIGUSR1 signal\n");
    sigsuspend(&no_sigs);           // Wait
  }
  printf("Done.\n");
  return 0;
}

void signal_catcher(int n) {
  printf("Beginning important stuff\n");
  sleep(10); // Simulate work ....
  printf("Ending important stuff\n");
}

