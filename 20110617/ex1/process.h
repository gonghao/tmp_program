#ifndef __PROCESS_H__
#define __PROCESS_H__

enum {READY, RUNNING}; /* ����״̬ */
enum {RR, SPF}; /* �����㷨 */

typedef struct _Pcb{
	int pid;			/* ����ID */
	char name[20];		/* ������ */

	int state;			/* ����״̬ */
	int priority;		/* �������ȼ� */

	int tArriving;		/* ����ʱ�� */
	int tOverall;		/* ������ʱ�� */
	int tRunnng;		/* ������ʱ�� */
} Pcb;

typedef struct _PcbQueue{
	Pcb *block;		            /* Pcb������ */
	struct _PcbQueue *next;		/* ָ���� */
} PcbQueue;


typedef struct _PPQueue{	            
	PcbQueue *head;
	PcbQueue *tail;
} PPQueue;


typedef struct _GQueues{
	PPQueue qFree;		/* ������� */
	PPQueue qReady;		/* �������� */
} GQueues;


/* �����������PCB����� */
#define MAX_PCB_NUM 10
extern Pcb pcbBlock[MAX_PCB_NUM];

#endif /* __PROCESS_H__ */