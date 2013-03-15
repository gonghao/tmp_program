#include <stdio.h>
#include <stdlib.h>

#include "process.h"
#include "sort.h"
#include "queue.h"

#include "schedule.h"

Pcb pcbBlock[MAX_PCB_NUM];

/* ��ʼ��PCB��Ϳ������, ���ɹ��򷵻�0 */
int InitGQueues(GQueues *gq) 
{
	int i;
	PcbQueue *freeHead;
	PcbQueue *freeTail;
	
	pcbBlock[0].pid = -1;
	freeHead = createQ(pcbBlock);
	if (freeHead == NULL)
		return 1;

	freeTail = freeHead;
	for (i = 1; i < MAX_PCB_NUM; ++i) {
		pcbBlock[i].pid = -1;
		freeTail = appendQ(freeTail, pcbBlock+i);
		if (freeTail == NULL)
			return 2;
	}

	gq->qFree.head = freeHead;
	gq->qFree.tail = freeTail;

	gq->qReady.head = NULL;
	gq->qReady.tail = NULL;

	return 0;
}

/* �ͷ��ڴ� */
void DestroyGQueues(GQueues *gq) 
{
	freeQ(gq->qFree.head);
	free(gq);
}

/* ����PCB�ڴ�� */
int allocPcb(GQueues *gq, int pid, int tServing, int tArriving)
{
	PcbQueue *freePcb;

	/* ȡ������ж�ͷ */
	freePcb = gq->qFree.head;
	if (freePcb == NULL) /* �������Ϊ�� */
		return 1;

	gq->qFree.head = freePcb->next;

	/* ���Pcb�� */
	freePcb->next = NULL;
	freePcb->block->pid = pid;
	freePcb->block->state = READY;
	freePcb->block->tOverall = tServing;
	freePcb->block->tArriving = tArriving;
	
	/* ������������� */
	if (gq->qReady.head == NULL) {
		gq->qReady.head = freePcb;
        gq->qReady.tail = freePcb;
	} else {
		gq->qReady.tail->next = freePcb;
		gq->qReady.tail = freePcb;
	}

	return 0;
}

/* ����PCB�� */
void collectPcb(GQueues *gq)
{
	PcbQueue *unusedPcb;

	/* ȡ�������ж�ͷ */
	unusedPcb = gq->qReady.head;
	gq->qReady.head = unusedPcb->next;
	unusedPcb->next = NULL;

    /* ������������ */
	if (gq->qFree.head == NULL) {
		gq->qFree.head = unusedPcb;
        gq->qFree.tail = unusedPcb;
	} else {
		gq->qFree.tail->next = unusedPcb;
		gq->qFree.tail = unusedPcb;
	}
}

/* RR�㷨 */
void invokeRR(PPQueue *ready, int flag)
{
	PcbQueue *p;
	PcbQueue *newHead;
	
	if (ready->head == NULL)
		return;

	/* �ҵ���һ��(tArriving == 0 &&  tRunnng == 0)�Ľ��� */
	newHead = ready->head;
	while (1) {
		if ((newHead == NULL) || ((newHead->block->tArriving == 0) && (newHead->block->tRunnng == 0)))
		    break;

		newHead = newHead->next;
	}
	

	/* �ƶ����� */
	p = ready->head;
	if (newHead != NULL) {
		while (p != newHead) {
			ready->tail->next = p;
			ready->tail = p;
			p = p->next;
			ready->tail->next = NULL;
		}
		ready->head = newHead;

		return;
	} 
	
	/* �ҵ���һ��(tArriving == 0)�ĺ��ʽ��� */
	if (flag == 0)
		newHead = ready->head->next;
	else
		newHead = ready->head;
	while (1) {
		if ((newHead == NULL) || (newHead->block->tArriving == 0))
		    break;

		newHead = newHead->next;
	}

	/* �ƶ����� */
	p = ready->head;
	if (newHead != NULL) {
		while (p != newHead) {
			ready->tail->next = p;
			ready->tail = p;
			p = p->next;
			ready->tail->next = NULL;
		}
		ready->head = newHead;
	}

	return;
}

/* SPF�㷨 */
void invokeSpf(PPQueue *ready)
{
	/* ����ǰ������ִ�еĽ��������� */
	if (ready->head->block->tRunnng == 0)
		BubbleSort(ready, compareArrivingOverallTime);

	return;
}

/* ����ִ�н��̵�pid, -1��ʾ�޾������� */
int running(PcbQueue *head)
{
	int pid;
	PcbQueue *p;

	/* ȡ�������еĶ�ͷ */
	if (head->block->tArriving == 0) {
		head->block->state = RUNNING;
		pid = head->block->pid;
		head->block->tRunnng++;
		head->block->state = READY;
	}
	else
		pid = -1;

	/* ���������е����н��̣�����ʱ���1 */
	p = head;
	while (p != NULL) {
		if (p->block->tArriving > 0)
			p->block->tArriving--;
		p = p->next;
	}

	return pid;
}

/* ��ͷ�����Ƿ������1Ϊ������� */
int finishReadyHead(GQueues *gq)
{
	int tNeed;
	/* �������еĶ�ͷ�Ƿ�������ϣ�*/
	tNeed = gq->qReady.head->block->tOverall - gq->qReady.head->block->tRunnng; 
	if (tNeed == 0) {
		collectPcb(gq);
		return 1;
	}
	
	return 0;
}
