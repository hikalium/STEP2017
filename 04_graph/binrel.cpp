#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>

const int num_of_pages = 1500000;  // >= 1483276

int relCount[num_of_pages];
int num_of_rels = 0;

int main(int argc, char *argv[])
{
	std::ifstream ifs;
	ifs.open("rel.bin");

	while(!ifs.eof()){
		int fromID, toID;
		ifs.read((char *)&fromID, sizeof(int));
		ifs.read((char *)&toID, sizeof(int));
		//std::cout << fromID << "," << toID << std::endl;
		num_of_rels ++;
		/*
		if(fromID < num_of_pages) relCount[fromID]++;
		if(lastFrom != fromID){
			std::cout << lastFrom << "\t" << relCount[lastFrom] << std::endl;
			lastFrom = fromID;
		}
		*/
	}
	std::cout << "ready: " << num_of_rels << std::endl;
	/*
	while(!ifs.eof()){
		int fromID, toID;
		ifs.read((char *)&fromID, sizeof(int));
		ifs.read((char *)&toID, sizeof(int));
		//std::cout << fromID << "," << toID << std::endl;
		num_of_rels ++;
		if(fromID < num_of_pages) relCount[fromID]++;
		if(lastFrom != fromID){
			std::cout << lastFrom << "\t" << relCount[lastFrom] << std::endl;
			lastFrom = fromID;
		}
		
	}
	*/


/*
	int maxIndex = 0;
	for(int i = 0; i <= num_of_pages; i++){
		if(relCount[i] >= relCount[maxIndex]) maxIndex = i;
	}

	std::cout << "max: " << maxIndex << "\t" << relCount[maxIndex] << std::endl;
*/
	return 0;
}
