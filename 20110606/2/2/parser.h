#include "readLine.h"
#include "error.h"
void   program(FILE *fpin,FILE *fpout);/**程序*/
void  program_branch(FILE *fpin,FILE *fpout);/**分程序*/
void  ins_lua_tab(FILE *fpin,FILE *fpout);/**说明语句表*/
void ins_lua_tab_(FILE *fpin,FILE *fpout);/*说明语句表"*/
void exe_lua_tab(FILE *fpin,FILE *fpout);   /*执行语句表*/
void exe_lua_tab_(FILE *fpin,FILE *fpout);/*执行语句表"*/
void ins_lua(FILE *fpin,FILE *fpout);/*说明语句*/
void ins_value(FILE *fpin,FILE *fpout);/*变量说明*/
void ins_function(FILE *fpin,FILE *fpout);/*函数说明*/
void my_value(FILE *fpin,FILE *fpout);/*变量*/
void parameter(FILE *fpin,FILE *fpout);/*参数*/
void function_body(FILE *fpin,FILE *fpout);/*函数体*/
void exe_lua(FILE *fpin,FILE *fpout);/*执行语句*/
void read_lua(FILE *fpin,FILE *fpout);/*读语句*/
void write_lua(FILE *fpin,FILE *fpout);/*写语句*/
void assign_lua(FILE *fpin,FILE *fpout);/*赋值语句*/
void condition_lua(FILE *fpin,FILE *fpout);/*条件语句*/
void arith_express(FILE *fpin,FILE *fpout);/*算术表达式*/
void term(FILE *fpin,FILE *fpout);/*项*/
void term_(FILE *fpin,FILE *fpout);/*项"*/
void arith_express_(FILE *fpin,FILE *fpout);/*算术表达式"*/
void factor(FILE *fpin,FILE *fpout);/*因子*/
void constant(FILE *fpin,FILE *fpout);/*常数*/
void function_call(FILE *fpin,FILE *fpout);/*函数调用*/
void condition_express(FILE *fpin,FILE *fpout);/*/条件表达式*/
void  relation_operator(FILE *fpin,FILE *fpout);/*关系运算符*/
void  program(FILE *fpin,FILE *fpout){
	program_branch(fpin,fpout);
}

void program_branch(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"begin")==0){
		/*说明语句表*/
		ins_lua_tab(fpin, fpout);
		/*执行语句表*/
		exe_lua_tab(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,"end")==0){}
		else
			error(fpin,fpout,"没有结束符end");
	}
	else
		error(fpin,fpout,"没有开始符begin");
}
void  ins_lua_tab(FILE *fpin,FILE *fpout){
	ins_lua(fpin,fpout);
	char *result=readLine(fpin);
	if(strcmp(result,";")==0){
		ins_lua_tab_(fpin,fpout);
	}
	else
		error(fpin,fpout,"后没有分号';'");

}

void ins_lua_tab_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);
	char *result=readLine(fpin);
	if(strcmp(result,"integer")==0){
		fseek(fpin,index,0);//回退
		ins_lua(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,";")==0){
			ins_lua_tab_(fpin,fpout);
		}
	}
	else{
		fseek(fpin,index,0);//回退
	}

}
void ins_lua(FILE *fpin,FILE *fpout){
	/*区分变量说明 还是函数说明*/
	int index=ftell(fpin);/*为指针的回退做好准备*/
	char *result;
	result=readLine(fpin);
	if(strcmp(result,"integer")==0){
		///   int index=ftell(fpin);/*为指针的回退做好准备*/	//=====
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
		error(fpin,fpout,"缺少integer字符");

}
void ins_value(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"integer")==0){
		my_value(fpin,fpout);
	}
	else
		error(fpin,fpout,"缺少integer字符");/*这里的错误是不会出现啊的    其实是可以舍弃的*/
}
void my_value(FILE *fpin,FILE *fpout){
	int i=is_what(fpin);
	/*标识符错误处理*/
	if(i!=10)error(fpin,fpout,"不是标识符");
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
						error(fpin,fpout,"没有加分号");
				}
				else
					error(fpin,fpout,"缺少右括号)");
			}
			else
				error(fpin,fpout,"缺少左括号");
		}
		else
			error(fpin,fpout,"缺少关键字funcation");/*这里的错误是不会出现啊的    其实是可以舍弃的*/

	}
	else
		error(fpin,fpout,"缺少关键字integer");/*这里的错误是不会出现啊的    其实是可以舍弃的*/
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
			error(fpin,fpout,"缺少结束符end或者是写错");
	}
	else
		error(fpin,fpout,"缺少begin关键字");
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
	int index=ftell(fpin);/*记录文件指针的当前位置*/
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


		/*文件回退*/
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
			error(fpin,fpout,"缺少右括号)");
	}
	else
		error(fpin,fpout,"缺少左括号(");
}

void write_lua(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"(")==0){
		my_value(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,")")!=0)
			error(fpin,fpout,"缺少右括号)");
	}
	else
		error(fpin,fpout,"缺少左括号");
}

void assign_lua(FILE *fpin,FILE *fpout){
	my_value(fpin,fpout);
	char *result=readLine(fpin);
	if(strcmp(result,":=")==0){
		arith_express(fpin,fpout);
	}
	else
		error(fpin,fpout,"缺少赋值号:=");
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
	int index=ftell(fpin);//刚刚才改
	char *result=readLine(fpin);
	if(strcmp(result,"*")==0){
		factor(fpin,fpout);
		term_(fpin,fpout);
	}
	else{
		fseek(fpin,index,0);//刚刚才改
	}

}
void factor(FILE *fpin,FILE *fpout){
	//char *result=readLine(fpin);
	int index=ftell(fpin);/*记录当前的指针位置*/
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
		//成功
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
			error(fpin,fpout,"缺少关键字else");	

	}
	else error(fpin,fpout,"缺少关键字then");


}

void condition_express(FILE *fpin,FILE *fpout){
	arith_express(fpin,fpout);
	relation_operator(fpin,fpout);
	arith_express(fpin,fpout);
}
void  relation_operator(FILE *fpin,FILE *fpout){
	//<│<=│>│>=│=│<>
	char *result=readLine(fpin);
	if(strcmp(result,"<")==0){}
	else if(strcmp(result,"<=")==0){}
	else if(strcmp(result,">")==0){}
	else if(strcmp(result,">=")==0){}
	else if(strcmp(result,"+")==0){}
	else  if(strcmp(result,"<>")==0){}
	else
		error(fpin,fpout,"无法解析的非法字符");
}
void constant(FILE *fpin,FILE *fpout){
	int code =is_what(fpin);
	if(code!=11)error(fpin,fpout,"不是常数");
}
void  function_call(FILE *fpin,FILE *fpout){
	char *result=readLine(fpin);
	if(strcmp(result,"(")==0){
		arith_express(fpin,fpout);
		result=readLine(fpin);
		if(strcmp(result,")")==0){
		}
		else
			error(fpin,fpout,"缺少右括号");

	}
	else
		error(fpin,fpout,"缺少左括号");
}