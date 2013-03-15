#include<stdio.h>
#include<string>
#include<iostream.h>
#include<stdlib.h>
#include<iomanip.h>
#include<conio.h>
using std::string;

const int MAX_P=20;
const int MAXA=10; //����A����Դ������
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

//��ʼ������
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

    cout<<"ϵͳ�ṩ��A����Դ����"<<MAXA<<endl;
    cout<<"ϵͳ�ṩ��B����Դ����"<<MAXB<<endl;
    cout<<"ϵͳ�ṩ��C����Դ����"<<MAXC<<endl;
}



//�¼���ҵ

void add()
{
    char name[20];
    int flag=0;
    int t;
    int need_a,need_b,need_c;
    int i;

    cout<<"ϵͳʣ��A����Դ����"<<banker.available_a<<endl;
    cout<<"ϵͳʣ��B����Դ����"<<banker.available_b<<endl;
    cout<<"ϵͳʣ��C����Դ����"<<banker.available_c<<endl;


    cout<<endl;
    cout<<"�¼���ҵ"<<endl;
    cout<<"��������������������������������������������������������"<<endl;
    cout<<"�������¼���ҵ��:";
    cin>>name;

    cout<<quantity<<endl;
    for(i=0;i<quantity;i++){
      if(!strcmp(processes[i].name,name)){
      flag=1;
      break;
      }
    }

    if(flag){
      cout<<"����,��ҵ�Ѵ���"<<endl;
    }

    else{
        cout<<"����ҵ����A����Դ:";
        cin>>need_a;
        cout<<"����ҵ����B����Դ:";
        cin>>need_b;
        cout<<"����ҵ����C����Դ:";
        cin>>need_c;

        t=1;
        cout<<need_a<<banker.available_a;
        if(need_a>banker.available_a){
            cout<<"����,����A����Դ�������м���ʣA����Դ"<<endl;
            t=0;
        }

        if(need_b>banker.available_b){
            cout<<"����,����B����Դ�������м���ʣB����Դ"<<endl;
            t=0;
        }

        if(need_c>banker.available_c){
            cout<<"����,����C����Դ�������м���ʣC����Դ"<<endl;
            t=0;
        }

        if(t){
            strcpy(processes[quantity].name,name);
            processes[quantity].max_a=need_a;
            processes[quantity].max_b=need_b;
            processes[quantity].max_c=need_c;

            quantity++;
            cout<<"�½�����ӳɹ�"<<endl;
        }

        else{
            cout<<"�½������ʧ��"<<endl;
        }
    }
}



//Ϊ��ҵ������Դ

void bid()
{
    char name[20];
    int i,p;
    int a,b,c;
    int flag;

    cout<<endl<<"Ϊ��ҵ������Դ"<<endl;
    cout<<"��������������������������������������������������������"<<endl;
    cout<<"Ҫ������Դ����ҵ��:";
    cin>>name;

    p=-1;
    for(i=0;i<quantity;i++){
        if(!strcmp(processes[i].name,name)){
            p=i;
            break;
        }
    }

    if(p!=-1){
        cout<<"����ҵҪ����A����Դ����:";
        cin>>a;
        cout<<"����ҵҪ����B����Դ����:";
        cin>>b;
        cout<<"����ҵҪ����C����Դ����:";
        cin>>c;

        flag=1;
        if((a>banker.available_a)||(a>processes[p].max_a-processes[p].allocation_a)){
            cout<<"����,������A����Դ�������м���ʣA����Դ��ý��̻�������"<<endl;
            flag=0;
        }

        if((b>banker.available_b)||(b>processes[p].max_b-processes[p].allocation_b)){
            cout<<"����,������B����Դ�������м���ʣB����Դ��ý��̻�������"<<endl;
            flag=0;
        }

        if((c>banker.available_c)||(c>processes[p].max_c-processes[p].allocation_c)){
            cout<<"����,������C����Դ�������м���ʣC����Դ��ý��̻�������"<<endl;
            flag=0;
        }

        if(flag){
            banker.available_a-=a;
            banker.available_b-=b;
            banker.available_c-=c;

            processes[p].allocation_a+=a;
            processes[p].allocation_b+=b;
            processes[p].allocation_c+=c;

            cout<<"Ϊ��ҵ������Դ�ɹ�"<<endl;
        }
        else{
            cout<<"Ϊ��ҵ������Դʧ��"<<endl;
        }
    }
    else{
        cout<<"����ҵ������"<<endl;
    }
}



//������ҵ

void finished()
{
    char name[20];
    int i,p;

    cout<<endl<<"������ҵ"<<endl;
    cout<<"��������������������������������������������������������"<<endl;
    cout<<"Ҫ������ҵ��:";
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
        cout<<"������ҵ�ɹ�"<<endl;
    }

    else{
        cout<<"������ҵʧ��"<<endl;
    }
}

//�鿴��Դ���

void view()
{
    int i;
    cout<<endl<<"�鿴��Դ���"<<endl;
    cout<<"��������������������������������������������������������"<<endl;
    cout<<"���м���ʣ��Դ(ʣ����Դ/�ܹ���Դ)"<<endl;
    cout<<"A��:"<<banker.available_a<<"/"<<MAXA;
    cout<<" B��:"<<banker.available_b<<"/"<<MAXB;
    cout<<" C��:"<<banker.available_c<<"/"<<MAXC;

    cout<<endl<<endl<<"��ҵռ�����(��ռ����Դ/������Դ)"<<endl<<endl;
    if(quantity>0){
        for(i=0;i<quantity;i++){
            cout<<"��ҵ��:"<<processes[i].name<<endl;
            cout<<"A��:"<<processes[i].allocation_a<<"/"<<processes[i].max_a;
            cout<<" B��:"<<processes[i].allocation_b<<"/"<<processes[i].max_b;
            cout<<" C��:"<<processes[i].allocation_c<<"/"<<processes[i].max_c;
            cout<<endl;
        }
    }
    else{
        cout<<"��ǰû����ҵ"<<endl;
    }
}

//��ʾ��Ȩ��Ϣ����
void version()
{
    cout<<endl<<endl;
    cout<<" �� �� �� �� ��"<<endl;
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
			cout<<"�Ҳ������ʵİ�ȫ����"<<endl;
	}else{
		   cout<<"��ȫ����Ϊ"<<endl;
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
        cout<<"��������������������������������������������������������"<<endl;
        cout<<"1.�¼���ҵ 2.Ϊ��ҵ������Դ 3.������ҵ"<<endl;
        cout<<"4.�鿴��Դ��� 5.��ȡ��ȫ����0.�˳�ϵͳ"<<endl;
        cout<<"��ѡ��:";
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
                cout<<"ѡ�����"<<endl<<endl;
        }
    }
}
