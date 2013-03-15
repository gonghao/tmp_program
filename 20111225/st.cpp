#include "st.h";

Student::Student()
{

}

Student::Student(int num,char* name,char sexual)
{
	this->num = num;
	this->sexual = sexual;
	this->name = name;
}

Graduate::Graduate(int num,char* name,char sexual,char* tutor)
{
	this->num = num;
	this->sexual = sexual;
	this->name = name;
	this->tutor = tutor;
}

Middle::Middle(int num,char* name,char sexual,char* teacher)
{
	this->num = num;
	this->sexual = sexual;
	this->name = name;
	this->teacher = teacher;
}

void Student::Display()
{
	cout << "Student: Display()\t" << endl; 
}

void Graduate::Display()
{
	cout << "Graduate: Display()\t" << endl; 
}

void Middle::Display()
{
	cout << "Middle: Display()\t"  << endl; 
}

void Student::Print()
{
	cout << "Student: Print()\t" << endl; 
}

void Graduate::Print()
{
	cout << "Graduate: Print()\t" << endl; 
}

void Middle::Print()
{
	cout << "Middle: Print()\t"  << endl; 
}
