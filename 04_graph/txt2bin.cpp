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
	std::ofstream ofs;
	if(argc < 3){
		std::cout << "usage: txt2bin <links.txt> <rel.bin>" << std::endl;
		return 1;
	}
	ifs.open(argv[1]);
	if(!ifs){
		std::cout << "input file not found." << std::endl;
		return 1;
	}
	ofs.open(argv[2], std::ios::out);

	int lastFrom = 0;
	while(!ifs.eof()){
		std::string line, token;
		std::getline(ifs, line);
		std::istringstream stream(line);
		std::string from, to;
		int fromID, toID;
		getline(stream, from,'\t');
		getline(stream, to,'\t');
		try{
			fromID = std::stoi(from);
			toID = std::stoi(to);
		} catch(std::invalid_argument){
			break;
		}
		//std::cout << from << "," << to << std::endl;
		/*
		if(fromID < num_of_pages) relCount[fromID]++;
		if(lastFrom != fromID){
			std::cout << lastFrom << "\t" << relCount[lastFrom] << std::endl;
			lastFrom = fromID;
		}
		*/
		ofs.write((char *)&fromID, sizeof(int));
		ofs.write((char *)&toID, sizeof(int));
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
