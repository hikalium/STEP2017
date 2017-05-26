var fs = require("fs");
var s = ""+fs.readFileSync("dictionary.words.txt");
var wordList = s.toUpperCase().split("\n");

var wordKeys = {};

var wordKeysScores = {};

var scoreCharTable3 = [74, 75, 81, 88, 90];
var scoreCharTable2 = [67, 70, 72, 76, 77, 80, 86, 87];

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
	var score = 0;
	for(var i = 65; i <= 90; i++){
		key += alphaCountList[i];
		if(scoreCharTable3.includes(i))			score += alphaCountList[i] * 3;
		else if(scoreCharTable2.includes(i))	score += alphaCountList[i] * 2;
		else score += alphaCountList[i] * 1;
	}
	wordKeysScores[key] = score;
	return key;
}

function isWordAcontainsB(a, b)
{
	for(var i = 0; i < a.length; i++){
		if(b.charCodeAt(i) > a.charCodeAt(i)) return false;
	}
	return true;
}

function getAvailableKeys(key)
{
	var kList = [];
	for(var k in wordKeys){
		if(isWordAcontainsB(key, k)){
			kList.push(k);
		}
	}
	return kList;
}

function sortKeysByScore(keys)
{
	return keys.sort(function (a, b){return wordKeysScores[b] - wordKeysScores[a]});
}

for(var w of wordList){
	var key = calcKeyForWord(w);
	if(wordKeys[key] == undefined) wordKeys[key] = [];
	wordKeys[key].push(w);
}

for(var k in wordKeys){
	console.log(k + "("+ wordKeysScores[k]  +"):" + wordKeys[k]);
}

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
	console.log("SUBSET MATCH: ");
	var candidateKeys = sortKeysByScore(getAvailableKeys(key));
	var bestCandidate = wordKeys[candidateKeys[0]];
	console.log(bestCandidate);
});
