matmul : matmul.c Makefile
		cc -Wall matmul.c -o matmul

matmul.png : matmul Makefile
	echo "" > matmul.out 
	for i in 1 3 5 7 9 11 13 15 17 20 30 40 50 60 80 100 120 150 200 250 300 350 400; do \
		./matmul $$i >> matmul.out; \
	done
	gnuplot matmul.plt
