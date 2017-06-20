#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>

const int num_of_pages = 1500000;  // >= 1483276

int relCount[num_of_pages];

int main(int argc, char *argv[])
{
	std::ifstream ifs;
	ifs.open("rel.bin");

	int lastFrom = 0;
	while(!ifs.eof()){
		int fromID, toID;
		ifs.read((char *)&fromID, sizeof(int));
		ifs.read((char *)&toID, sizeof(int));
		//std::cout << fromID << "," << toID << std::endl;
		
		if(fromID < num_of_pages) relCount[fromID]++;
		if(lastFrom != fromID){
			std::cout << lastFrom << "\t" << relCount[lastFrom] << std::endl;
			lastFrom = fromID;
		}
		
	}
/*
	int maxIndex = 0;
	for(int i = 0; i <= num_of_pages; i++){
		if(relCount[i] >= relCount[maxIndex]) maxIndex = i;
	}

	std::cout << "max: " << maxIndex << "\t" << relCount[maxIndex] << std::endl;
*/
	return 0;
}
