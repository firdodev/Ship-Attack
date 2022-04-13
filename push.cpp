#include <iostream>
#include <bits/stdc++.h>
using namespace std;
int main(){
	string commition;
	cout<<"Git pushing"<<endl;
	system("git add .");
	cout<<endl;
	string commit;
	cout<<"Enter the message of commit (Without spaces use _ ): "<<endl;
	cin>>commit;
	string init = "git commit -m \" ";
	string add = " \" ";
	commition = init + commit + add;
	cout<<endl;
	cout<<"Message of commition is : "<<commition<<endl;
	cout<<endl;
	cout<<"Commiting the files..."<<endl;
	system(commition.c_str());
	cout<<endl;
	cout<<"Pushing the files..."<<endl;
	system("git push");
	
	cout<<endl;
	cout<<endl;
	cout<<endl;
	cout<<endl;
	cout<<endl;
	system("PAUSE");
}
