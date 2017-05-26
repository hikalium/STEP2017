var fs = require("fs");
var s = ""+fs.readFileSync("dictionary.words.txt");
var wordList = s.toUpperCase().split("\n");

var wordKeys = {};

function calcKeyForWord(word){
	var alphaCountList = [];
	word = word.toUpperCase();
	for(var i = 65; i <= 90; i++){
		alphaCountList[i] = 0;
	}
	for(var i = 0; i < word.length; i++){
		alphaCountList[word.charCodeAt(i)]++;
	}
	var key = "";
	for(var i = 65; i <= 90; i++){
		key += alphaCountList[i];
	}
	return key;
}

for(var w of wordList){
	var key = calcKeyForWord(w);
	if(wordKeys[key] == undefined) wordKeys[key] = [];
	wordKeys[key].push(w);
}
console.log(wordKeys);

var reader = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
reader.on('line', function (line) {
	var key = calcKeyForWord(line);
	console.log("AVAILABLE CHARS: " + line);
	console.log("KEY: " + key);
	console.log("COMPLETE MATCH: ");
	console.log(wordKeys[key]);
});
