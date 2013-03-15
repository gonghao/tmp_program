#include "readLine.h"
#include "error.h"

int error_flag = 0;

int program(FILE *fpin,FILE *fpout);/**程序*/
void program_branch(FILE *fpin,FILE *fpout);/**分程序*/
void ins_lua_tab(FILE *fpin,FILE *fpout);/**说明语句表*/
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

int program(FILE *fpin,FILE *fpout){
	program_branch(fpin, fpout);
    return error_flag;
}

void program_branch(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

    readLine(fpin, result);

	if (!strcmp(result,"begin")) {
		ins_lua_tab(fpin, fpout);
		exe_lua_tab(fpin, fpout);
		readLine(fpin, result);
		if (strcmp(result,"end")) {
            error_flag--;
			error(fpin,fpout,"没有结束符end");
        }
	} else {
        error_flag--;
		error(fpin,fpout,"没有开始符begin");
    }
}

void ins_lua_tab(FILE *fpin, FILE *fpout) {
	char result[MAX_CHAR_LENGTH];

	ins_lua(fpin,fpout);
	readLine(fpin, result);
	if(!strcmp(result,";")){
		ins_lua_tab_(fpin,fpout);
	} else {
        error_flag--;
		error(fpin,fpout,"后没有分号';'");
    }
}

void ins_lua_tab_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);
	if(!strcmp(result,"integer")){
		fseek(fpin,index,0);//回退
		ins_lua(fpin,fpout);
		readLine(fpin, result);
		if(!strcmp(result,";")){
			ins_lua_tab_(fpin,fpout);
		}
	} else {
		fseek(fpin,index,0);//回退
	}

}
void ins_lua(FILE *fpin,FILE *fpout){
	/*区分变量说明 还是函数说明*/
	int index=ftell(fpin);/*为指针的回退做好准备*/
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);

	if(!strcmp(result,"integer")) {
		readLine(fpin, result);
		if(!strcmp(result,"function")) {
			fseek(fpin,index,0);
			ins_function(fpin,fpout);
		} else {
			fseek(fpin,index,0);
			ins_value(fpin,fpout);
		}
	} else {
        error_flag--;
		error(fpin,fpout,"缺少integer关键字");
    }
}

void ins_value(FILE *fpin,FILE *fpout) {
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);
	if(!strcmp(result,"integer")){
		my_value(fpin,fpout);
	} else {
        error_flag--;
		error(fpin,fpout,"缺少integer字符");
    }
}

void my_value(FILE *fpin,FILE *fpout){
	if (is_what(fpin)!='\n') {
        error_flag--;
        error(fpin,fpout,"不是标识符");
    }
}

void ins_function(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);
	if(!strcmp(result,"integer")){
		readLine(fpin, result);
		if(!strcmp(result,"function")){
			my_value(fpin,fpout);
			readLine(fpin, result);
			if(!strcmp(result,"(")){
				parameter(fpin,fpout);
				readLine(fpin, result);
				if(!strcmp(result,")")){
					readLine(fpin, result);
					if(!strcmp(result,";")){
						function_body(fpin,fpout);
					} else {
                        error_flag--;
						error(fpin,fpout,"没有加分号");
                    }
				} else {
                    error_flag--;
					error(fpin,fpout,"缺少右括号)");
                }
			} else {
                error_flag--;
				error(fpin,fpout,"缺少左括号\(");
            }
		} else {
            error_flag--;
			error(fpin,fpout,"缺少关键字funcation");
        }

	} else {
        error_flag--;
		error(fpin,fpout,"缺少关键字integer");
    }
}

void parameter(FILE *fpin,FILE *fpout){
	my_value(fpin,fpout);
}

void function_body(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);
	if(!strcmp(result,"begin")){
		ins_lua_tab(fpin,fpout);
		exe_lua_tab(fpin,fpout);
		readLine(fpin, result);
		if(strcmp(result,"end")) {
            error_flag--;
			error(fpin,fpout,"函数缺少结束符end");
        }
	} else {
        error_flag--;
		error(fpin,fpout,"函数缺少begin关键字");
    }
}

void exe_lua_tab(FILE *fpin,FILE *fpout){
	exe_lua(fpin,fpout);
	exe_lua_tab_(fpin,fpout);
}

void exe_lua_tab_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);
	if(!strcmp(result,";")){
		exe_lua(fpin,fpout);
		exe_lua_tab_(fpin,fpout);
	} else {
		fseek(fpin,index,0);
	}
}

void exe_lua(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);/*记录文件指针的当前位置*/
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);

	if(!strcmp(result,"read")){
		read_lua(fpin,fpout);
	} else if (!strcmp(result,"write")) {
		write_lua(fpin,fpout);
	} else if (!strcmp(result,"if")){
		condition_lua(fpin,fpout);
	} else {
		fseek(fpin,index,0);
		assign_lua(fpin,fpout);
	}
}

void read_lua(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);

	if(!strcmp(result,"(")) {
		my_value(fpin,fpout);
		readLine(fpin, result);
		if(strcmp(result,")")) {
            error_flag--;
			error(fpin,fpout,"read 缺少右括号)");
        }
	} else {
        error_flag--;
		error(fpin,fpout,"read 缺少左括号\(");
    }
}

void write_lua(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);
	if(!strcmp(result,"(")){
		my_value(fpin,fpout);
		readLine(fpin, result);
		if(strcmp(result,")")) {
            error_flag--;
			error(fpin,fpout,"write 缺少右括号)");
        }
	} else {
        error_flag--;
		error(fpin,fpout,"write 缺少左括号\(");
    }
}

void assign_lua(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

	my_value(fpin,fpout);
    readLine(fpin, result);
	if(!strcmp(result,":=")){
		arith_express(fpin,fpout);
	} else {
        error_flag--;
		error(fpin,fpout,"缺少赋值号:=");
    }
}

void arith_express(FILE *fpin,FILE *fpout){
	term(fpin,fpout);
	arith_express_(fpin,fpout);
}

void arith_express_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);
	if(!strcmp(result,"-")) {
		term(fpin,fpout);
		arith_express_(fpin,fpout);
	} else {
		fseek(fpin,index,0);
	}
}

void term(FILE *fpin,FILE *fpout){
	factor(fpin,fpout);
	term_(fpin,fpout);
}

void term_(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);
	if(!strcmp(result,"*")){
		factor(fpin,fpout);
		term_(fpin,fpout);
	} else {
		fseek(fpin,index,0);
	}

}

void factor(FILE *fpin,FILE *fpout){
	int index=ftell(fpin);/*记录当前的指针位置*/
    int code = is_what(fpin);
	char result[MAX_CHAR_LENGTH];

	if(code == 10 || code == 11) {
		index=ftell(fpin);
		readLine(fpin, result);

		if(!strcmp(result,"\(")) {
			fseek(fpin,index,0);
			function_call(fpin,fpout);
		} else {
			fseek(fpin,index,0);
        }
	} else {
		fseek(fpin,index,0);
		function_call(fpin,fpout);
	}
}

void condition_lua(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

	condition_express(fpin,fpout);
	readLine(fpin, result);
	if(!strcmp(result,"then")) {
		exe_lua(fpin,fpout);
		readLine(fpin, result);
		if(!strcmp(result,"else")){
			exe_lua(fpin,fpout);
		} else {
            error_flag--;
			error(fpin,fpout,"缺少关键字else");	
        }
	} else {
        error_flag--;
        error(fpin,fpout,"缺少关键字then");
    }
}

void condition_express(FILE *fpin,FILE *fpout){
	arith_express(fpin,fpout);
	relation_operator(fpin,fpout);
	arith_express(fpin,fpout);
}

void relation_operator(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);

	if (strcmp(result,"<") && strcmp(result,"<=")
        && strcmp(result,">") && strcmp(result,">=")
        && strcmp(result,"+") && strcmp(result,"<>")) {

        error_flag--;
		error(fpin,fpout,"无法解析的关系运算符");
    }
}

void constant(FILE *fpin,FILE *fpout){
	if(is_what(fpin)!=11) {
        error_flag--;
        error(fpin,fpout,"不是常数");
    }
}

void function_call(FILE *fpin,FILE *fpout){
	char result[MAX_CHAR_LENGTH];

	readLine(fpin, result);

	if(!strcmp(result,"(")){
		arith_express(fpin,fpout);
		readLine(fpin, result);
		if (strcmp(result,")")){
            error_flag--;
			error(fpin,fpout,"函数调用缺少右括号)");
        }

	} else {
        error_flag--;
		error(fpin,fpout,"函数调用缺少左括号\(");
    }
}
