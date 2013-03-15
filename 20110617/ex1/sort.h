#ifndef __SORT_H__
#define __SORT_H__

#include "process.h"

/* 比较函数: 若pA < pB, 返回1; 否则返回0*/
int compareArrivingOverallTime(Pcb *pA, Pcb *pB);

/* 冒泡排序 */
void BubbleSort(PPQueue *ready, int (*compareFun)(Pcb *, Pcb *));

#endif /* __SORT_H__ */