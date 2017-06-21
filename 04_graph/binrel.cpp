#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>

const int max_pages = 1500000;  // >= 1483276

int page_depth[max_pages];
int rels[64 * 1024 * 1024][2];	// [from, to]
int num_of_rels = 0;
std::ifstream ifs_pages;
std::string title[max_pages];
int page_rels_start_index[max_pages];
int num_of_pages = 0;
void scanPages(const char *fname)
{
	std::cout << "scanPages: begin" << std::endl;
	ifs_pages.open(fname);
	if(!ifs_pages){
		std::cout << "file not found: " << fname << std::endl;
		exit(1);
	}
	while(!ifs_pages.eof()){
		std::string line, token;
		std::getline(ifs_pages, line);
		std::istringstream stream(line);
		std::string id;
		getline(stream, id,'\t');
		if(stream.eof()) break;
		getline(stream, title[num_of_pages++],'\t');
	}
	std::cout << "scanPages: end" << std::endl;
}

void scanRels(const char *fname)
{
	std::ifstream ifs;
	ifs.open(fname);
	if(!ifs){
		std::cout << "file not found: " << fname << std::endl;
		exit(1);
	}

	std::cout << "scanRels: begin" << std::endl;

	page_rels_start_index[0] = 0;
	int index = 0;
	int last_from_id = 0;
	while(!ifs.eof()){
		ifs.read((char *)&rels[num_of_rels][0], sizeof(int));
		if(ifs.eof()) break;
		ifs.read((char *)&rels[num_of_rels][1], sizeof(int));
		int from_id = rels[num_of_rels][0];
		if(from_id != last_from_id){
			last_from_id = from_id;
			page_rels_start_index[from_id] = index;
		}
		num_of_rels++;
		index++;
	}
	page_rels_start_index[0] = 0;
	std::cout << "scanRels: end" << std::endl;
}

void resetDepth()
{
	for(int i = 0; i < num_of_pages; i++){
		page_depth[i] = -1;
	}
}

void printFromIndex()
{
	for(int i = 0; i < 10; i++){
		std::cout << i << ": " << page_rels_start_index[i] << std::endl;
	}
}

void printAllDepthPages(int maxDepth)
{
	for(int d = 0; d <= maxDepth; d++){
		for(int i = 0; i < num_of_pages; i++){
			int depth = page_depth[i];
			if(depth != d) continue;
			for(int k = 0; k < depth; k++) std::cout << "\t";
			std::cout << depth << " > " << 
				i << ": " << title[i] << std::endl;
		}
	}
	// print not connected
	for(int i = 0; i < num_of_pages; i++){
		int depth = page_depth[i];
		if(depth != -1) continue;
		std::cout << "XXXX ";
		std::cout << depth << " > " << 
			i << ": " << title[i] << std::endl;
	}
}

void printDepthPagesStatistics(int maxDepth)
{
	int count;
	// print not connected
	count = 0;
	for(int i = 0; i < num_of_pages; i++){
		int depth = page_depth[i];
		if(depth != -1) continue;
		count++;
	}
	std::cout << count << "\t";
	// check each depths
	// TODO: improve performance
	for(int d = 0; d <= maxDepth; d++){
		count = 0;
		for(int i = 0; i < num_of_pages; i++){
			int depth = page_depth[i];
			if(depth != d) continue;
			count++;
		}
		std::cout << count << "\t";
	}
	std::cout << std::endl;
}

void printMostDistantPages(int maxDepth)
{
	for(int i = 0; i < num_of_pages; i++){
		int depth = page_depth[i];
		if(depth != maxDepth) continue;
		std::cout << depth << " > " << 
			i << ": " << title[i] << std::endl;
	}
}

int dfs(int depth)
{
	int count = 0;
	for(int t = 0; t < num_of_pages; t++){
		if(page_depth[t] != depth) continue;
		/*
		for(int i = 0; i < depth; i++) std::cout << "\t";
		std::cout << depth << " > " << 
			t << ": " << title[t] << std::endl;
			*/
		//
		for(int i = page_rels_start_index[t]; ; i++){
			if(rels[i][0] != t) break;
			int to = rels[i][1];
			if(page_depth[to] == -1){
				//for(int k = 0; k < depth + 1; k++) std::cout << "\t";
				page_depth[to] = depth + 1;
				
				//std::cout << rels[i][0] << " -> " << to << std::endl;

				count++;
			}
		}
	}
	return count;
}

int main(int argc, char *argv[])
{
	if(argc < 3){
		std::cout << "usage: binrel <links.bin> <pages.txt>" << std::endl;
		return 1;
	}
	//
	scanPages(argv[2]);
	scanRels(argv[1]);
	printFromIndex();
	std::cout << "ready: rels = " << num_of_rels << " pages = " << num_of_pages << std::endl;	
	//
	while(1){
		int root_index;
		std::cout << "Input root index: " << std::endl;
		std::cin >> root_index;
		resetDepth();
		page_depth[root_index] = 0;
		int maxDepth;
		for(int i = 0; ; i++){
			int count = dfs(i);
			std::cout << i << ": count=" << count << std::endl;
			if(count == 0){
				maxDepth = i;
				break;
			}
		}
		printDepthPagesStatistics(maxDepth);
		std::cout << "most distant page from " << title[root_index] << " is:" << std::endl;
		printMostDistantPages(maxDepth);
		// printAllDepthPages(maxDepth);
	}
	return 0;
}
