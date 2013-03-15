#include <stdlib.h>

#include "queue.h"

/* 创建队列 */
PcbQueue * createQ(Pcb *block)
{
    PcbQueue *head;

	head = (PcbQueue *)malloc(sizeof(PcbQueue));
    if (head != NULL) {
	    head->block = block;
		head->next = NULL;
	}

    return head;
}

/* 添加队列 */
PcbQueue * appendQ(PcbQueue *tail, Pcb *block)
{
    PcbQueue *newTail;

    newTail = (PcbQueue *)malloc(sizeof(PcbQueue));
    if (newTail != NULL) {
		newTail->block = block;
		newTail->next = NULL;
		tail->next = newTail;
	}

    return newTail;
}

/* 删除队列 */
void freeQ(PcbQueue *head)
{
    PcbQueue *p = head;
    while(p != NULL) {
        head = head->next;
        free(p);
        p = head;
    }

    return;
}
