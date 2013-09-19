


//.......................Rotor prototype..........................
function Rotor(subSet) {

		
	//the input output set is just the regular non moving alphabet 
	var ioSet =        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	//the basic set is matched to the substitution set to caculate the ofsets of the rotor
	//it rotates with the subsitution set
	var basicSet   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	//               "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
	
	//retrieve the notch setting and chop off the setting from the substitution set
	var notch = subSet[26];
	subSet = subSet.slice(0, 26);
	
	//stores outputs sent from the rotor functions
	var output; 
	
	
	//these three functions are for looking at the internal state of the rotor
	this.getBasicSet = function() {
		return basicSet;
	};
	
	this.getSubSet = function() {
		return subSet;
	};
	
	this.getNotch = function(){
		return notch; 
	};
			
	//takes an input char to the rotor and returns an output char
	this.getSubChar = function(input){
		output = ioSet[ basicSet.indexOf( subSet[ ioSet.indexOf(input) ] ) ]; 
		return output;
	};
	
	// takes a reverse input char to the rotor and returns an output char
	this.getRevSubChar = function(input){
		output = ioSet[ subSet.indexOf( basicSet[ ioSet.indexOf(input) ] ) ];	  
		return output; 
		
	};
	
	//rotates the rotor one click
	this.rotate = function(){
		basicSet = basicSet + basicSet[0];
		basicSet = basicSet.slice(1); 
		subSet = subSet + subSet[0];
		subSet = subSet.slice(1); 
	};

	this.checkNotch = function(){
		if(basicSet[25] == notch) {
			output =  true;
		}
		else {
			output = false; 
		}
		
		return output; 
	};
	
	this.setStartPosition = function(input){
		while(basicSet[0] != input) {
			this.rotate(); 
		}
	};
	
	
}

//................Enigma Core Machine prototype..................................
function EnigmaCore() {
	
	var rotorArray = new Array(); 
	var startSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var basicSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var plugboard ="LPGSZMHAEOQKVXRFYBUTNICJDW";
	
	
	//loads a new rotor Array into the machine
	this.loadRotors = function(inputRotorArray){
		rottorArray = inputRotorArray();
	
	};
	
	//sets all the rotors to their start positions specified in startSet
	this.setRotors = function() {
		
		//console.log(rotorArray[0].getBasicSet()); 
		//console.log(rotorArray.length); 
		
		for(var i=0; i< rotorArray.length; i++) {
			rotorArray[i].setStartPosition(startSet[i]); 
			//console.log(rotorArray[i].getBasicSet()); 
		}
	};
	
		
	//loads a new rotor start positions into the machine 
	this.loadStartSet= function(inputStartSet){
		startSet = inputStartSet;
	};
	
	//logs info about state of core machine
	//used for testing purposes
	var getState = function() {
		var position =""; 
		var notchState = "";
		for(x = 0; x < rotorArray.length; x++) {
			position = position + rotorArray[x].getBasicSet()[0]; 
			notchState = notchState + rotorArray[x].getNotch();
		}
		console.log(position);
		//console.log(notchState); 
		//console.log(rotorArray[0].checkNotch());
	};
	
	
	//rotates rotor one and any rotors that are currently notched
	var rotate = function() {
		
		var x = 0; 
		do
		{
			rotorArray[x].rotate();
			x++;
		} 
		while(x < rotorArray.length && rotorArray[x-1].checkNotch());
	};
	
	//for testing rotate the rotate function
	this.rotateTest = function(rotateNum){
		for(var x = 0; x < rotateNum; x++) {
			rotate(); 
		}
		getState(); 
	};
	
	//feeds a charachter through the machine and returns the result
	this.getSubChar = function(input){
		
		//used as return variable and in below loop
		var output;
	
		//rotate rotor 0 and notched rotors
		rotate(); 
		
		//feed input charachter through all rotors
		for(var x =0; x< rotorArray.length; x++) {
			output = rotorArray[x].getSubChar(input); 
			input = output; 
		}
		
		return output;
	};
	
	//reverse feeeds a charachter through the machine and returns the result
	this.getRevSubChar =function(input){
		
		//used as return variable and in below loop
		var output; 
		
		//rotate rotor 0 and notched rotors
		rotate(); 
		
		//feed charchater backward through all rotors
		for(var x =(rotorArray.length -1); x >= 0; x--) {
			output = rotorArray[x].getRevSubChar(input); 
			input = output; 
		}
		
		return output;
	};
	

	//encrypt an input string
	this.encrypt = function(inputMessage){
		var outputMessage = ""; 
		
		//console.log("Input Message:     " + inputMessage);
		
		//put message through plugboard
		outputMessage = this.plugboardIn(inputMessage); 
		inputMessage = outputMessage;
		outputMessage="";
		
		//console.log("Plugboard message: " + inputMessage);  
		
		//feeds inputMessage through machine and fills outputMessage
		for(var i = 0; i < inputMessage.length; i++) {
			//take next characther from the message
			input = inputMessage[i] 
			//feed charachter through machine
			output = this.getSubChar(input); 
			//add output charachter to the output message
			outputMessage = outputMessage + output;
		}
		
		//console.log("Final Message:     " + outputMessage);
		
		return outputMessage;
	};


	//decrypt an input string
	this.decrypt = function(inputMessage){
		var outputMessage = ""; 
		
		//reverse feeds inputMessage through machine and fills outputMessage
		for(var i = 0; i < inputMessage.length; i++) {
			//take next characther from the message
			input = inputMessage[i] 
			//feed charachter through machine
			output = this.getRevSubChar(input); 
			//add output charachter to the output message
			outputMessage = outputMessage + output;
		}
		
		
		//reverse message through plugboard
		inputMessage = outputMessage;
		outputMessage = this.plugboardOut(inputMessage); 
		

		return outputMessage;
	};

	
 
	 
	//takes a rotor set and builds a rotor Array that can be passed to EX Machine
	this.buildRotorArray = function(rotorSet) {
		
		var basicSet =    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

		var rotorBlock =  "LPGSZMHAEOQKVXRFYBUTNICJDWY\n" +
						  "SLVGBTFXJQOHEWIRZYAMKPCNDUE\n" +
						  "CJGDPSHKTURAWZXFMYNQOBVLIEN\n" +
						  "PEZUOHXSCVFMTBGLRINQJWAYDKY\n" +
						  "ZOUESYDKFWPCIQXHMVBLGNJRATE\n" +
						  "EHRVXGAOBQUSIMZFLYNWKTPDJCN\n" +
						  "JGDQOXUSCAMIFRVTPNEWKBLZYHN\n" +
						  "NTZPSFBOKMWRCJDIVLAEYUXHGQE\n" +
						  "JVIUBHTCDYAKEQZPOSGXNRMWFLY\n" +
						  "EKMFLGDQVZNTOWYHXUSPAIBRCJQ\n" +
						  "AJDKSIRUXBLHWTMCQGZNPYFVOEE\n" +
						  "BDFHJLCPRTXVZNYEIWGAKMUSQOV\n" +
						  "ESOVPZJAYQUIRHXLNFTGKDCMWBJ\n" +
						  "VZBRGITYUPSDNHLXAWMJQOFECKZ\n" +
						  "LVAWDKEJGMIHORNSQYPBZCFTXUQ\n" +
						  "WYKEXFINHQOPJRLTMSACVGBUZDV\n" +
						  "WTOKASUYVRBXJHQCPZEFMDINLGQ\n" +
						  "GJLPUBSWEMCTQVHXAOFZDRKYNIE\n" +
						  "JWFMHNBPUSDYTIXVZGRQLAOEKCV\n" +
						  "FGZJMVXEPBWSHQTLIUDYKCNRAOJ\n" +
						  "HEJXQOTZBVFDASCILWPGYNMURKZ\n" +
						  "KEDXVBSQHNCZTRUFLOAYWIPMJGF\n" +
						  "NUJPHWFMGDOBAVZQTXECLKYSIRO\n" +
						  "CIAHFQOYBXNUWJLVGEMSZKPDTRZ\n" +
						  "FKOQBLHNAPWDRUYSVGJEXMTCZIY\n" +
						  "VMWJNPAUTIFXBYGDZCRQKHOLSEE\n";
						
		var rotorSettingArray = rotorBlock.split("\n");
		var rotorArray = new Array();

		//takes given rotor choice and find it in the rotorSettingArray
		//adding it to the rotor set
		for(var i=0; i < rotorSet.length; i++){
			rotorArray[i] = new Rotor(rotorSettingArray[basicSet.indexOf(rotorSet[i])]); 
						
			//console.log(rotorArray[i].getSubSet());
		}

		return rotorArray;
	};
	 
	
	//takes a set of letters, builds a rotor set from it and loads it in the machine
	this.loadRotorSet = function(rotorSet) {
		rotorArray = this.buildRotorArray(rotorSet); 
	};

	//loads an enigma core key with all it's parts	
	this.setKey = function(key) {
		var rotorSet = key.rotorSet;
		this.loadRotorSet(rotorSet); 
		startSet = key.startSet; 
		plugboard = key.plugboard;
		
		//console.log(rotorSet); 
		//console.log(startSet);
		//console.log(plugboard); 
		
	};
	
			
	//simple plugboard substitution
	this.plugboardIn = function(input) {
		output = "";
	
		for(var i=0; i<input.length; i++){
			output = output + plugboard[basicSet.indexOf(input[i])];
		}
		return output; 
	};
	
	//simple reverse plugboard substitution 
	this.plugboardOut = function(input) {
		output = ""; 
		
		for(var i=0; i<input.length; i++){
			output = output + basicSet[plugboard.indexOf(input[i])];
		}
		return output; 
	};
	
	//when new machine made set default rotors
	this.loadRotorSet("ABCDEFGHIJKLMNOPQRSTUVWXYZ"); 
	
	
	//when machine starts set default startSet; 
	startSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	
	//when new machine made set rotor array to the startset
	this.setRotors(); 		
	
	
}


//................ASCII / Enigma Code Converter prototype.....................
function AsciiEnigmaConverter() {

	//takes an ASCII char and returns two enigma machine chars
	var toEnigmaChar = function(input) {

		var output = ""; 
		var basicSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var charCode = input.charCodeAt(); 
		var remainder = charCode % 26;
		var quotient = (charCode - remainder) / 26;
		
		if(quotient > 25) {
			quotient = 25;
			remainder = 25;
		}
		
		output = basicSet[quotient] + basicSet[remainder];
		
		//console.log(charCode, quotient, remainder, output); 

		return output; 

	};


	//takes two enigma machine chars and returns an ASCII char
	var toAsciiChar = function(input) {

		var output =""; 
		var basicSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var firstCharNum = basicSet.indexOf(input[0]);
		var secondCharNum = basicSet.indexOf(input[1]);
		var charCode = (firstCharNum * 26) + (secondCharNum);
		output = String.fromCharCode(charCode); 
		
		//console.log(firstCharNum, secondCharNum, charCode, output); 
		
		return output; 

	};

	//takes a string of ASCII chars and returns enigma code
	this.toEnigmaCode = function(input) {
		
		var output = "";
		
		//get enigma codes for each ASCII char
		for(var i=0; i < input.length; i++) {
		 output = output + toEnigmaChar(input[i]); 
		}
					
		return output; 
	};
	
	//takes enigma codes and returns ASCII chars
	this.toAsciiCode = function(input) {
		var output = "";
		
		//get ASCII char for each set of enigma codes
		for(var i=0; i < input.length; i=i+2) {
		 //console.log(input.substr(i,2)); 
		 output = output + toAsciiChar(input.substr(i,2)); 
		}
					
		return output; 
	};
	
	
	
}



//....................Think Ding Converter prototype.....................
function ThinkDinger() {
	
	var basicSet =    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var thinkDingSet ="☀☢♗☯☠✈♞❂☭✂☏☽✎✿☮❉♕✪✌☸☹☁♬★♖☂";
	var output = ""
	
	//converts Enigma Code to Think Ding code
	this.toThinkDing = function(input) {
		output = "";
	
		for(var i=0; i<input.length; i++){
			output = output + thinkDingSet[basicSet.indexOf(input[i])];
		}
		return output; 
	};
	
	//converts Think Ding Code to Enigma Code
	this.toEnigmaCode = function(input) {
		output = ""; 
		
		for(var i=0; i<input.length; i++){
			output = output + basicSet[thinkDingSet.indexOf(input[i])];
		}
		return output; 
	};
}


//......................String Tester Prototype................
function StringTester() {

	var basicSet =    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var thinkDingSet ="☀☢♗☯☠✈♞❂☭✂☏☽✎✿☮❉♕✪✌☸☹☁♬★♖☂";
	
	
	this.isEnigmaCode = function(input) {
		
		for(var i=0; i<input.length; i++){
		 // this function needs fixin, does nothin righ tnow
		 // but is not being used by enigmaX
		}
	};
	
	//test to make sure string is in ascii range
	this.isAsciiCode = function(input) {
		var output = true; 
				
		
		//note this is testing for my ascii range not real ascii range
		for(var i=0; i<input.length; i++){
			if(input.charCodeAt(i) > 675) {
				output = false;
				break; 
			}
		}
	
		return output; 
	};
	
	//checks if string is composed of thinkDingChars
	this.isThinkDing = function(input) {
		var output = true; 
		
		for(var i=0; i<input.length; i++){
			if(thinkDingSet.indexOf(input[i]) === -1){
				output = false;
				break; 
			}
		}
		
		return output; 
	}; 
	

}

//..............Random Generator Protoype.............
function RandomGen() 
{
	//0 to 4294967295 - range of a 32 bit integer- (2^32)-1
	var max32BitInt = 4294967295;
	//holds 100 sjcl random numbers
	this.randomArray = sjcl.random.randomWords(100);
		
	//gets a random 32 bit positive integer 
	this.getRandom32BitInt= function() {
		
		//get random number from randomArray
		var randomNum = this.randomArray.shift();
		//console.log(randomNum); 
		
		//if random array is now empty reload it
		if(this.randomArray.length == 0) {
			this.randomArray = sjcl.random.randomWords(100); 
		}

		//if random number is negative convert it to a postive 
		//integer without creating a bit bias
		if(randomNum < 0) {
			randomNum = Math.abs(randomNum); 
			randomNum = randomNum + 0x80000000;
		}
		
		return randomNum; 
	};
	
	//gets a random int from 0 to specified range
	this.getRandomNum =function(range) {
		var randomNum = 0;
		
		//gets number and puts it in range, if out
		//of distribution range throw out and try again
		do {
			randomNum = this.getRandom32BitInt();
			randomNum = toRange(randomNum, range); 
		} while (randomNum == null);
		
		return randomNum; 
	};

	//takes a 32 bit integer and retunrs a number in a range from 0 to range
	//specified, returning null for numbers that would creat an uneven distribution
	var toRange =function(number, range) {
		
		var output = 0;
		//add 1 so number%range returns numbers up to range
		range++
			
		//get the range  within max32BitInt for an even distribution
		var maxForEvenDist = (max32BitInt - (max32BitInt % range)) -1;
		//console.log("evenDistRange: "+ evenDistRange); 
		
		if(number > maxForEvenDist) {
			output = null; 
		} 
		else {
			output = number % range;
		}
		
		return output; 
	}; 
	
	this.toRange = toRange; 
	
	
	//test toRange function checking for even distribution
	this.testDist = function() {
		var array = new Array(); 
		var exceptionCount = 0; 
		var range = 0;
		
		//test value since real value is not testable
		max32BitInt = 6000;
		
		
		for(var i = 0; i <=max32BitInt; i++) {

			if(toRange(i, range) != null ) {
				if(array[toRange(i, range)] == null) {
					array[toRange(i, range)] = 1;
				}
				else {
					array[toRange(i, range)] = array[toRange(i, range)] + 1; 
				}
			}
			else {
				exceptionCount++; 
			}
		}

		//console.log(array); 
		//console.log(exceptionCount); 
		
		//return max32BitInt to it's correct value
		max32BitInt = 4294967295;
	
	};

}

//............Key Generator Prototype..............
function KeyGen() {
	
	var randomGen = new RandomGen(); 
	var basicSet   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	

	this.getKey = function(){
		var key = {rotorSet: "", startSet: "", plugboard: ""};
	
		for(var i = 0; i<26; i++) {
			key.rotorSet = key.rotorSet + basicSet[randomGen.getRandomNum(25)];
		}

		for(var i = 0; i<26; i++) {
			key.startSet = key.startSet + basicSet[randomGen.getRandomNum(25)];
		}

		var randomChar = ""; 
		for(var i = 25; i>=0; i--) {
			randomNum = randomGen.getRandomNum(i);
			randomChar= basicSet[randomNum];
			key.plugboard = key.plugboard + randomChar;
			basicSet = basicSet.replace(randomChar,''); 
		}
		basicSet   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		
		return key; 
	};
	
	this.getTinyKey = function() {
		var tinyKey = {	rotorSet: "", startSet: "", plugboard: basicSet};
		
		for(var i = 0; i<3; i++) {
			tinyKey.rotorSet = tinyKey.rotorSet + basicSet[randomGen.getRandomNum(25)];
		}

		for(var i = 0; i<3; i++) {
			tinyKey.startSet = tinyKey.startSet + basicSet[randomGen.getRandomNum(25)];
		}
		
		return tinyKey; 
	};

}


//...........EnigmaX Machine Prototype.............
function EnigmaXMachine(){

	var basicSet   =     "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var inputMessage = "";
	var outputMessage =""; 
	
	//build all components of the machine
	var enigmaCore = new EnigmaCore();
	var enigmaTiny = new EnigmaCore(); 
	var aeConverter = new AsciiEnigmaConverter(); 
	var tdConverter = new ThinkDinger(); 
	var sTester = new StringTester(); 
	var keyGen = new KeyGen(); 
	var tinyKey = keyGen.getTinyKey();
	
	
	
	//generate a random enigmaCore key
	var key = keyGen.getKey();  
	//set the key in the core machine
	enigmaCore.setKey(key);
	//enigmaX key in thinkDing
	var thinkDingKey ="";
	
	this.newKey = function() {
		//generate a new enigma key
		key = keyGen.getKey();
		//set key in enigma core machine
		enigmaCore.setKey(key);
		
		//translate to a thinkDing key
		thinkDingKey = 	tdConverter.toThinkDing(key.rotorSet) + '\n' +
						tdConverter.toThinkDing(key.startSet) + '\n' +
						tdConverter.toThinkDing(key.plugboard);
		
		//return the thinkDing version
		return thinkDingKey; 
		
	};
	
	
	//load a thinkDing key into the machine
	this.loadKey = function(keyString) {
		
		var output =""; 
		//thinkDing key will hold 78 thinkDing Chars
		var thinkDingKey ="";
		
		//find any thinkDing chars and put them in the thinkDing
		//string until it reaches 78 chars or end of string is reached
		for(var i=0; thinkDingKey.length < 78 &&  i < keyString.length; i++) {
			if(sTester.isThinkDing(keyString[i])) {
				thinkDingKey = thinkDingKey + keyString[i];
			}
		}
		
		if(thinkDingKey.length < 78) {
			output = "Invalid Key!"; 
		}
		else {		
								
			key.rotorSet = tdConverter.toEnigmaCode(thinkDingKey.substr(0, 26)); 
			key.startSet = tdConverter.toEnigmaCode(thinkDingKey.substr(26, 26)); 
			key.plugboard = tdConverter.toEnigmaCode(thinkDingKey.substr(52, 26)); 
			
			
			
			output = 	thinkDingKey.substr(0, 26) + '\n' +
						thinkDingKey.substr(26, 26) + '\n' +
						thinkDingKey.substr(52, 26);
		}
	
		
	
		//set key in enigma core
		enigmaCore.setKey(key);
		
		return output; 
	};
	
	
	//encrypt-decrypt a message 
	this.crypt = function(inputMessage){
				
		//check if message is ascii
		if(sTester.isAsciiCode(inputMessage)) {
			
			//convert the message to Enigma usalbe code
			outputMessage = aeConverter.toEnigmaCode(inputMessage); 
			inputMessage = outputMessage; 
			
			
			//generate a message key and load it into enigmaTiny
			tinyKey = keyGen.getTinyKey();
			enigmaTiny.setKey(tinyKey);  
									
			//push message through enigmaTiny
			enigmaTiny.setRotors(); 
			outputMessage = enigmaTiny.encrypt(inputMessage); 
			
			//append tiny key to message
			outputMessage = tinyKey.rotorSet + tinyKey.startSet + outputMessage;
			inputMessage = outputMessage;
			
			
			//push the message through the enigma core machine
			enigmaCore.setRotors(); 
			outputMessage = enigmaCore.encrypt(inputMessage); 
						
			
			//append version code
			inputMessage = "GG" + outputMessage;
			
			//convert the message to thinkDing code
			outputMessage = tdConverter.toThinkDing(inputMessage); 
			
			

		}
		//check if message is thinkDing and has the min start chars
		else if(sTester.isThinkDing(inputMessage) && inputMessage.length >= 10) {
			
			//convert message from thinkDing to Enigma code
			outputMessage = tdConverter.toEnigmaCode(inputMessage);
			
			
			//remove version code
			inputMessage = outputMessage.substr(2);
			
			//push Enigma code backward through the machine
			enigmaCore.setRotors(); 
			outputMessage = enigmaCore.decrypt(inputMessage); 
			
			
			//extract and remove tiny key from message
			tinyKey.rotorSet = outputMessage.substr(0,3);
			tinyKey.startSet = outputMessage.substr(3,3);
			tinyKey.plugboard = basicSet; 
			inputMessage = outputMessage.substr(6);
			
			//set enigmaTiny key
			enigmaTiny.setKey(tinyKey); 
			
			//push message backward through enigmaTiny
			enigmaTiny.setRotors(); 
			outputMessage = enigmaTiny.decrypt(inputMessage); 
			inputMessage = outputMessage;
			
			
			//convert Enigma code to ASCII code
			outputMessage = aeConverter.toAsciiCode(inputMessage); 
		}
		//if message is not thinkDing or ascii, or is to short
		else {
			outputMessage = "Invalid Message!"; 
		}
		
		return outputMessage; 
	};


}


//.................DOM Handlers.....................
var messagDiv = document.getElementById("messageDiv");
var loadDiv = document.getElementById("loadDiv");
var aboutDiv = document.getElementById("aboutDiv");

var keyBox = document.getElementById("keyBox1").children[0];
var messageBox = document.getElementById("messageBox").children[0];

var enigmaXButton = document.getElementById("buttonArea1").children[0];
var aboutButton = document.getElementById("buttonArea1").children[3];

var loadButton = document.getElementById("buttonArea2").children[0];
var newKeyButton = document.getElementById("buttonArea2").children[1];
var cryptButton = document.getElementById("buttonArea2").children[2];

var inputDoneButton = document.getElementById("buttonArea3").children[0];
var inputLoadButton = document.getElementById("buttonArea3").children[1];
var inputKeyBox = document.getElementById("keyBox2").children[0];

var contextMenuOn = false; 
var messageBoxDefault = "paste or type your message here....";
var inputKeyBoxDefault = "\npaste your key here and click load...";


messageBox.value = messageBoxDefault; 
inputKeyBox.value = inputKeyBoxDefault;

loadDiv.style.display = "none";
aboutDiv.style.display ="none";

enigmaXButton.style.color = "#333"; 
enigmaXButton.style.backgroundColor = "#ccc";
enigmaXButton.style.borderColor = "#ccc"; 


//.......................The Program......................
var enigmaXMachine = new EnigmaXMachine();

//create a new key in the enigmaX machine and
//display the key in the keybox 
keyBox.value = 	enigmaXMachine.newKey(); 
	


//blinks the border of boxes red when user
//sends invalid input
function blinkRed(element) {
	element.style.borderColor = "red";
	setTimeout(function(){element.style.borderColor = '';},250);

}
				
//.........Event Handlers..............				


newKeyButton.onclick = function() {
	keyBox.value = 	enigmaXMachine.newKey(); 
};


cryptButton.onclick = function() {
	var message = messageBox.value;
	
	if(message == messageBoxDefault){
		message == "Invalid Message!";
		blinkRed(messageBox); 
	}
	else {
		message = enigmaXMachine.crypt(message);
	}
	
	if(message == "Invalid Message!") {
		blinkRed(messageBox); 
	}
	else {
		messageBox.value = message; 
	}
};

loadButton.onclick = function() {
	inputKeyBox.value = inputKeyBoxDefault;
	messageDiv.style.display = "none";
	loadDiv.style.display = '';
};




messageBox.onfocus = function() {

	if(messageBox.value == messageBoxDefault) {
		messageBox.value = "";
	}

};


messageBox.onmouseout = function() {

	if(messageBox.value == "" && !contextMenuOn) {
		messageBox.value = messageBoxDefault;
		messageBox.blur();
	}
	
};

messageBox.oncontextmenu = function() {
	contextMenuOn = true; 
}

document.onclick = function() {
	contextMenuOn = false; 
}

/*window.blur = function() {
	contextMenuOn = false; 
}*/

keyBox.onclick = function() {
	keyBox.select();
}

inputLoadButton.onclick = function() {
	var thinkDingKey = enigmaXMachine.loadKey(inputKeyBox.value); 	
	if(thinkDingKey == "Invalid Key!") {
		blinkRed(inputKeyBox); 
	}
	else {
		keyBox.value = thinkDingKey;
					
	}
};

inputDoneButton.onclick = function() {
	messageDiv.style.display = '';
	loadDiv.style.display = 'none';
}

inputKeyBox.onfocus = function() {
	if(inputKeyBox.value == inputKeyBoxDefault) {
		inputKeyBox.value = "";
	}

};

inputKeyBox.onmouseout = function() {
	if(inputKeyBox.value == "" && !contextMenuOn) {
		inputKeyBox.value = inputKeyBoxDefault;
		inputKeyBox.blur(); 
	}
};

inputKeyBox.oncontextmenu = function() {
	contextMenuOn = true; 
}

enigmaXButton.onclick = function() {
	keyBox.style.display = '';
	messageDiv.style.display = '';
	aboutDiv.style.display = 'none';
	loadDiv.style.display = 'none';
	
	enigmaXButton.style.color = "#333"; 
	enigmaXButton.style.backgroundColor = "#ccc";
	enigmaXButton.style.borderColor = "#ccc"; 
	
	aboutButton.style.color = ''; 
	aboutButton.style.backgroundColor = '';
	aboutButton.style.borderColor = ''; 

	
}

aboutButton.onclick = function() {
	keyBox.style.display = 'none';
	messageDiv.style.display = 'none';
	aboutDiv.style.display = '';
	loadDiv.style.display = 'none';
	
	enigmaXButton.style.color = ''; 
	enigmaXButton.style.backgroundColor = '';
	enigmaXButton.style.borderColor = ''; 
	
	aboutButton.style.color = "#333"; 
	aboutButton.style.backgroundColor = "#ccc";
	aboutButton.style.borderColor = "#ccc"; 

	
}


 
 
 
 

