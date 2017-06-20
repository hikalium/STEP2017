#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>

const int max_pages = 1500000;  // >= 1483276

int rels[64 * 1024 * 1024][2];	// [from, to]
int num_of_rels = 0;

std::ifstream ifs_pages;
std::string title[max_pages];
int num_of_pages = 0;
void scanPages()
{
	std::cout << "scanPages: begin" << std::endl;
	ifs_pages.open("wikipedia_links/pages.txt");
	while(!ifs_pages.eof()){
		std::string line, token;
		std::getline(ifs_pages, line);
		std::istringstream stream(line);
		std::string id;
		getline(stream, id,'\t');
		getline(stream, title[num_of_pages++],'\t');
	}
	std::cout << "scanPages: end" << std::endl;
}

void scanRels()
{
	std::ifstream ifs;
	ifs.open("rel.bin");

	std::cout << "scanRels: begin" << std::endl;
	while(!ifs.eof()){
		ifs.read((char *)&rels[num_of_rels][0], sizeof(int));
		ifs.read((char *)&rels[num_of_rels][1], sizeof(int));
		num_of_rels++;
	}
	std::cout << "scanRels: end" << std::endl;
}

int main(int argc, char *argv[])
{
	scanPages();
	scanRels();
	std::cout << "ready: rels = " << num_of_rels << std::endl;	
	//
	while(1){
		int root_index;
		std::cout << "Input root index: " << std::endl;
		std::cin >> root_index;
		if(root_index < 0 || num_of_pages <= root_index){
			std::cout << "Out of bound." << std::endl;
			break;
		}
		std::cout << "root: " << root_index << ": " << title[root_index] << std::endl;
		//
		for(int i = 0; i < num_of_rels; i++){
			if(rels[i][0] == root_index){
				int to = rels[i][1];
				std::cout << "\t" << to << "\t" << title[to] << std::endl;
			}
		}
	}
	return 0;
}
