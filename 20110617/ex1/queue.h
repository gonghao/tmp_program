#ifndef __QUEUE_H__
#define __QUEUE_H__

#include "process.h"

/* 创建队列 */
PcbQueue * createQ(Pcb *block);

/* 添加队列 */
PcbQueue * appendQ(PcbQueue *tail, Pcb *block);

/* 删除队列 */
void freeQ(PcbQueue *head);

#endif /* __QUEUE_H__ */
