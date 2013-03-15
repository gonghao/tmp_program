#include "readLine.h"
#include "error.h"
void   program(FILE *fpin,FILE *fpout);/**����*/
void  program_branch(FILE *fpin,FILE *fpout);/**�ֳ���*/
void  ins_lua_tab(FILE *fpin,FILE *fpout);/**˵������*/
void ins_lua_tab_(FILE *fpin,FILE *fpout);/*˵������"*/
void exe_lua_tab(FILE *fpin,FILE *fpout);   /*ִ������*/
void exe_lua_tab_(FILE *fpin,FILE *fpout);/*ִ������"*/
void ins_lua(FILE *fpin,FILE *fpout);/*˵�����*/
void ins_value(FILE *fpin,FILE *fpout);/*����˵��*/
void ins_function(FILE *fpin,FILE *fpout);/*����˵��*/
void my_value(FILE *fpin,FILE *fpout);/*����*/
void parameter(FILE *fpin,FILE *fpout);/*����*/
void function_body(FILE *fpin,FILE *fpout);/*������*/
void exe_lua(FILE *fpin,FILE *fpout);/*ִ�����*/
void read_lua(FILE *fpin,FILE *fpout);/*�����*/
void write_lua(FILE *fpin,FILE *fpout);/*д���*/
void assign_lua(FILE *fpin,FILE *fpout);/*��ֵ���*/
void condition_lua(FILE *fpin,FILE *fpout);/*�������*/
void arith_express(FILE *fpin,FILE *fpout);/*�������ʽ*/
void term(FILE *fpin,FILE *fpout);/*��*/
void term_(FILE *fpin,FILE *fpout);/*��"*/
void arith_express_(FILE *fpin,FILE *fpout);/*�������ʽ"*/
void factor(FILE *fpin,FILE *fpout);/*����*/
void constant(FILE *fpin,FILE *fpout);/*����*/
void function_call(FILE *fpin,FILE *fpout);/*��������*/
void condition_express(FILE *fpin,FILE *fpout);/*/�������ʽ*/
void  relation_operator(FILE *fpin,FILE *fpout);/*��ϵ�����*/
void  program(FILE *fpin,FILE *fpout){
	program_branch(fpin,fpout);
}

void program_branch(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"begin")==0){
		/*˵������*/
		ins_lua_tab(fpin, fpout);
		/*ִ������*/
		exe_lua_tab(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,"end")==0){}
		else
			error(fpin,fpout,"û�н�����end");
	}
	else
		error(fpin,fpout,"û�п�ʼ��begin");
}
void  ins_lua_tab(FILE *fpin,FILE *fpout){
	ins_lua(fpin,fpout);
	char *result=readLine(fpin);
	if(strcmp(result,";")==0){
		ins_lua_tab_(fpin,fpout);
	}
	else
		error(fpin,fpout,"��û�зֺ�';'");

}

void ins_lua_tab_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);
	char *result=readLine(fpin);
	if(strcmp(result,"integer")==0){
		fseek(fpin,index,0);//����
		ins_lua(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,";")==0){
			ins_lua_tab_(fpin,fpout);
		}
	}
	else{
		fseek(fpin,index,0);//����
	}

}
void ins_lua(FILE *fpin,FILE *fpout){
	/*���ֱ���˵�� ���Ǻ���˵��*/
	int index=ftell(fpin);/*Ϊָ��Ļ�������׼��*/
	char *result;
	result=readLine(fpin);
	if(strcmp(result,"integer")==0){
		///   int index=ftell(fpin);/*Ϊָ��Ļ�������׼��*/	//=====
		result=readLine(fpin);
		if(strcmp(result,"function")==0){
			fseek(fpin,index,0);
			ins_function(fpin,fpout);
		}
		else{
			fseek(fpin,index,0);
			ins_value(fpin,fpout);
		}
	}
	else
		error(fpin,fpout,"ȱ��integer�ַ�");

}
void ins_value(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"integer")==0){
		my_value(fpin,fpout);
	}
	else
		error(fpin,fpout,"ȱ��integer�ַ�");/*����Ĵ����ǲ�����ְ���    ��ʵ�ǿ���������*/
}
void my_value(FILE *fpin,FILE *fpout){
	int i=is_what(fpin);
	/*��ʶ��������*/
	if(i!=10)error(fpin,fpout,"���Ǳ�ʶ��");
}
void ins_function(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"integer")==0){
		result=readLine(fpin);
		if(strcmp(result,"function")==0){
			my_value(fpin,fpout);
			result=readLine(fpin);
			if(strcmp(result,"(")==0){
				parameter(fpin,fpout);
				result=readLine(fpin);//=======<<<<<<<
				if(strcmp(result,")")==0){
					result=readLine(fpin);
					if(strcmp(result,";")==0){
						function_body(fpin,fpout);
					}
					else
						error(fpin,fpout,"û�мӷֺ�");
				}
				else
					error(fpin,fpout,"ȱ��������)");
			}
			else
				error(fpin,fpout,"ȱ��������");
		}
		else
			error(fpin,fpout,"ȱ�ٹؼ���funcation");/*����Ĵ����ǲ�����ְ���    ��ʵ�ǿ���������*/

	}
	else
		error(fpin,fpout,"ȱ�ٹؼ���integer");/*����Ĵ����ǲ�����ְ���    ��ʵ�ǿ���������*/
}
void   parameter(FILE *fpin,FILE *fpout){
	my_value(fpin,fpout);
}
void function_body(FILE *fpin,FILE *fpout){
	char *result;
	result=readLine(fpin);
	if(strcmp(result,"begin")==0){
		ins_lua_tab(fpin,fpout);
		//	result=readLine(fpin);
		exe_lua_tab(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,"end")!=0)
			error(fpin,fpout,"ȱ�ٽ�����end������д��");
	}
	else
		error(fpin,fpout,"ȱ��begin�ؼ���");
}
void exe_lua_tab(FILE *fpin,FILE *fpout){
	exe_lua(fpin,fpout);
	exe_lua_tab_(fpin,fpout);
}
void exe_lua_tab_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);
	char *result=readLine(fpin);
	if(strcmp(result,";")==0){
		exe_lua(fpin,fpout);
		exe_lua_tab_(fpin,fpout);
	}
	else{
		fseek(fpin,index,0);
	}
}
void  exe_lua(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);/*��¼�ļ�ָ��ĵ�ǰλ��*/
	char *result=readLine(fpin);

	if(strcmp(result,"read")==0){
		read_lua(fpin,fpout);
	}
	else if(strcmp(result,"write")==0){
		write_lua(fpin,fpout);
	}
	else if(strcmp(result,"if")==0){
		condition_lua(fpin,fpout);
	}
	else{


		/*�ļ�����*/
		fseek(fpin,index,0);

		assign_lua(fpin,fpout);
	}
}
void read_lua(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"(")==0)
	{
		my_value(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,")")!=0)
			error(fpin,fpout,"ȱ��������)");
	}
	else
		error(fpin,fpout,"ȱ��������(");
}

void write_lua(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"(")==0){
		my_value(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,")")!=0)
			error(fpin,fpout,"ȱ��������)");
	}
	else
		error(fpin,fpout,"ȱ��������");
}

void assign_lua(FILE *fpin,FILE *fpout){
	my_value(fpin,fpout);
	char *result=readLine(fpin);
	if(strcmp(result,":=")==0){
		arith_express(fpin,fpout);
	}
	else
		error(fpin,fpout,"ȱ�ٸ�ֵ��:=");
}

void   arith_express(FILE *fpin,FILE *fpout){
	term(fpin,fpout);
	arith_express_(fpin,fpout);
}
void arith_express_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);
	char *result=readLine(fpin);
	if(strcmp(result,"-")==0){
		term(fpin,fpout);
		arith_express_(fpin,fpout);
	}
	else{
		fseek(fpin,index,0);
	}
}
void term(FILE *fpin,FILE *fpout){
	factor(fpin,fpout);
	term_(fpin,fpout);
}
void term_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);//�ողŸ�
	char *result=readLine(fpin);
	if(strcmp(result,"*")==0){
		factor(fpin,fpout);
		term_(fpin,fpout);
	}
	else{
		fseek(fpin,index,0);//�ողŸ�
	}

}
void factor(FILE *fpin,FILE *fpout){
	//char *result=readLine(fpin);
	int index=ftell(fpin);/*��¼��ǰ��ָ��λ��*/
	int code=is_what(fpin);
	/************************************************************************/
	/* ganggang gai                                                                     */
	/************************************************************************/
	//char *result=readLine(fpin);
	//if(strcmp(result,"(")==0){
	// fseek(fpin,index,0);
	// function_call(fpin,fpout);
	//	return ;
	//}
	if(code==10||code==11)
	{
		//�ɹ�
		index=ftell(fpin);
		char *result=readLine(fpin);

		if(strcmp(result,"(")==0)
		{
			fseek(fpin,index,0);
			function_call(fpin,fpout);
		}
		else 
			fseek(fpin,index,0);
	}
	else{
		fseek(fpin,index,0);
		function_call(fpin,fpout);
	}   
}
void  condition_lua(FILE *fpin,FILE *fpout){
	condition_express(fpin,fpout);
	char *result=readLine(fpin);
	if(strcmp(result,"then")==0){
		exe_lua(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,"else")==0){
			exe_lua(fpin,fpout);
		}
		else
			error(fpin,fpout,"ȱ�ٹؼ���else");	

	}
	else error(fpin,fpout,"ȱ�ٹؼ���then");


}

void condition_express(FILE *fpin,FILE *fpout){
	arith_express(fpin,fpout);
	relation_operator(fpin,fpout);
	arith_express(fpin,fpout);
}
void  relation_operator(FILE *fpin,FILE *fpout){
	//<��<=��>��>=��=��<>
	char *result=readLine(fpin);
	if(strcmp(result,"<")==0){}
	else if(strcmp(result,"<=")==0){}
	else if(strcmp(result,">")==0){}
	else if(strcmp(result,">=")==0){}
	else if(strcmp(result,"+")==0){}
	else  if(strcmp(result,"<>")==0){}
	else
		error(fpin,fpout,"�޷������ķǷ��ַ�");
}
void constant(FILE *fpin,FILE *fpout){
	int code =is_what(fpin);
	if(code!=11)error(fpin,fpout,"���ǳ���");
}
void  function_call(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"(")==0){
		arith_express(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,")")==0){
		}
		else
			error(fpin,fpout,"ȱ��������");

	}
	else
		error(fpin,fpout,"ȱ��������");
}