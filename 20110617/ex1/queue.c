#include <stdlib.h>

#include "queue.h"

/* �������� */
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

/* ��Ӷ��� */
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

/* ɾ������ */
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
