
var fs = require("fs");
var s = "" + fs.readFileSync("dictionary.words.txt");
var wordList = s.toUpperCase().split("\n");
var wordKeys = {};
var wordKeysScores = {};
var scoreCharTable3 = "JKQXZ";
var scoreCharTable2 = "CFHLMPVWY";
function calcKeyForWord(word) {
    var alphaCountList = [];
    word = word.toUpperCase();
    word = word.split("QU").join("Q");
    for (var i = 65; i <= 90; i++) {
        alphaCountList[i] = 0;
    }
    for (var i = 0; i < word.length; i++) {
        alphaCountList[word.charCodeAt(i)]++;
    }
    var key = "";
    var score = 0;
    for (var i = 65; i <= 90; i++) {
        key += alphaCountList[i];
        if (scoreCharTable3.indexOf(String.fromCharCode(i)) !== -1)
            score += alphaCountList[i] * 3;
        else if (scoreCharTable2.indexOf(String.fromCharCode(i)) !== -1)
            score += alphaCountList[i] * 2;
        else
            score += alphaCountList[i] * 1;
    }
    wordKeysScores[key] = score;
    return key;
}
function isWordKeyAcontainsB(a, b) {
    for (var i = 0; i < a.length; i++) {
        if (b.charCodeAt(i) > a.charCodeAt(i))
            return false;
    }
    return true;
}
function getWordKeyDiff(a, b) {
	var count = 0;
    for (var i = 0; i < a.length; i++) {
        if (b.charCodeAt(i) > a.charCodeAt(i)) count += b.charCodeAt(i) - a.charCodeAt(i);
    }
    return count;
}
function getAvailableKeys(key) {
    var kList = [];
    for (var k in wordKeys) {
        if (isWordKeyAcontainsB(key, k)) {
            kList.push(k);
        }
    }
    return kList;
}
function sortKeysByScore(keys) {
    return keys.sort(function (a, b) { return wordKeysScores[b] - wordKeysScores[a]; });
}
for (var _i = 0, wordList_1 = wordList; _i < wordList_1.length; _i++) {
    var w = wordList_1[_i];
    var key = calcKeyForWord(w);
    if (wordKeys[key] == undefined)
        wordKeys[key] = [];
    wordKeys[key].push(w);
}

var keysSortedByScores = [];
for (var k in wordKeys) {
	keysSortedByScores.push({score: (wordKeysScores[k] + 1) * (wordKeysScores[k] + 1), key: k, len: wordKeys[k][0].length});
    //console.log(k + "(" + wordKeysScores[k] + "):" + wordKeys[k]);
}
keysSortedByScores.sort(function(a, b){return b.score - a.score || b.len - a.len;});
/*
var keyFreq = [];
for(i = 0; i < 26; i++){
	keyFreq[i] = 0;
}
for(var i = 0; i < 200; i++){
	var t = keysSortedByScores[i];
	//console.log(JSON.stringify(t));
	for(var k = 0; k < 26; k++){
		keyFreq[k] += parseInt(t.key.charCodeAt(k));
	}
}
console.log(keyFreq.join("\n"));
*/


function getBestScoreKeyAvailable(baseKey)
{
	for(var i = 0; i < keysSortedByScores.length; i++){
		var t = keysSortedByScores[i];
		if(isWordKeyAcontainsB(baseKey, t.key)) return t.key;
	}
	return false;
}

function getBestKeyAvailableIfMoreChars(baseKey, moreCount)
{
	for(var i = 0; i < keysSortedByScores.length; i++){
		var t = keysSortedByScores[i];
		if(getWordKeyDiff(baseKey, t.key) <= moreCount) return t.key;
	}
	return false;
}

function getBestWordAvailableIfMoreChars(baseKey, moreCount)
{
	return wordKeys[getBestKeyAvailableIfMoreChars(baseKey, moreCount)][0];
}

function subKey(a, b)
{
	retv = "";
    for (var i = 0; i < a.length; i++) {
		retv += String.fromCharCode(Math.max(a.charCodeAt(i) - b.charCodeAt(i), 0) + "0".charCodeAt(0))
    }
	return retv;
}

function getBestWordByKey(baseKey, diff)
{
	var key = getBestKeyAvailableIfMoreChars(baseKey, diff);
	return {
		key: key,
		word: wordKeys[key][0],
		score: Math.pow(wordKeysScores[key] + 1, 2)
	};
}

function getWordFromChars(chars){
        var line = "" + chars;
        var key = calcKeyForWord(line);
		//
		var best = getBestWordByKey(key, 0);
		/*
		var best1 = getBestWordByKey(key, 1);

		var diffKey = subKey(key, best1.key);
		var diffBest = getBestWordByKey(diffKey, 0);
*/
		//console.log("AVAILABLE CHARS: " + line);
  /*
  		console.log("KEY: " + key);
        console.log("BEST AVAILABLE: " + best.word + "(" + best.score + ")");
		console.log("IF MORE 1 CHARS THEN BEST: " + best1.word + "(+" + (best1.score - best.score) + ")");
		console.log("DIFF BEST: " + diffBest.word + "(+" + (diffBest.score - best.score) + ")");
		if(best.score - diffBest.score < 10){
			return diffBest.word;
		}
        //console.log(bestCandidate + "(" + wordKeysScores[bestKey] + ")");
		*/
		return best.word;
}

var key_char = 'class="letter p';
var key_Seed = 'name=Seed value="';
var key_Started = 'name=Started value="';
var key_Moves = '<input type=hidden name=Moves value="';
var key_Score = '<tr><td><b>Score</b></td><td>';

function getSeedFromBody(body){
	var p = body.indexOf(key_Seed) + key_Seed.length;
	return body.substring(p, body.indexOf('"', p));
}

function getStartedFromBody(body){
	var p = body.indexOf(key_Started) + key_Started.length;
	return body.substring(p, body.indexOf('"', p));
}

function getScoreFromBody(body){
	var p = body.indexOf(key_Score) + key_Score.length;
	return body.substring(p, body.indexOf('<', p));
}

function getMovesFromBody(body){
	var p = 0;
	var list = [];
	for(;;){
		p = body.indexOf(key_Moves, p);
		if(p == -1) break;;
		p += key_Moves.length;
		list.push(body.substring(p, body.indexOf('"', p)));
	}
	return list;
}

function getCharsFromBody(body)
{
	var chars = "";
	var p = 0;
	for(var i = 0; i < 16; i++){
		p = body.indexOf(key_char, p) + 3 +  key_char.length;
		chars += body.charAt(p);
	}
	return chars;
}

function calcScoreForMoves(moves)
{
	var score = 0;
	for(var i = 0; i < moves.length; i++){
		score += Math.pow(wordKeysScores[calcKeyForWord(moves[i])] + 1, 2);
	}
	return score;
}

function checkResponse(err, res, body){
	var moves = getMovesFromBody(body);
	var roundCount = moves.length;
	var chars = getCharsFromBody(body);
	var isEnd = body.indexOf("You Win!") !== -1;
	var score = parseInt(getScoreFromBody(body));
	var seed = getSeedFromBody(body);
	var started = getStartedFromBody(body);
	if(!isEnd){
		// find word
		var word = getWordFromChars(chars);
		postWord(word, seed, started, moves);
	} else{
		// end of game
		//console.log("score: " + score);
		//console.log(moves);
		console.log(score);
		if(score > 1900){
			postScore(seed, started, moves);
		} else {
			//console.log("Try again");
			postWord();
		}
	}
}

var request = require('request');
function postWord(word, seed, started, moves){
	var options = {
		uri: "https://icanhazwordz.appspot.com",
		headers: {
			"Content-type": "application/x-www-form-urlencoded",
		},
	};
	if(word){
		options.uri += "?move=" + word;
		options.uri += "&Seed=" + seed;
		options.uri += "&Started=" + started;
		for(var i = 0; i < moves.length; i++){
			options.uri += "&Moves=" + moves[i];
		}
	}
	request.post(options, checkResponse);
}

function checkResponseForPostScore(err, res, body){
	//console.log(body);
	console.log("Score posted");
}

function postScore(seed, started, moves){
	var options = {
		uri: "https://icanhazwordz.appspot.com/highscores",
		headers: {
			"Content-type": "application/x-www-form-urlencoded",
		},
	};
	options.uri += "?Seed=" + seed;
	options.uri += "&Started=" + started;
	for(var i = 0; i < moves.length; i++){
		options.uri += "&Moves=" + moves[i];
	}
	options.uri += "&NickName=" + NickName;
	options.uri += "&URL=" + encodeURIComponent(URL);
	options.uri += "&Agent=" + "Robot";
	options.uri += "&Name=" + Name;
	options.uri += "&Email=" + encodeURIComponent(Email);
	request.post(options, checkResponseForPostScore);
}

if(process.argv.length < 6){
	console.log("node directSolver.js NickName Name Email URL");
	process.exit();
}
var NickName = process.argv[2];
var Name = process.argv[3];
var Email = process.argv[4];
var URL = process.argv[5];

console.log(NickName);
console.log(Name);
console.log(Email);
console.log(URL);

postWord();
