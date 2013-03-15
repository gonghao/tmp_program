#ifndef __SCHEDULE_H__
#define __SCHEDULE_H__

#include "process.h"

/* ��ʼ��PCB��Ϳ������ */
int InitGQueues(GQueues *gq);

/* �ͷ��ڴ� */
void DestroyGQueues(GQueues *gq) ;

/* ����PCB�ڴ�� */
int allocPcb(GQueues *gq, int pid, int tServing, int tArriving);
/* ����PCB�� */
void collectPcb(GQueues *gq);

/* RR�㷨 */
void invokeRR(PPQueue *ready, int flag);
/* SPF�㷨 */
void invokeSpf(PPQueue *ready);

/* ����ִ�н��̵�pid, -1��ʾ�޾������� */
int running(PcbQueue *head);

/* ��ͷ�����Ƿ������1Ϊ������� */
int finishReadyHead(GQueues *gq);


#endif /* __SCHEDULE_H__ */
