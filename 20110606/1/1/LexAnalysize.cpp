// ����ԭ��.cpp : �������̨Ӧ�ó������ڵ㡣
//
#include "stdafx.h"
#include "word.h"
#include   <stdlib.h> 
#define LETTER 1
#define BLACK 2
#define NUMBER 3
#define OTHER 0
#define  END  -1
#define  ONECHAR -2
int _tmain(int argc, _TCHAR* argv[])
{

	FILE *fpin,*fpout,*fperror;
	int c;
	//�ж���ĸ��ֵ
	int is_what;
	/**
	����ַ����� ���� 
	*/
	//    char character;    
	char ch[17];
	ch[0]='\0';
	char result[20];
	int i=0;
	int ch_index=0;
	int len;
	int is_end=0;
	//���������к�
	int line_number=0;
	/**
	����������ļ� 
	*/
	char fpin_name[80],fpout_name[80],fperror_name[80];
	printf("������Ҫ���дʷ��������ļ���:\n");
	scanf("%s",fpin_name);
	error_out_name(fpin_name, fpout_name, fperror_name);
	fpin=fopen(fpin_name,"r");
	fpout=fopen(fpout_name,"w");
	fperror=fopen(fperror_name,"w");
	if(fpin==NULL||fpout==NULL||fperror==NULL)
	{
		puts("���ļ�ʧ��");
		puts("\n");
		puts("��ȷ��������ļ����Ƿ�Ϸ����ļ��Ƿ���ʵ���ڣ�");
		exit(0);
	}
	else{
		while((c=getc(fpin))!=END	)
		{
			is_what=word_type(c);
			if(is_what==BLACK)continue;
			//������ĸ���ֵ��ж�

			if(is_what==LETTER)
			{
				//�ж��ַ��ĳ���  ���ܳ���16 
				len=strlen(ch);
				if(len>=16){
					more_than_16(line_number, fpin, fperror);
				}
				ch_index=0;
				ch[ch_index++]=c;//�����ַ���
				ch[ch_index]='\0'; //���������
				while((c=getc(fpin))!=ONECHAR)
				{
					//�ж��ַ��ĳ���  ���ܳ���16 
					len=strlen(ch);
					if(len>=16){
						more_than_16(line_number, fpin, fperror);
						break; 
					}

					//-1��ʱ��  ���е�ĩβ
					is_what=word_type(c);
					if(is_what==BLACK||is_what==OTHER){
						//����ǿո�   ��ôһ����ĸ���ַ�������
						//��resultд���ļ�����ȥ
						to_result(ch,result,fpout,ONECHAR);
						break;//ֹͣ��һ�ε����� 
					}
					else  if(is_what==END){
						is_end=1;
						to_result(ch,result,fpout,END);
						break;//ֹͣ��һ�ε����� 
					} 
					//д��ch����
					else{
						ch[ch_index]=c;

						ch[++ch_index]='\0';
					}
				}
			}
			//�����ǰ���ǿո�����ǻس�  �����ǻ���  ��ô�������
			if(is_what==BLACK)continue;
			//�����ǰ�����������ַ�
			if(is_what==OTHER){
				ch[0]=c;
				ch[1]='\0';
				int sign=c;
				//�����ļ���ĩβ
				other( ch, result, sign, fpout,fpin,fperror, OTHER);
				//�鿴�ǲ����ļ���ĩβ����
				if((c=getc(fpin))!=-1)
				{
					is_what=word_type(c);
					//�ж϶�ȡ���ַ�  �ǲ���Ϊ'\n' ' '
					if(is_what!=BLACK){
						//�ļ�ָ�����
						int index=ftell(fpin);
						fseek(fpin,index-1,0);
						is_what=BLACK;//���¿�ʼ��ȡ
					}

				}
				else{
					endfile( result, fpout);
					break;
				}
			}
			if(is_what==NUMBER){
				//�����ȡ���������ֵĻ�
				ch_index=0;
				ch[ch_index]=c;
				ch[++ch_index]='\0';
				while((c=getc(fpin))!=-1){
					is_what=word_type(c);
					if(is_what==LETTER)
					{
						number_error(line_number, fpin, fperror);
						break;
					}
					else   if(is_what==BLACK||is_what==OTHER){
						//��һЩ���ݵĴ���  ��ȡ�ո�������������ַ�
						to_result(ch,result,fpout,ONECHAR);
						if(is_what!=BLACK){
							//�ļ�ָ�����
							int index=ftell(fpin);
							fseek(fpin,index-1,0);
						}				
						break;
					}
					else if(is_what==NUMBER){
						ch[ch_index]=c;
						ch[++ch_index]='\0';
					}
				}
				if(c==END){
					is_end=1;
					toNextLine(result, fpout);

					endfile( result, fpout);

					break;
				}
			}
			//��ʼ������������
			ch[0]='\0';
			result[0]='\0';
		}
		//�����ļ�ĩβ��
	}
	if(is_end==0){
		endfile( result, fpout);
	}
	//�رմ򿪵���    �ͷ���Դ 
	fclose(fpin);
	fclose(fpout);
	fclose(fperror);
	return 0;
}

