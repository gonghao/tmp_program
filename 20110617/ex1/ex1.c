/*
 * 实验1. 进程调度算法的设计
 * 
 * 实验目的：通过对进程调度算法的设计，深入理解进程调度的原理
 *
 * 实验内容
 *	实现短进程优先调度算法（SPF）和时间片轮转调度算法（RR）
 *
 * 实验要求
 *	- 进程通过定义一个进程控制块的数据结构（PCB）来表示；
 *	- 每个进程需要赋予进程ID、进程到达时间、进程需要运行的总时间的属性；
 *	- 在RR中，以1为时间片单位；
 */

#include <stdio.h>
#include <stdlib.h>

#include "process.h"
#include "sort.c"
#include "queue.c"

#include "schedule.c"

int main(int argc, char *argv[])
{
	int i, nProc, nSchedule;
	GQueues *gq;
	int ret;

	int tServing, tArriving;

	int pid;

	int nTime = 0;

	int RRflag;


	for (i = 0; i < 0; i++)
		pid = 1;


	gq = (GQueues *)malloc(sizeof(GQueues));
    if (gq == NULL)
		return 1;
    
	ret = InitGQueues(gq);
	if (ret != 0)
		return 2;
 
	
	/* 录入数据 */
Retry0:
	printf("Please input the number of processes: "); 
	scanf("%d",&nProc);
	if (nProc < 0 || nProc > MAX_PCB_NUM) {
		printf("Error! the number must be less than %d", MAX_PCB_NUM);
		goto Retry0;
	}

	for (i = 0; i < nProc; ++i) {
		
		printf("No. %d\n", i);
		printf("\t Serving time: ");
		scanf("%d", &tServing);
		printf("\t Arriving time: ");
		scanf("%d", &tArriving);

		allocPcb(gq, i, tServing, tArriving);
	}


Retry1:
	printf("Please input the choice of scheduling[0(RR)/1(SPF)]: ");
	scanf("%d", &nSchedule);
	if (nSchedule < 0 || nSchedule > 1) {
		printf("Error, please retry\n");
		goto Retry1;
	}

	/* 实验测试 */
	RRflag = 0;
	do {
		/* 调度就绪队列 */
		switch (nSchedule)
		{
		case RR:
			invokeRR(&(gq->qReady), RRflag);
			break;
		case SPF:
			invokeSpf(&(gq->qReady));
			break;
		default:
			break;
		}

		/* 运行 */
		printf("nTime = %d,\t", nTime++);
		pid = running(gq->qReady.head);
		printf("pid = %d\n", pid);

		/* 就绪队列的队头是否运行完毕？*/
		RRflag = finishReadyHead(gq);

		/* 是否全部运行完毕？*/
		if (gq->qReady.head == NULL)
			break;
	} while (1);

	/* 结束实验，清理内存 */
	DestroyGQueues(gq);

	//getch();

	return 0;

}
