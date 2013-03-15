#include <iostream>

using namespace std;

class Student
{
protected:
	int num;
	char *name;
	char sexual;
public:
	Student();
	Student(int num,char* name,char sexual);
	void SetName(char* name);
	void SetSexual(char sexual);
	void SetNum(int num);

	void Display();
	void Print();

	//virtual void Display();
	//virtual void Print();
};

class Graduate : public Student
{
private:
	char* tutor;
public:
	Graduate(int num,char* name,char sexual, char* tutor) ;
	void SetTutor(char*);
	void Display();
	void Print();
};

class Middle : public Student
{
private:
	char* teacher;
public:
	Middle(int num,char* name,char sexual, char* teacher) ;
	void SetTeacher(char*);
	void Display();
	void Print();
};

