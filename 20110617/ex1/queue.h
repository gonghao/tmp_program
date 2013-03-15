#ifndef __QUEUE_H__
#define __QUEUE_H__

#include "process.h"

/* �������� */
PcbQueue * createQ(Pcb *block);

/* ��Ӷ��� */
PcbQueue * appendQ(PcbQueue *tail, Pcb *block);

/* ɾ������ */
void freeQ(PcbQueue *head);

#endif /* __QUEUE_H__ */
