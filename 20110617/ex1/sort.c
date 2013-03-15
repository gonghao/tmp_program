#include <stdlib.h>

#include "sort.h"

/* 比较函数: 若pA < pB, 返回1; 否则返回0*/
int compareArrivingOverallTime(Pcb *pA, Pcb *pB)
{
	if ((pA->tArriving < pB->tArriving) || ((pA->tArriving == pB->tArriving) && (pA->tOverall < pB->tOverall)))
		return 1;
    else
    	return 0;
}


/* 冒泡排序 */
void BubbleSort(PPQueue *ready, int (*compareFun)(Pcb *, Pcb *))
{ 
    PcbQueue *p1;  
    PcbQueue *p2;
	Pcb *block;
	
    for (p1 = ready->head; p1->next != NULL; p1 = p1->next) { 
        for (p2 = p1->next; p2 != NULL; p2 = p2->next) { 
            if (compareFun(p2->block, p1->block)) {
				block = p1->block;
				p1->block = p2->block;
				p2->block = block;
			}
		}
	}
}

