opList = {
	"+": {'type': 'OP', 'op': 'ADD', 'prec': 1},		
	"-": {'type': 'OP', 'op': 'SUB', 'prec': 1},		
	"*": {'type': 'OP', 'op': 'MUL', 'prec': 2},		
	"/": {'type': 'OP', 'op': 'DIV', 'prec': 2},		
	"%": {'type': 'OP', 'op': 'MOD', 'prec': 2},		
	"^": {'type': 'OP', 'op': 'POW', 'prec': 3},		
	"(": {'type': '('},		
	")": {'type': ')'},		
}

evalTable = {
	"ADD": lambda L, R : L + R,
	"SUB": lambda L, R : L - R,
	"MUL": lambda L, R : L * R,
	"DIV": lambda L, R : float(L) / R,
	"MOD": lambda L, R : L % R,
	"POW": lambda L, R : L ** R,
}

def readNumber(line, index):
	number = 0
	while index < len(line) and line[index].isdigit():
		number = number * 10 + int(line[index])
		index += 1
	if index < len(line) and line[index] == '.':
		index += 1
		keta = 0.1
		while index < len(line) and line[index].isdigit():
			number += int(line[index]) * keta
			keta *= 0.1
			index += 1
	token = {'type': 'NUMBER', 'val': number}
	return token, index

def tokenize(line):
	tokens = []
	index = 0
	while index < len(line):
		if line[index].isspace():
			(token, index) = (token, index + 1)
		if line[index].isdigit():
			(token, index) = readNumber(line, index)
		elif line[index] in opList :
			token = opList[line[index]]
			index = index + 1
		else:
			print 'Invalid character found: ' + line[index]
			exit(1)
		tokens.append(token)
	# print tokens
	return tokens

def parse_checkPrec(evalStack, opStack):
	if len(opStack) < 2:
		return
	if 'prec' not in opStack[-2] or 'prec' not in opStack[-1]:
		return
	if opStack[-2]['prec'] >= opStack[-1]['prec']:
		evalStack.append(opStack.pop(-2))
		parse_checkPrec(evalStack, opStack)

def parse(tokens):
	evalStack = []
	opStack = []
	while tokens:
		token = tokens.pop(0)
		if token['type'] == 'NUMBER':
			evalStack.append(token)
		else:
			if token['type'] == 'OP':
				opStack.append(token)
			elif token['type'] == '(':
				opStack.append(token)
			elif token['type'] == ')':
				while True:
					if not opStack:
						print 'expected more ('
						return False
					token = opStack.pop()
					if token['type'] == '(':
						break
					evalStack.append(token)
			else:
				print 'Invalid syntax'
			parse_checkPrec(evalStack, opStack)
	while opStack:
		evalStack.append(opStack.pop())
	# print evalStack
	return evalStack

def evaluate(evalStack):
	evalStack.reverse()
	tmpStack = []
	while evalStack:
		token = evalStack.pop()
		if token['type'] == 'NUMBER':
			tmpStack.append(token)
		else:
			if len(tmpStack) < 2:
				print "Eval error (not enough operand)"
				return False
			elif token['type'] == 'OP' and token['op'] in evalTable:
				tmpStack[-2]["val"] = evalTable[token['op']](
						tmpStack[-2]["val"], tmpStack[-1]["val"])
				tmpStack.pop()
			else:
				print 'Unknown operator', token['type']
				return False
		# print tmpStack
	if(len(tmpStack) != 1):
		print "Found extra operand"
		return False
	return tmpStack[0]["val"];

def evalLine(line):
	tokens = tokenize(line)
	evalStack = parse(tokens)
	if evalStack == False:
		return False
	return evaluate(evalStack)

def test(line, expectedAnswer):
	actualAnswer = evalLine(line)
	if abs(actualAnswer - expectedAnswer) < 1e-8:
		print "PASS! (%s = %f)" % (line, expectedAnswer)
	else:
		print "FAIL! (%s should be %f but was %f)" % (line, expectedAnswer, actualAnswer)


# Add more tests to this function :)
def runTest():
	print "==== Test started! ===="
	test("1+2", 3)
	test("1-2", -1)
	test("1*2", 2)
	test("1/2", 0.5)
	test("9%7", 2)
	test("3^10", 59049)
	#
	test("1.0+2.1-3", 0.1)
	test("1.0+2.1*3", 7.3)
	test("3 + 2 * 6 / 3 * 5 - 2", 21)
	test("(5 + 3) * 3 - 3 * (2 + 1)", 15)
	test("13 % 6", 1)
	test("2 ^ (1 + 3) * 3 - 5 * 2", 38)
	#
	print "==== Test finished! ====\n"

runTest()

while True:
	print '> ',
	line = raw_input()
	answer = evalLine(line)
	if(answer != False):
		print "answer = %f\n" % answer
