/*
 * ʵ��1. ���̵����㷨�����
 * 
 * ʵ��Ŀ�ģ�ͨ���Խ��̵����㷨����ƣ����������̵��ȵ�ԭ��
 *
 * ʵ������
 *	ʵ�ֶ̽������ȵ����㷨��SPF����ʱ��Ƭ��ת�����㷨��RR��
 *
 * ʵ��Ҫ��
 *	- ����ͨ������һ�����̿��ƿ�����ݽṹ��PCB������ʾ��
 *	- ÿ��������Ҫ�������ID�����̵���ʱ�䡢������Ҫ���е���ʱ������ԣ�
 *	- ��RR�У���1Ϊʱ��Ƭ��λ��
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
 
	
	/* ¼������ */
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

	/* ʵ����� */
	RRflag = 0;
	do {
		/* ���Ⱦ������� */
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

		/* ���� */
		printf("nTime = %d,\t", nTime++);
		pid = running(gq->qReady.head);
		printf("pid = %d\n", pid);

		/* �������еĶ�ͷ�Ƿ�������ϣ�*/
		RRflag = finishReadyHead(gq);

		/* �Ƿ�ȫ��������ϣ�*/
		if (gq->qReady.head == NULL)
			break;
	} while (1);

	/* ����ʵ�飬�����ڴ� */
	DestroyGQueues(gq);

	//getch();

	return 0;

}
