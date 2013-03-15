#include<stdio.h>
#include<string>
#include<iostream.h>
#include<stdlib.h>
#include<iomanip.h>
#include<conio.h>
using std::string;

const int MAX_P=20;
const int MAXA=10; //定义A类资源的数量
const int MAXB=5;
const int MAXC=7;

typedef struct node{
    int available_a;
    int available_b;
    int available_c;
}bank;



typedef struct node1{
    char name[20];
    int max_a;
    int max_b;
    int max_c;
    int allocation_a;
    int allocation_b;
    int allocation_c;
}process;

bank banker;
process processes[MAX_P];
int quantity;

//初始化函数
void initial()
{
    int i;
    banker.available_a=MAXA;
    banker.available_b=MAXB;
    banker.available_c=MAXC;

    for(i=0;i<MAX_P;i++){
        strcpy(processes[i].name,"");
        processes[i].max_a=0;
        processes[i].max_b=0;
        processes[i].max_c=0;
        processes[i].allocation_a=0;
        processes[i].allocation_b=0;
        processes[i].allocation_c=0;
    }

    cout<<"系统提供的A类资源共有"<<MAXA<<endl;
    cout<<"系统提供的B类资源共有"<<MAXB<<endl;
    cout<<"系统提供的C类资源共有"<<MAXC<<endl;
}



//新加作业

void add()
{
    char name[20];
    int flag=0;
    int t;
    int need_a,need_b,need_c;
    int i;

    cout<<"系统剩余A类资源共有"<<banker.available_a<<endl;
    cout<<"系统剩余B类资源共有"<<banker.available_b<<endl;
    cout<<"系统剩余C类资源共有"<<banker.available_c<<endl;


    cout<<endl;
    cout<<"新加作业"<<endl;
    cout<<"━━━━━━━━━━━━━━━━━━━━━━━━━━━━"<<endl;
    cout<<"请输入新加作业名:";
    cin>>name;

    cout<<quantity<<endl;
    for(i=0;i<quantity;i++){
      if(!strcmp(processes[i].name,name)){
      flag=1;
      break;
      }
    }

    if(flag){
      cout<<"错误,作业已存在"<<endl;
    }

    else{
        cout<<"本作业所需A类资源:";
        cin>>need_a;
        cout<<"本作业所需B类资源:";
        cin>>need_b;
        cout<<"本作业所需C类资源:";
        cin>>need_c;

        t=1;
        cout<<need_a<<banker.available_a;
        if(need_a>banker.available_a){
            cout<<"错误,所需A类资源大于银行家所剩A类资源"<<endl;
            t=0;
        }

        if(need_b>banker.available_b){
            cout<<"错误,所需B类资源大于银行家所剩B类资源"<<endl;
            t=0;
        }

        if(need_c>banker.available_c){
            cout<<"错误,所需C类资源大于银行家所剩C类资源"<<endl;
            t=0;
        }

        if(t){
            strcpy(processes[quantity].name,name);
            processes[quantity].max_a=need_a;
            processes[quantity].max_b=need_b;
            processes[quantity].max_c=need_c;

            quantity++;
            cout<<"新进程添加成功"<<endl;
        }

        else{
            cout<<"新进程添加失败"<<endl;
        }
    }
}



//为作业申请资源

void bid()
{
    char name[20];
    int i,p;
    int a,b,c;
    int flag;

    cout<<endl<<"为作业申请资源"<<endl;
    cout<<"━━━━━━━━━━━━━━━━━━━━━━━━━━━━"<<endl;
    cout<<"要申请资源的作业名:";
    cin>>name;

    p=-1;
    for(i=0;i<quantity;i++){
        if(!strcmp(processes[i].name,name)){
            p=i;
            break;
        }
    }

    if(p!=-1){
        cout<<"该作业要申请A类资源数量:";
        cin>>a;
        cout<<"该作业要申请B类资源数量:";
        cin>>b;
        cout<<"该作业要申请C类资源数量:";
        cin>>c;

        flag=1;
        if((a>banker.available_a)||(a>processes[p].max_a-processes[p].allocation_a)){
            cout<<"错误,所申请A类资源大于银行家所剩A类资源或该进程还需数量"<<endl;
            flag=0;
        }

        if((b>banker.available_b)||(b>processes[p].max_b-processes[p].allocation_b)){
            cout<<"错误,所申请B类资源大于银行家所剩B类资源或该进程还需数量"<<endl;
            flag=0;
        }

        if((c>banker.available_c)||(c>processes[p].max_c-processes[p].allocation_c)){
            cout<<"错误,所申请C类资源大于银行家所剩C类资源或该进程还需数量"<<endl;
            flag=0;
        }

        if(flag){
            banker.available_a-=a;
            banker.available_b-=b;
            banker.available_c-=c;

            processes[p].allocation_a+=a;
            processes[p].allocation_b+=b;
            processes[p].allocation_c+=c;

            cout<<"为作业申请资源成功"<<endl;
        }
        else{
            cout<<"为作业申请资源失败"<<endl;
        }
    }
    else{
        cout<<"该作业不存在"<<endl;
    }
}



//撤消作业

void finished()
{
    char name[20];
    int i,p;

    cout<<endl<<"撤消作业"<<endl;
    cout<<"━━━━━━━━━━━━━━━━━━━━━━━━━━━━"<<endl;
    cout<<"要撤消作业名:";
    cin>>name;

    p=-1;
    for(i=0;i<quantity;i++){
        if(!strcmp(processes[i].name,name)){
            p=i;
            break;
        }
    }

    if(p!=-1){
        banker.available_a+=processes[p].max_a;
        banker.available_b+=processes[p].max_b;
        banker.available_c+=processes[p].max_c;

        for(i=p;i<quantity-1;i++){
            processes[i]=processes[i+1];
        }

        strcpy(processes[quantity-1].name,"");
        processes[quantity-1].max_a=0;
        processes[quantity-1].max_b=0;
        processes[quantity-1].max_c=0;
        processes[quantity-1].allocation_a=0;
        processes[quantity-1].allocation_b=0;
        processes[quantity-1].allocation_c=0;

        quantity--;
        cout<<"撤消作业成功"<<endl;
    }

    else{
        cout<<"撤消作业失败"<<endl;
    }
}

//查看资源情况

void view()
{
    int i;
    cout<<endl<<"查看资源情况"<<endl;
    cout<<"━━━━━━━━━━━━━━━━━━━━━━━━━━━━"<<endl;
    cout<<"银行家所剩资源(剩余资源/总共资源)"<<endl;
    cout<<"A类:"<<banker.available_a<<"/"<<MAXA;
    cout<<" B类:"<<banker.available_b<<"/"<<MAXB;
    cout<<" C类:"<<banker.available_c<<"/"<<MAXC;

    cout<<endl<<endl<<"作业占用情况(已占用资源/所需资源)"<<endl<<endl;
    if(quantity>0){
        for(i=0;i<quantity;i++){
            cout<<"作业名:"<<processes[i].name<<endl;
            cout<<"A类:"<<processes[i].allocation_a<<"/"<<processes[i].max_a;
            cout<<" B类:"<<processes[i].allocation_b<<"/"<<processes[i].max_b;
            cout<<" C类:"<<processes[i].allocation_c<<"/"<<processes[i].max_c;
            cout<<endl;
        }
    }
    else{
        cout<<"当前没有作业"<<endl;
    }
}

//显示版权信息函数
void version()
{
    cout<<endl<<endl;
    cout<<" 银 行 家 算 法"<<endl;
    cout<<"nichenjian@gmail.com"<<endl;
    cout<<endl<<endl;
}

void result(){
    int  k = 0, j, i , flag;
    int need_a, need_b, need_c;
    string  finish[MAX_P];
   while(quantity > 0){
		flag = quantity;
	    for(i = 0; i < quantity; i++){
	    	need_a  = processes[i].max_a - processes[i].allocation_a ;
	    	need_b  = processes[i].max_b - processes[i].allocation_b;
	    	need_c = processes[i].max_c - processes[i].allocation_c;
			if((need_a <= banker.available_a) && ( need_b <= banker.available_b)&&(need_c <= banker.available_c)){
				cout<<"success"<<endl;
				finish[k] = processes[i].name;
				k++;
				quantity--;
				banker.available_a +=  processes[i].max_a;
				banker.available_b +=  processes[i].max_b;
				banker.available_c +=  processes[i].max_c;
				processes[i].max_a = 0;
				processes[i].max_b = 0;
				processes[i].max_c = 0;
				processes[i].allocation_a = 0;
				processes[i].allocation_b = 0;
				processes[i].allocation_c = 0;
				cout<<banker.available_a<<banker.available_b<<banker.available_c<<endl;
				for(j = i; j < quantity; j++){
						processes[j] = processes[j+1];
				}
			}
	    }
	    cout<<flag<<endl;
	    cout<<quantity<<endl;
	    if(flag == quantity){
				break;
		}
    }
    if( quantity != 0){
			cout<<"找不到合适的安全序列"<<endl;
	}else{
		   cout<<"安全序列为"<<endl;
		  for(int n = 0; n < MAX_P; n++){
				cout<<finish[n]<<endl;
		  }
	}
}

int  main()
{
    int choose;
    int flag=1;
    initial();
    version();
    while(flag){
        cout<<"━━━━━━━━━━━━━━━━━━━━━━━━━━━━"<<endl;
        cout<<"1.新加作业 2.为作业申请资源 3.撤消作业"<<endl;
        cout<<"4.查看资源情况 5.获取安全序列0.退出系统"<<endl;
        cout<<"请选择:";
        cin>>choose;
        switch(choose){
            case 1:
                add();
            break;
            case 2:
                bid();
            break;
            case 3:
                finished();
            break;
            case 4:
                view();
            break;
            case 5:
                result();
            break;
            case 0:
                flag=0;
            break;
            default:
                cout<<"选择错误"<<endl<<endl;
        }
    }
}
