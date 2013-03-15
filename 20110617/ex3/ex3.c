#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int neicun=200;//内存块默认大小
int fqNum=1;//已使用分区数目，进程数目=fqNum-1
#define number 100//进程数量
struct fqinfo//分区信息
{ 
	int start;//开始位置 
	int end;//结束位置 
	char name;//进程名称
	int capactity;//进程大小或者分区块大小
	int flag;//分区使用标记，0：未使用   1：已使用  2:回收或者合并的分区  3:尾部
}fqlist[number];

int init_neicun();//初始化内存大小
int first_fit(char name,int size);//首次适应算法
int fenpei();//为进程存储区
int showit();//显示进程
int menu();//功能菜单
int Memory_recovery();//内存回收

int main(){
	init_neicun();//初始化内存大小
	menu();
	return 0;
}
int menu(){
	int select;
	printf("\n---------------------------------------\n");
	printf("   1: 添加进程          2: 回收内存\n");
	printf("   3: 查看内存分配      4: 退出\n");
	printf("---------------------------------------\n");
	printf("please input you choice:");
	scanf("%d",&select);
	switch(select){
        case 1:fenpei();break;
        case 2:Memory_recovery();break;
        case 3:showit();break;
        case 4:exit(0);break;
	}
	menu();
	return 0;
}
int init_neicun(){
    int i;
	for(i=0;i<number;i++){
		fqlist[i].name='$';
		fqlist[i].start=0;
		fqlist[i].end=0;
		fqlist[i].capactity=0;
		fqlist[i].flag=0;
	}
	printf("请输入内存大小:");
	scanf("%d",&neicun);	
	printf("内存大小neicun=%d\n",neicun);
	fqlist[0].capactity=neicun;
	fqlist[0].start=0;
	fqlist[0].end=neicun-1;
	fqlist[0].flag=3;
	return 0;
}
int fenpei(){
	getchar();
	char m;
	int n;
	printf("请输入进程的名称和大小（空格分隔）：");
	scanf("%c %d",&m,&n);
	first_fit(m,n);
	return 0;
}
int first_fit(char jname,int size){
	//printf("name=%c,size=%d,number=%d\n",jname,size,number);
	//int count=0;
	int flag=0;//默认情况分配失败 1时分配成功
	int i, j, sum=0;
	for(i=0;i<number&&flag==0;i++){
		if(fqlist[i].flag!=1){//当某一分区不在使用时
			if(fqlist[i].capactity>size)
			{
				//printf("fenpei name=%c,size=%d\n",jname,size);			
				if(i<number-1){
					//分配内存，已使用内存块增加
					for(j=number-1;j>i;j--)
					{
						fqlist[j]=fqlist[j-1];
					}
					fqlist[i+1].name='$';
					fqlist[i+1].start=sum+size;
					fqlist[i+1].end=fqlist[i].end;
					fqlist[i+1].capactity=fqlist[i].capactity-size;
					fqlist[i+1].flag=fqlist[i].flag;
				}
				fqlist[i].name=jname;
				fqlist[i].start=sum;
				fqlist[i].end=sum+size-1;
				fqlist[i].capactity=size;
				fqlist[i].flag=1;
				fqNum++;//进程数目增1
				//需要把以后的分区块往后一个位置
				flag=1;				
			}else{
				//当未使用的分区块大小不足时
				sum=sum+fqlist[i].capactity;			
			}		
		}else{//当该分区块在使用时
			sum=sum+fqlist[i].capactity;
			//count++;//记录已查询出的分区块个数
		}
	}
	if(flag==1)
		printf("已为进程%c分配内存区！\n",jname);
	else
		printf("为进程%c分配内存区失败！\n",jname);
	return 0;
}
int Memory_recovery(){
	int flag=0;//标记回收是否成功 0：失败    1：成功
	int sflag=0;//
	int tflag=0;//
    int i, j;
	char jname='z';
	getchar();//吸收空白键
	printf("请输入进程名称:");
	scanf("%c",&jname);
	for(i=0;i<number;i++){
		if(fqlist[i].name==jname){
			fqlist[i].name='$';		
			fqlist[i].flag=2;//表示为回收的内存区
			flag=1;
			fqNum--;
		}
	}
	if(flag==1)
		printf("进程%c结束，内存回收成功！\n",jname);
	else
		printf("进程%c无法结束，内存回收失败！\n",jname);
	//将连续的已回收的内存区合并
	while(flag<3){		
		for(i=0;i<number-1;i++){
			if(fqlist[i].flag==0||fqlist[i].flag==2){
				if(fqlist[i+1].flag!=1){
					if(fqlist[i+1].flag==3)
					{	
						fqlist[i].end=fqlist[i+1].end;
						fqlist[i].capactity=fqlist[i].capactity+fqlist[i+1].capactity;
						fqlist[i].flag=fqlist[i+1].flag;
						for(j=i+1;j<number-1;j++)
						{
							fqlist[j]=fqlist[j+1];
						}
						i=number;
						flag++;
					}
					else{
						fqlist[i].end=fqlist[i+1].end;
						fqlist[i].capactity=fqlist[i].capactity+fqlist[i+1].capactity;
						fqlist[i].flag=fqlist[i+1].flag;
						for(j=i+1;j<number-1;j++)
						{
							fqlist[j]=fqlist[j+1];
						}					
					}
				}
			}
		}
		flag++;
		
	}
	return 0;
}
int showit(){//显示进程情况
	int count=0, i;
	printf("进程名称   开始位置   结束位置   进程大小   状态\n");
	for(i=0;i<number-1&&count<fqNum;i++)
	{	
		printf("%5c%10d%12d%10d",fqlist[i].name,fqlist[i].start,fqlist[i].end,fqlist[i].capactity);
		if(fqlist[i].flag==1){
			printf("     已使用\n");
			count++;
		}
		else if(fqlist[i].flag==3){
			printf("     尾部\n");
			count++;
		}else if(fqlist[i].flag==2){
			printf("     未使用\n");
		}else if(fqlist[i].flag==0){
			printf("     未使用\n");
		}
	}
	return 0;
}

