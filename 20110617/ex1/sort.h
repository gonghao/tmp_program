#ifndef __SORT_H__
#define __SORT_H__

#include "process.h"

/* �ȽϺ���: ��pA < pB, ����1; ���򷵻�0*/
int compareArrivingOverallTime(Pcb *pA, Pcb *pB);

/* ð������ */
void BubbleSort(PPQueue *ready, int (*compareFun)(Pcb *, Pcb *));

#endif /* __SORT_H__ */