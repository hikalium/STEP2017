
var fs = require("fs");
var s = "" + fs.readFileSync("dictionary.words.txt");
var wordList = s.toUpperCase().split("\n");
var wordKeys = {};
var wordKeysScores = {};
var scoreCharTable3 = [74, 75, 81, 88, 90];
var scoreCharTable2 = [67, 70, 72, 76, 77, 80, 86, 87];
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
        if (scoreCharTable3.includes(i))
            score += alphaCountList[i] * 3;
        else if (scoreCharTable2.includes(i))
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
/*
for (var k in wordKeys) {
    console.log(k + "(" + wordKeysScores[k] + "):" + wordKeys[k]);
}
*/

function getWordFromChars(chars){
        var line = "" + chars;
        var key = calcKeyForWord(line);
        console.log("AVAILABLE CHARS: " + line);
        console.log("KEY: " + key);
        console.log("COMPLETE MATCH: ");
        console.log(wordKeys[key]);
        console.log("SUBSET MATCH: ");
        var candidateKeys = sortKeysByScore(getAvailableKeys(key));
        var bestKey = candidateKeys[0];
        var bestCandidate = wordKeys[bestKey][0];
        console.log(bestCandidate + "(" + wordKeysScores[bestKey] + ")");
		return bestCandidate;
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

function checkResponse(err, res, body){
	var moves = getMovesFromBody(body);
	var roundCount = moves.length;
	var chars = getCharsFromBody(body);
	var isEnd = body.indexOf("You Win!") !== -1;
	var score = parseInt(getScoreFromBody(body));
	var seed = getSeedFromBody(body);
	var started = getStartedFromBody(body);
	console.log("score: " + score);
	if(!isEnd){
		// find word
		console.log(moves);
		var word = getWordFromChars(chars);
		postWord(word, seed, started, moves);
	} else{
		// end of game
		postScore(word, seed, started, moves);
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
	console.log(body);
}

function postScore(word, seed, started, moves){
	var options = {
		uri: "https://icanhazwordz.appspot.com/highscores",
		headers: {
			"Content-type": "application/x-www-form-urlencoded",
		},
	};
	if(word){
		options.uri += "?Seed=" + seed;
		options.uri += "&Started=" + started;
		for(var i = 0; i < moves.length; i++){
			options.uri += "&Moves=" + moves[i];
		}
		options.uri += "&NickName=" + "hikalium";
		options.uri += "&URL=" + encodeURIComponent("https://github.com/hikalium/STEP2017");
		options.uri += "&Agent=" + "Robot";
		options.uri += "&Name=" + "";
		options.uri += "&Email=" + encodeURIComponent("");
	}
	request.post(options, checkResponseForPostScore);
}

postWord();
