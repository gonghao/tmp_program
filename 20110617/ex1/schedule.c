#include <stdio.h>
#include <stdlib.h>

#include "process.h"
#include "sort.h"
#include "queue.h"

#include "schedule.h"

Pcb pcbBlock[MAX_PCB_NUM];

/* 初始化PCB块和空余队列, 若成功则返回0 */
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

/* 释放内存 */
void DestroyGQueues(GQueues *gq) 
{
	freeQ(gq->qFree.head);
	free(gq);
}

/* 分配PCB内存块 */
int allocPcb(GQueues *gq, int pid, int tServing, int tArriving)
{
	PcbQueue *freePcb;

	/* 取空余队列对头 */
	freePcb = gq->qFree.head;
	if (freePcb == NULL) /* 空余队列为空 */
		return 1;

	gq->qFree.head = freePcb->next;

	/* 填充Pcb块 */
	freePcb->next = NULL;
	freePcb->block->pid = pid;
	freePcb->block->state = READY;
	freePcb->block->tOverall = tServing;
	freePcb->block->tArriving = tArriving;
	
	/* 添加至就绪队列 */
	if (gq->qReady.head == NULL) {
		gq->qReady.head = freePcb;
        gq->qReady.tail = freePcb;
	} else {
		gq->qReady.tail->next = freePcb;
		gq->qReady.tail = freePcb;
	}

	return 0;
}

/* 回收PCB块 */
void collectPcb(GQueues *gq)
{
	PcbQueue *unusedPcb;

	/* 取就绪队列队头 */
	unusedPcb = gq->qReady.head;
	gq->qReady.head = unusedPcb->next;
	unusedPcb->next = NULL;

    /* 添加至空余队列 */
	if (gq->qFree.head == NULL) {
		gq->qFree.head = unusedPcb;
        gq->qFree.tail = unusedPcb;
	} else {
		gq->qFree.tail->next = unusedPcb;
		gq->qFree.tail = unusedPcb;
	}
}

/* RR算法 */
void invokeRR(PPQueue *ready, int flag)
{
	PcbQueue *p;
	PcbQueue *newHead;
	
	if (ready->head == NULL)
		return;

	/* 找到第一个(tArriving == 0 &&  tRunnng == 0)的进程 */
	newHead = ready->head;
	while (1) {
		if ((newHead == NULL) || ((newHead->block->tArriving == 0) && (newHead->block->tRunnng == 0)))
		    break;

		newHead = newHead->next;
	}
	

	/* 移动队列 */
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
	
	/* 找到第一个(tArriving == 0)的合适进程 */
	if (flag == 0)
		newHead = ready->head->next;
	else
		newHead = ready->head;
	while (1) {
		if ((newHead == NULL) || (newHead->block->tArriving == 0))
		    break;

		newHead = newHead->next;
	}

	/* 移动队列 */
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

/* SPF算法 */
void invokeSpf(PPQueue *ready)
{
	/* 若当前无正在执行的进程则排序 */
	if (ready->head->block->tRunnng == 0)
		BubbleSort(ready, compareArrivingOverallTime);

	return;
}

/* 返回执行进程的pid, -1表示无就绪进程 */
int running(PcbQueue *head)
{
	int pid;
	PcbQueue *p;

	/* 取就绪队列的队头 */
	if (head->block->tArriving == 0) {
		head->block->state = RUNNING;
		pid = head->block->pid;
		head->block->tRunnng++;
		head->block->state = READY;
	}
	else
		pid = -1;

	/* 就绪队列中的所有进程，到达时间减1 */
	p = head;
	while (p != NULL) {
		if (p->block->tArriving > 0)
			p->block->tArriving--;
		p = p->next;
	}

	return pid;
}

/* 队头进程是否结束，1为运行完毕 */
int finishReadyHead(GQueues *gq)
{
	int tNeed;
	/* 就绪队列的队头是否运行完毕？*/
	tNeed = gq->qReady.head->block->tOverall - gq->qReady.head->block->tRunnng; 
	if (tNeed == 0) {
		collectPcb(gq);
		return 1;
	}
	
	return 0;
}
