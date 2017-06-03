#include <stdio.h>

#define CACHE_SIZE	3

#define HASH_SIZE	0x100

int hashFunc(char *url)
{
	// To simplify, return charCode for first char of URL
	return url[0];
}

typedef struct {
	int dataIndex;
} HashEntry;

HashEntry hashTable[HASH_SIZE];

typedef struct {
	char *data;
	int prevDataIndex;	// older
	int nextDataIndex;	// newer
	int hashIndex;
} DataEntry;

DataEntry dataTable[CACHE_SIZE + 2];
// dataTable[CACHE_SIZE].prevDataIndex = oldest
// dataTable[CACHE_SIZE + 1].nextDataIndex = latest
int dataTableUsed = 0;

void initHashTable()
{
	int i;
	for(i = 0; i < HASH_SIZE; i++){
		hashTable[i].dataIndex = -1;
	}
}

void initDataTable()
{
	dataTable[CACHE_SIZE].nextDataIndex = CACHE_SIZE + 1;
	dataTable[CACHE_SIZE + 1].prevDataIndex = CACHE_SIZE;
}

int getOldestDataIndex()
{
	return dataTable[CACHE_SIZE].nextDataIndex;
}

int getLatestDataIndex()
{
	return dataTable[CACHE_SIZE + 1].prevDataIndex;
}


void showCachedSites()
{
	int i = getLatestDataIndex();
	int oldest = getOldestDataIndex();
	for(;;){
		printf("%s\n", dataTable[i].data);
		if(i == oldest) break;
		i = dataTable[i].prevDataIndex;
	}
}

void showDataTable()
{
	int i;
	for(i = 0; i < CACHE_SIZE + 2; i++){
		printf("%s\t%d\t%d\n",  dataTable[i].data,
				dataTable[i].prevDataIndex, dataTable[i].nextDataIndex);
	}
}


void deleteDataIndex(int index)
{
	int prev = dataTable[index].prevDataIndex;
	int next = dataTable[index].nextDataIndex;
	dataTable[prev].nextDataIndex = next;
	dataTable[next].prevDataIndex = prev;
	hashTable[dataTable[index].hashIndex].dataIndex = -1;
	//printf("remove %d, prev=%d, next=%d\n", index, prev, next);
}

void pushData(int hashIndex, char *data, int dIndex)
{
	dataTable[dIndex].data = data;
	dataTable[dIndex].hashIndex = hashIndex;
	//
	int prev = getLatestDataIndex();
	int next = dataTable[prev].nextDataIndex;
	//printf("push to %d, prev=%d, next=%d\n", dIndex, prev, next);
	//
	dataTable[dIndex].nextDataIndex = next;
	dataTable[dIndex].prevDataIndex = prev;
	//
	dataTable[prev].nextDataIndex = dIndex;
	dataTable[next].prevDataIndex = dIndex;
	//
	hashTable[hashIndex].dataIndex = dIndex;
}

void addToCache(char *url, char *data)
{
	int hashIndex = hashFunc(url);
	int dIndex;
	if(hashTable[hashIndex].dataIndex != -1){
		dIndex = hashTable[hashIndex].dataIndex;
		deleteDataIndex(dIndex);
	} else{
		if(dataTableUsed < CACHE_SIZE){
			dIndex = dataTableUsed++;
		} else{
			dIndex = getOldestDataIndex();
			deleteDataIndex(dIndex);
		}
	}
	printf("Add: %s (key: %d, data: %s) to dIndex = %d\n",
			url, hashIndex, data, dIndex);
	pushData(hashIndex, data, dIndex);
	showDataTable();
}

int main(int argc, char *argv[])
{
	initHashTable();
	initDataTable();
	//
	addToCache("a.example.com", "A");
	addToCache("a.example.com", "A");
	addToCache("a.example.com", "A");
	addToCache("a.example.com", "A");
	addToCache("b.example.com", "B");
	addToCache("a.example.com", "A");
	addToCache("c.example.com", "C");
	addToCache("d.example.com", "D");
	addToCache("d.example.com", "D");
	addToCache("b.example.com", "B");
	addToCache("b.example.com", "B");
	addToCache("d.example.com", "D");
	addToCache("b.example.com", "B");
	addToCache("e.example.com", "E");
	//
	showCachedSites();
	return 0;
}
