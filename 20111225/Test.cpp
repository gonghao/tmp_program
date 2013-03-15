#include "st.h"

void Disp(Student &s)
{
	s.Display();
}

void Print(Student &s)
{
	s.Print();
}

int main()
{ 
	Student s1(20070001,"Jackson",'m');
	Graduate g1(20070101,"Rose",'f',"Adison");

	cout << "object student size: " << sizeof(s1) << endl;
	cout << "object graduate size: " << sizeof(g1) << endl;

	//s1.Display();
	//g1.Display();

	Disp(s1);
	Disp(g1);
	

	//Print(s1);
	//Print(g1);

	//getchar();

	return 0;
}
