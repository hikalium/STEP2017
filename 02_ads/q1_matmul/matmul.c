#include <stdio.h>
#include <time.h>
#include <stdlib.h>

#define TRY_COUNT	1000

clock_t matmul0(int *C, int *A, int *B, int N)
{
	// retv: clock count 
	int x, y, i, t;
	clock_t t0 = clock();
	for(y = 0; y < N; y++){
		for(x = 0; x < N; x++){
			t = 0;
			for(i = 0; i < N; i++){
				t += A[y * N + i] * B[i * N + x];
			}
			C[y * N + x] = t;
		}
	}
	return clock() - t0;
}

void printMatrix(int *M, int N)
{
	int x, y;
	for(y = 0; y < N; y++){
		for(x = 0; x < N; x++){
			printf("%d\t", M[y * N + x]);
		}
		putchar('\n');
	}
	return;
}

void setRandomToMatrix(int *M, int N, int mod)
{
	int x, y;
	for(y = 0; y < N; y++){
		for(x = 0; x < N; x++){
			M[y * N + x] = rand() % mod;
		}
	}
	return;
}

int main(int argc, char *argv[])
{
	if(argc < 2){
		printf("Usage: %s <matrix_size>\n", argv[0]);
		return 1;
	}
	clock_t count = 0;
	int i;
	int N = strtol(argv[1], NULL, 10);
	srand(time(NULL));
	int *A, *B, *C;
	A = malloc(N * N * sizeof(int));
	B = malloc(N * N * sizeof(int));
	C = malloc(N * N * sizeof(int));
	
	setRandomToMatrix(A, N, 100);
	setRandomToMatrix(B, N, 100);

	for(i = 0; i < TRY_COUNT; i++){
		count += matmul0(C, A, B, N);
	}

	//printf("A:\n"); printMatrix(A, N);
	//printf("B:\n"); printMatrix(B, N);
	//printf("C = A * B:\n"); printMatrix(C, N);

	printf("%d\t%lf\n", N, (double)count / TRY_COUNT / CLOCKS_PER_SEC);

	return 0;
}

