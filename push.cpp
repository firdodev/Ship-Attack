#include <iostream>
#include <bits/stdc++.h>
using namespace std;
int main(){
	string commition;
	cout<<"Git pushing"<<endl;
	system("git add .");
	string commit;
	cout<<"Enter the message of commit (Without spaces use _ ): "<<endl;
	cin>>commit;
	string init = "git commit -m \" ";
	string add = " \" ";
	commition = init + commit + add;
	cout<<init<<endl;
	cout<<"Commiting the files..."<<endl;
	system("git commit -m \" $commition \" ");
	cout<<"Pushing the files..."<<endl;
	system("git push");
}
